const express = require('express');
const fs = require('fs');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY || 'playwright-pdf-secret-key';

// Auth middleware
function authMiddleware(req, res, next) {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
}

// Extract base domain from URL (e.g., https://www.bancodebogota.com)
function getBaseDomain(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return null;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'playwright-pdf-service' });
});

// Main endpoint: extract PDF from URL
app.post('/extract-pdf', authMiddleware, async (req, res) => {
  const { url, timeout = 90000 } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }

  console.log(`[${new Date().toISOString()}] Extracting PDF: ${url}`);

  let browser = null;

  try {
    browser = await chromium.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--lang=es-CO,es',
      ],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      locale: 'es-CO',
      timezoneId: 'America/Bogota',
      viewport: { width: 1920, height: 1080 },
      acceptDownloads: true,
      extraHTTPHeaders: {
        'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,*/*;q=0.8',
      },
    });

    // Remove webdriver flag and other automation signals
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      Object.defineProperty(navigator, 'languages', {
        get: () => ['es-CO', 'es', 'en-US', 'en'],
      });
      window.chrome = { runtime: {}, loadTimes: () => {}, csi: () => {} };
      // Hide automation-related properties
      delete navigator.__proto__.webdriver;
    });

    const page = await context.newPage();

    // Intercept PDF responses
    let pdfBuffer = null;

    // Route-level interceptor: captures PDFs BEFORE Chrome's PDF viewer consumes the body.
    // page.on('response') fires too late for Chrome's built-in PDF viewer — by the time it
    // fires, the viewer has already consumed the response body making response.body() fail.
    await page.route('**/*', async (route) => {
      const request = route.request();
      const reqUrl = request.url();
      const resourceType = request.resourceType();

      // Only intercept requests that could be PDFs (documents, fetches, or .pdf URLs)
      if (
        resourceType !== 'document' &&
        resourceType !== 'fetch' &&
        resourceType !== 'other' &&
        !reqUrl.match(/\.pdf/i)
      ) {
        await route.continue();
        return;
      }

      let response;
      try {
        response = await route.fetch();
      } catch (e) {
        await route.continue();
        return;
      }

      if (!pdfBuffer) {
        const ct = response.headers()['content-type'] || '';
        const isPdf =
          ct.includes('application/pdf') ||
          ct.includes('application/octet-stream') ||
          reqUrl.match(/\.pdf(\?|$)/i);

        if (isPdf) {
          try {
            const body = await response.body();
            if (body && body.length > 1000 && body.subarray(0, 5).toString().startsWith('%PDF')) {
              pdfBuffer = body;
              console.log(`  Route intercepted PDF: ${body.length} bytes from ${reqUrl}`);
            }
          } catch (e) {
            // ignore
          }
        }
      }

      await route.fulfill({ response });
    });

    // Handle download events — track completion so we can properly await it
    let downloadBuffer = null;
    let downloadDone = Promise.resolve();
    context.on('page', () => {}); // Accept new pages/popups

    page.on('download', (download) => {
      downloadDone = (async () => {
        try {
          const dlPath = await download.path();
          if (dlPath) {
            downloadBuffer = fs.readFileSync(dlPath);
            console.log(`  Download captured: ${downloadBuffer.length} bytes`);
          }
        } catch (e) {
          console.log(`  Download error: ${e.message}`);
        }
      })();
    });

    // STEP 1: Visit the bank's homepage first to establish cookies/session
    const baseDomain = getBaseDomain(url);
    if (baseDomain) {
      console.log(`  Step 1: Visiting bank homepage: ${baseDomain}`);
      try {
        await page.goto(baseDomain, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });
        // Wait for any anti-bot JS to execute
        await page.waitForTimeout(3000);
        console.log(`  Homepage loaded. Cookies established.`);
      } catch (e) {
        console.log(`  Homepage visit ended: ${e.message.substring(0, 80)}`);
      }
    }

    // STEP 2: Try direct HTTP request (bypasses browser PDF viewer)
    console.log(`  Step 2: Trying direct HTTP request...`);
    try {
      const directResponse = await context.request.get(url, { timeout: timeout });
      const directBody = await directResponse.body();
      const directContentType = directResponse.headers()['content-type'] || '';

      if (directBody && directBody.length > 1000 && directBody.slice(0, 5).toString().startsWith('%PDF')) {
        console.log(`  SUCCESS via direct request: ${directBody.length} bytes (${directContentType})`);
        await browser.close();
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': directBody.length,
          'Content-Disposition': 'attachment; filename="extracted.pdf"',
        });
        return res.send(directBody);
      }
      console.log(`  Direct request: not a PDF (${directContentType}, ${directBody.length} bytes)`);
    } catch (e) {
      console.log(`  Direct request failed: ${e.message.substring(0, 100)}`);
    }

    // STEP 3: Fall back to page navigation (for JS-heavy sites that need rendering)
    pdfBuffer = null;
    downloadBuffer = null;
    console.log(`  Step 3: Navigating to PDF URL via browser...`);
    try {
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: timeout,
      });
    } catch (navError) {
      console.log(`  Navigation ended: ${navError.message.substring(0, 100)}`);
    }

    // Wait for download to complete if one was triggered, with a 15s safety timeout
    await Promise.race([downloadDone, page.waitForTimeout(15000)]);

    // Check if we got the PDF via response interception
    if (pdfBuffer) {
      console.log(`  SUCCESS via response interception: ${pdfBuffer.length} bytes`);
      await browser.close();
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length,
        'Content-Disposition': 'attachment; filename="extracted.pdf"',
      });
      return res.send(pdfBuffer);
    }

    // Check if we got it via download
    if (downloadBuffer && downloadBuffer.length > 1000) {
      console.log(`  SUCCESS via download: ${downloadBuffer.length} bytes`);
      await browser.close();
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': downloadBuffer.length,
        'Content-Disposition': 'attachment; filename="extracted.pdf"',
      });
      return res.send(downloadBuffer);
    }

    // STEP 4: Detect PDF viewer and extract PDF
    const currentUrl = page.url();
    console.log(`  Step 4: Checking for PDF viewer at ${currentUrl}`);

    // 4a: Chrome's native PDF viewer — detect <embed> and re-fetch the src directly
    const embedSrc = await page.evaluate(() => {
      const embed = document.querySelector('embed[type="application/pdf"]');
      return embed ? (embed.src || embed.getAttribute('src')) : null;
    });

    if (embedSrc) {
      console.log(`  Detected Chrome PDF viewer, re-fetching: ${embedSrc}`);
      try {
        const embedResponse = await context.request.get(embedSrc, { timeout: 30000 });
        const embedBody = await embedResponse.body();
        if (embedBody && embedBody.length > 1000 && embedBody.subarray(0, 5).toString().startsWith('%PDF')) {
          console.log(`  SUCCESS via PDF viewer re-fetch: ${embedBody.length} bytes`);
          await browser.close();
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': embedBody.length,
            'Content-Disposition': 'attachment; filename="extracted.pdf"',
          });
          return res.send(embedBody);
        }
      } catch (e) {
        console.log(`  PDF viewer re-fetch failed: ${e.message.substring(0, 80)}`);
      }
    }

    // 4b: HTML PDF viewer — find and click download buttons (simulate human behavior)
    const downloadSelectors = [
      '#download',
      '#downloadButton',
      'button[aria-label*="download" i]',
      'button[aria-label*="descargar" i]',
      'button[title*="download" i]',
      'button[title*="descargar" i]',
      'a[download]',
      '[data-testid*="download" i]',
    ];

    for (const selector of downloadSelectors) {
      const el = await page.$(selector);
      if (el && await el.isVisible().catch(() => false)) {
        console.log(`  Found download button: ${selector}, clicking...`);
        downloadBuffer = null;
        downloadDone = Promise.resolve();

        page.once('download', (download) => {
          downloadDone = (async () => {
            try {
              const dlPath = await download.path();
              if (dlPath) {
                downloadBuffer = fs.readFileSync(dlPath);
                console.log(`  Button download captured: ${downloadBuffer.length} bytes`);
              }
            } catch (e) {
              console.log(`  Button download error: ${e.message}`);
            }
          })();
        });

        await el.click();
        await Promise.race([downloadDone, page.waitForTimeout(10000)]);

        if (downloadBuffer && downloadBuffer.length > 1000) {
          console.log(`  SUCCESS via download button: ${downloadBuffer.length} bytes`);
          await browser.close();
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': downloadBuffer.length,
            'Content-Disposition': 'attachment; filename="extracted.pdf"',
          });
          return res.send(downloadBuffer);
        }
        break;
      }
    }

    // STEP 5: Find embedded PDF links in the page and re-fetch directly
    const pdfLink = await page.evaluate(() => {
      const obj = document.querySelector('object[type="application/pdf"]');
      if (obj) return obj.data;

      const iframe = document.querySelector('iframe[src*=".pdf"]');
      if (iframe) return iframe.src;

      const links = Array.from(document.querySelectorAll('a[href*=".pdf"]'));
      if (links.length > 0) return links[0].href;

      return null;
    });

    if (pdfLink && pdfLink !== url) {
      console.log(`  Found embedded PDF link, re-fetching: ${pdfLink}`);
      try {
        const linkResponse = await context.request.get(pdfLink, { timeout: 30000 });
        const linkBody = await linkResponse.body();
        if (linkBody && linkBody.length > 1000 && linkBody.subarray(0, 5).toString().startsWith('%PDF')) {
          console.log(`  SUCCESS via embedded link re-fetch: ${linkBody.length} bytes`);
          await browser.close();
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': linkBody.length,
            'Content-Disposition': 'attachment; filename="extracted.pdf"',
          });
          return res.send(linkBody);
        }
      } catch (e) {
        console.log(`  Embedded link re-fetch failed: ${e.message.substring(0, 80)}`);
      }
    }

    // Return debug info
    const finalContent = await page.content();
    const pageTitle = await page.title();
    const finalUrl = page.url();
    await browser.close();

    console.log(`  FAILED. Title: "${pageTitle}", URL: ${finalUrl}, Content: ${finalContent.length} chars`);
    // Log first 500 chars of page for debugging
    console.log(`  Page preview: ${finalContent.substring(0, 500)}`);

    res.status(422).json({
      error: 'Could not extract PDF from URL',
      pageTitle,
      finalUrl,
      pageContentLength: finalContent.length,
      pagePreview: finalContent.substring(0, 300),
      url,
    });
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    if (browser) await browser.close();

    res.status(500).json({
      error: error.message,
      url,
    });
  }
});

