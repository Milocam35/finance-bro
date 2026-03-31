const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3002;

const NESTJS_URL = process.env.NESTJS_URL || 'http://localhost:3000';
const PLAYWRIGHT_URL = process.env.PLAYWRIGHT_URL || 'http://localhost:3001';

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'tunnel-proxy',
    routes: {
      '/api/*': NESTJS_URL,
      '/pdf/*': PLAYWRIGHT_URL,
    },
  });
});

// /pdf/* → Playwright PDF Service (strip /pdf prefix)
app.use(
  createProxyMiddleware({
    target: PLAYWRIGHT_URL,
    changeOrigin: true,
    pathFilter: '/pdf',
    pathRewrite: { '^/pdf': '' },
    on: {
      proxyReq: (proxyReq, req) => {
        console.log(`[PDF] ${req.method} ${req.url} → ${PLAYWRIGHT_URL}${req.url.replace(/^\/pdf/, '')}`);
      },
    },
  }),
);

// /api/* → NestJS API (keep /api prefix since NestJS expects it)
app.use(
  createProxyMiddleware({
    target: NESTJS_URL,
    changeOrigin: true,
    pathFilter: '/api',
    on: {
      proxyReq: (proxyReq, req) => {
        console.log(`[API] ${req.method} ${req.url} → ${NESTJS_URL}${req.url}`);
      },
    },
  }),
);

app.listen(PORT, () => {
  console.log(`Tunnel Proxy running on port ${PORT}`);
  console.log(`  /api/*  → ${NESTJS_URL}`);
  console.log(`  /pdf/*  → ${PLAYWRIGHT_URL}`);
  console.log(`\nTo expose via tunnel: cloudflared tunnel --url http://localhost:${PORT}`);
});
