# Despliegue en Hostinger VPS — FinanceBro

Guía paso a paso para llevar FinanceBro a producción en un **VPS de Hostinger (KVM 2)**, con la base de datos en **Supabase** y el **Playwright en tu máquina local** (IP residencial) conectado por un **Cloudflare Named Tunnel**.

## Arquitectura

```
              Supabase (DB gestionada)              Máquina LOCAL (casa)
            productos │  usuarios                   playwright-pdf-service :3001
                      ▼                                      ▲ IP residencial
┌───────────────── VPS Hostinger (KVM 2) ──────────────┐    │ cloudflared (named tunnel)
│ Caddy (HTTPS auto)                                    │    │
│  ├─ app.<dom> → frontend (nginx → /api, /api/auth)    │    │  pdf.<dom>
│  └─ n8n.<dom> → n8n  ── usa ──► API_URL + PDF_SERVICE_URL ──┘
│ redis · backend :3000 · users-api :3001               │
│ n8n :5678 · n8n-postgres (metadata)                   │
└───────────────────────────────────────────────────────┘
```

Servicios en el VPS (`docker-compose.prod.yml`): `caddy`, `frontend`, `backend`, `users-api`, `redis`, `n8n`, `n8n-postgres`.

---

## Prerrequisitos

- Cuenta Hostinger con un **VPS KVM 2** (2 vCPU / 8 GB / 100 GB) — Ubuntu 22.04+.
- Un **dominio** (puede comprarse en Hostinger) y una cuenta **Cloudflare** (plan free).
- Los **2 proyectos de Supabase** ya migrados (productos + usuarios).
- (Opcional pero recomendado) cuenta de **Docker Hub** si luego automatizas el build en CI.

---

## Paso 0 — Dominio + Cloudflare

1. Compra el dominio (ej. `financebro.co`).
2. En Cloudflare → **Add a site** → agrega tu dominio (plan Free).
3. Copia los **2 nameservers** que te da Cloudflare y cámbialos en el registrador (en Hostinger: Domains → DNS/Nameservers). La propagación tarda minutos–horas.
4. En Cloudflare → **DNS** crea:
   | Tipo | Nombre | Contenido | Proxy |
   |------|--------|-----------|-------|
   | A | `app` | `IP_DEL_VPS` | Naranja (proxied) o gris |
   | A | `n8n` | `IP_DEL_VPS` | Naranja o gris |
   | A | `@` (raíz) | `IP_DEL_VPS` | Naranja o gris |

   > El registro `pdf` lo crea automáticamente el Named Tunnel (Paso 4). No lo agregues a mano.

   Si usas **proxy naranja** sobre `app`/`n8n`, en Cloudflare → SSL/TLS pon el modo en **Full (strict)** para que funcione con el certificado de Caddy.

---

## Paso 1 — Preparar el VPS

Conéctate por SSH (`ssh root@IP_DEL_VPS`) e instala Docker:

```bash
# Actualizar e instalar Docker + Compose plugin
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh
docker compose version   # verifica que el plugin esté

# (Opcional) usuario no-root para operar
adduser financebro && usermod -aG docker financebro
# Reconéctate como ese usuario si lo creas: su - financebro

# Firewall: solo SSH + HTTP + HTTPS (Caddy)
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable
```

---

## Paso 2 — Clonar el repo y configurar el `.env`

```bash
git clone <URL_DEL_REPO> financebro && cd financebro
cp .env.example .env
nano .env   # edita con valores REALES
```

Genera secretos fuertes (en el VPS):

```bash
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)"
echo "N8N_DB_PASSWORD=$(openssl rand -hex 24)"
echo "REDIS_PASSWORD=$(openssl rand -hex 24)"
echo "N8N_API_KEY=$(openssl rand -hex 24)"
echo "PLAYWRIGHT_API_KEY=$(openssl rand -hex 24)"
```

Valores clave del `.env` de producción:

```env
DOMAIN=financebro.co
ACME_EMAIL=tu-correo@financebro.co

# Supabase — usa las contraseñas YA ROTADAS (ver Seguridad abajo)
BACKEND_DATABASE_URL=postgresql://postgres.<REF_PRODUCTOS>:<PWD>@aws-1-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require
BACKEND_MIGRATION_URL=postgresql://postgres.<REF_PRODUCTOS>:<PWD>@aws-1-us-west-2.pooler.supabase.com:5432/postgres?sslmode=require
USERS_DATABASE_URL=postgresql://postgres.<REF_USUARIOS>:<PWD>@aws-1-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require
USERS_MIGRATION_URL=postgresql://postgres.<REF_USUARIOS>:<PWD>@aws-1-us-west-2.pooler.supabase.com:5432/postgres?sslmode=require

REDIS_PASSWORD=...
JWT_SECRET=...
N8N_API_KEY=...            # clave compartida ingesta (la pondrás también en n8n)
N8N_ENCRYPTION_KEY=...
N8N_DB_PASSWORD=...
PLAYWRIGHT_API_KEY=...     # MISMA clave que pondrás en el Playwright local
SCRAPERAPI_KEY=...         # tu key NUEVA de scraperapi.com (la vieja se filtró)
VITE_API_URL=/api
```