// HTML extraction endpoint — fallback when ScraperAPI fails on bot-protected pages
app.post('/extract-html', authMiddleware, async (req, res) => {
  const { url, timeout = 60000 } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }

  console.log(`[${new Date().toISOString()}] Extracting HTML: ${url}`);

  let browser = null;
  try {
    browser = await chromium.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--lang=es-CO,es',
      ],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      locale: 'es-CO',
      timezoneId: 'America/Bogota',
      viewport: { width: 1920, height: 1080 },
      extraHTTPHeaders: {
        'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['es-CO', 'es', 'en-US', 'en'] });
      window.chrome = { runtime: {}, loadTimes: () => {}, csi: () => {} };
      delete navigator.__proto__.webdriver;
    });

    const page = await context.newPage();

    // Step 1: Visit homepage to establish cookies/session
    const baseDomain = getBaseDomain(url);
    if (baseDomain) {
      try {
        await page.goto(baseDomain, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000);
        console.log(`  Homepage loaded.`);
      } catch (e) {
        console.log(`  Homepage visit ended: ${e.message.substring(0, 80)}`);
      }
    }

    // Step 2: Navigate to target URL and wait for JS to render
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout });
    } catch (e) {
      console.log(`  Navigation ended: ${e.message.substring(0, 100)}`);
    }

    // Extra wait for dynamic content (SPAs, lazy-loaded rate tables)
    await page.waitForTimeout(3000);

    const html = await page.content();
    const title = await page.title();
    const finalUrl = page.url();

    await browser.close();

    console.log(`  HTML extracted: ${html.length} chars, title: "${title}"`);

    // Return { data: html } to match ScraperAPI Fallback response format
    // so that Extract Body node can consume either without changes
    res.json({ data: html, title, finalUrl, url, length: html.length });
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    if (browser) await browser.close();
    res.status(500).json({ error: error.message, url });
  }
});

app.listen(PORT, () => {
  console.log(`Playwright PDF Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Extract PDF:  POST http://localhost:${PORT}/extract-pdf`);
  console.log(`\nTo expose via tunnel: cloudflared tunnel --url http://localhost:${PORT}`);
});
