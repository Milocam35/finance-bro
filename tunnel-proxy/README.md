# Tunnel Proxy

Reverse proxy que expone la **API de NestJS** y el **servicio Playwright PDF** a través de un único túnel de Cloudflare hacia n8n Cloud.

## Problema que resuelve

Cloudflare permite solo un túnel por proceso. Este proxy unifica ambos servicios locales bajo un único puerto (`3002`), enrutando por prefijo de URL:

```
Cloudflare Tunnel (1 URL pública)
        │
        ▼
  tunnel-proxy :3002
  ├── /api/*  →  NestJS API      :3000
  └── /pdf/*  →  Playwright PDF  :3001
```

## Requisitos previos

- Node.js 18+
- NestJS API corriendo en `localhost:3000`
- Playwright PDF Service corriendo en `localhost:3001`
- `cloudflared` instalado ([descargar](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/))

## Instalación

```bash
cd tunnel-proxy
npm install
```

## Inicio (3 terminales)

**Terminal 1 — NestJS API:**
```bash
cd finance-bro-api
npm run start:dev
```

**Terminal 2 — Playwright PDF Service:**
```bash
cd playwright-pdf-service
npm start
```

**Terminal 3 — Tunnel Proxy + Cloudflare:**
```bash
cd tunnel-proxy
npm start
# En otra terminal (o mismo proceso en background):
npm run tunnel
```

`npm run tunnel` es equivalente a:
```bash
cloudflared tunnel --url http://localhost:3002
```

Cloudflare imprimirá una URL pública como:
```
https://some-random-words.trycloudflare.com
```

## Rutas disponibles

| Prefijo | Destino | Ejemplo |
|---|---|---|
| `/api/*` | NestJS `:3000` | `/api/scraping/ingest` |
| `/pdf/*` | Playwright `:3001` | `/pdf/extract-pdf` |
| `/health` | Tunnel Proxy | Verifica que el proxy corra |

> El prefijo `/pdf` se elimina antes de llegar al servicio Playwright (`/pdf/extract-pdf` → `/extract-pdf`).
> El prefijo `/api` se **conserva** porque NestJS lo espera (`/api/scraping/ingest` → `/api/scraping/ingest`).

## Variables de entorno

```env
PORT=3002                              # Puerto del proxy (default: 3002)
NESTJS_URL=http://localhost:3000       # URL de la API NestJS
PLAYWRIGHT_URL=http://localhost:3001   # URL del servicio Playwright
```

Ejemplo con valores personalizados:
```bash
NESTJS_URL=http://localhost:3005 npm start
```

## Configuración en n8n

Una vez que el túnel esté activo, copia la URL de Cloudflare y actualiza el nodo **Store Config** del workflow **ScrapingEngine** en n8n:

```js
return [{
  json: {
    tunnel_url: 'https://xxxx-yyyy.trycloudflare.com',  // ← URL del túnel
    playwright_api_key: 'tu_clave_playwright',
    nestjs_api_key: 'tu_api_key_de_nestjs',
  }
}];
```

Los nodos del workflow usan:
- **Playwright PDF:** `tunnel_url + '/pdf/extract-pdf'`
- **NestJS Ingest:** `tunnel_url + '/api/scraping/ingest'`

## Verificar que todo funciona

```bash
# Health check del proxy
curl http://localhost:3002/health

# Test de la API a través del proxy
curl http://localhost:3002/api/health

# Test del servicio PDF a través del proxy
curl -X POST http://localhost:3002/pdf/extract-pdf \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/doc.pdf"}'
```

## Logs

El proxy imprime cada request enrutado:

```
[API] POST /api/scraping/ingest → http://localhost:3000/api/scraping/ingest
[PDF] POST /pdf/extract-pdf → http://localhost:3001/extract-pdf
```