> ⚠️ El `.env` con valores reales **nunca** se commitea (ya está en `.gitignore`).

---

## Paso 3 — Levantar el stack en el VPS

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps      # todos deben quedar healthy
docker compose -f docker-compose.prod.yml logs -f caddy   # ver emisión del certificado
```

Caddy pedirá los certificados TLS a Let's Encrypt automáticamente para `app.<dom>` y `n8n.<dom>` (requiere que el DNS ya apunte al VPS y los puertos 80/443 abiertos).

### Migraciones (importante)

La **base ya está migrada en Supabase** (lo hiciste antes), así que el primer deploy **no necesita correr migraciones**.

El contenedor de producción **no puede** correr `npm run migration:run` (no incluye `ts-node` ni `src/`). Para **futuras** migraciones, ejecútalas desde una máquina con el repo completo (deps de dev) apuntando a Supabase:

```bash
# En tu máquina de desarrollo (no en el contenedor):
cd finance-bro-api
DATABASE_MIGRATION_URL="postgresql://...@...pooler.supabase.com:5432/postgres?sslmode=require" \
  npm run migration:run
# Igual para finance-bro-users-api
```

---

## Paso 4 — Playwright local + Cloudflare Named Tunnel (tu máquina de casa)

Esto mantiene el scraping por tu **IP residencial**. Todo es **saliente** (no abres puertos en casa).

### 4.1 Correr el Playwright service de forma persistente

```powershell
cd playwright-pdf-service
npm install
npm run install-browsers          # descarga Chromium (una vez)
# Define la MISMA clave que pusiste en PLAYWRIGHT_API_KEY del VPS:
$env:API_KEY = "<la_misma_PLAYWRIGHT_API_KEY>"
npm start                          # escucha en http://localhost:3001
```

Para que arranque solo y sobreviva reinicios, usa **PM2**:

```powershell
npm install -g pm2 pm2-windows-startup
pm2-startup install
$env:API_KEY="<...>"; pm2 start server.js --name playwright-pdf
pm2 save
```

### 4.2 Cloudflare Named Tunnel

```powershell
# 1) Instala cloudflared (winget) o descarga el .exe
winget install --id Cloudflare.cloudflared

# 2) Autoriza con tu dominio de Cloudflare (abre el navegador)
cloudflared tunnel login

# 3) Crea el túnel
cloudflared tunnel create financebro-pdf

# 4) Crea el archivo de configuración en %USERPROFILE%\.cloudflared\config.yml
```

`config.yml`:
```yaml
tunnel: financebro-pdf
credentials-file: C:\Users\<TU_USUARIO>\.cloudflared\<UUID-del-tunel>.json

ingress:
  - hostname: pdf.financebro.co
    service: http://localhost:3001
  - service: http_status:404
```

```powershell
# 5) Crea el DNS (registro pdf.<dom> apuntando al túnel)
cloudflared tunnel route dns financebro-pdf pdf.financebro.co

# 6) Instálalo como servicio de Windows (arranca con el equipo, saliente)
cloudflared service install
```

Verifica desde el VPS:
```bash
curl -H "x-api-key: <PLAYWRIGHT_API_KEY>" https://pdf.financebro.co/health
```

---

## Paso 5 — Configurar n8n autohospedado

1. Entra a `https://n8n.<dom>` → crea la cuenta **owner** (primer arranque).
2. **Importa** los 6 workflows desde `n8n/` (Workflows → Import from File):
   `ScrapingEngine.json`, `MortgageLauncher.json`, `VehicleLauncher.json`, `EducationLauncher.json`, `InvertionLauncher.json`, `PDFUrlUpdater.json`.
3. **Re-vincula los launchers** ⚠️: cada launcher tiene un nodo **"Run ScrapingEngine"** (`executeWorkflow`) que referencia un `workflowId` de tu n8n Cloud viejo. Ábrelo en cada launcher y vuelve a seleccionar el `ScrapingEngine` recién importado (los IDs cambian por instancia).
4. **Credenciales** que usan los workflows (Google Sheets, Gemini, OpenAI/GPT, Claude): re-créalas en este n8n.
5. Las variables `API_URL`, `PDF_SERVICE_URL`, `N8N_API_KEY`, `PLAYWRIGHT_API_KEY`, `SCRAPERAPI_KEY` **ya las inyecta la compose** al contenedor de n8n desde el `.env` — no hay que configurarlas en la UI.
6. Activa los workflows (cron) cuando todo esté verificado.

---

## Paso 6 — Verificación end-to-end

```bash
# 1) Frontend con HTTPS
curl -I https://app.financebro.co            # 200, served by Caddy

# 2) API (mismo origen) trae datos de Supabase
curl https://app.financebro.co/api/productos/tipo-credito/hipotecario?limit=1

# 3) Auth (ruta a users-api)
curl -X POST https://app.financebro.co/api/auth/login \
  -H "Content-Type: application/json" -d '{"email":"x@x.co","password":"x"}'

# 4) n8n
curl -I https://n8n.financebro.co            # 200

# 5) Playwright local vía túnel
curl -H "x-api-key: <PLAYWRIGHT_API_KEY>" https://pdf.financebro.co/health
```

6. En n8n, ejecuta un **launcher** (ej. `MortgageLauncher`) manualmente → debe usar `pdf.<dom>` para PDFs y hacer `POST https://app.<dom>/api/scraping/ingest`. Verifica en Supabase:
   ```sql
   SELECT count(*) FROM tasas_historicas;   -- debe crecer
   ```

---

## Operación y mantenimiento

```bash
# Logs
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml ps

# Actualizar la app (nuevo código)
git pull && docker compose -f docker-compose.prod.yml up -d --build

# Reiniciar un servicio
docker compose -f docker-compose.prod.yml restart backend

# Backup de la metadata de n8n (la DB de la app la respalda Supabase con PITR)
docker compose -f docker-compose.prod.yml exec n8n-postgres \
  pg_dump -U n8n n8n | gzip > n8n_backup_$(date +%F).sql.gz
```

**Recursos:** el stack usa ~2–3 GB en reposo; en 8 GB sobra margen. Si los builds en el VPS se sienten lentos (2 vCPU), construye las imágenes en CI (`cd.yml` ya hace push a Docker Hub) y en el VPS solo `docker compose -f docker-compose.prod.yml pull && up -d`. Para crecer, sube a KVM 4 sin reinstalar.

---

## Seguridad — secretos a ROTAR antes de producción

Estos estuvieron en el chat o en git y deben rotarse:
- **Contraseñas de Supabase** (productos + usuarios) → Settings → Database → Reset password.
- **JWT de la API de n8n** (estaba hardcodeado en el workflow viejo).
- **ScraperAPI key** `2cad0b34…` → regenerar en scraperapi.com.
- Genera **nuevos** `JWT_SECRET`, `N8N_ENCRYPTION_KEY`, `PLAYWRIGHT_API_KEY`, `N8N_API_KEY`, `REDIS_PASSWORD` (comandos del Paso 2).

> `N8N_ENCRYPTION_KEY` es crítica: si la pierdes, n8n no puede descifrar las credenciales guardadas. Respáldala.

---

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| Caddy no emite certificado | DNS no apunta aún / puerto 80 cerrado | Espera propagación DNS; revisa `ufw`; mira `logs caddy` |
| `app.<dom>/api` da 502 | backend no healthy | `logs backend`; revisa `BACKEND_DATABASE_URL` (Supabase) |
| Login no funciona | ruta `/api/auth` mal | confirma que `users-api` está healthy; nginx enruta `/api/auth/` |
| `SELF_SIGNED_CERT_IN_CHAIN` | SSL Supabase | ya manejado por `DATABASE_SSL=true` + el helper `db-config` |
| n8n no llega al Playwright | túnel caído / key | `cloudflared` como servicio activo; `PLAYWRIGHT_API_KEY` igual en ambos lados |
| Launcher no corre el engine | `workflowId` viejo | re-vincular nodo "Run ScrapingEngine" (Paso 5.3) |
| n8n perdió credenciales | cambió `N8N_ENCRYPTION_KEY` | restaurar la key original |

---

**Resumen del flujo:** Cloudflare (DNS+TLS) → Caddy (VPS) → frontend/api/n8n; n8n llama a `app.<dom>/api` (ingesta) y a `pdf.<dom>` (tu Playwright local, IP residencial) → datos a Supabase.
