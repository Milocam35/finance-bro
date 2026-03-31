# n8n - Sistema de Automatización FinanceBro

Sistema de workflows de n8n para la extracción automatizada de tasas de créditos hipotecarios de bancos colombianos y su ingesta al backend API.

## Contenido

- [Arquitectura General](#arquitectura-general)
- [Workflows](#workflows)
  - [TextScrapperTool - Scraping Diario](#1-textscrappertool---scraping-diario)
  - [PDFUrlUpdater - Actualización de URLs de PDFs](#2-pdfurlupdater---actualización-de-urls-de-pdfs)
  - [VehicleScrapperTool - Scraping de Vehículos](#3-vehiclescrappertool---scraping-de-vehículos)
- [Sync Tool](#sync-tool)
- [Google Sheets (Fuente de Configuración)](#google-sheets-fuente-de-configuración)
- [Credenciales y APIs Externas](#credenciales-y-apis-externas)
- [Solución de Problemas](#solución-de-problemas)

---

## Arquitectura General

```
Google Sheets (LinksVivienda)          Banco de la República API
        │                                       │
        │  URLs de bancos + config               │  Valor UVR actual/histórico
        ▼                                       ▼
┌─────────────────────────────────────────────────────┐
│              TextScrapperTool (Diario 6AM)           │
│                                                     │
│  Por cada banco activo:                             │
│                                                     │
│  ┌──────────┐    ┌───────────┐                      │
│  │ Rama HTML │    │ Rama PDF  │    (en paralelo)     │
│  │           │    │           │                      │
│  │ HTTP GET  │    │ Descarga  │                      │
│  │    ↓      │    │    ↓      │                      │
│  │ Bloqueado?│    │ Bloqueado?│                      │
│  │  Sí → API │    │  Sí → API │  ← ScraperAPI        │
│  │    ↓      │    │    ↓      │                      │
│  │ Cheerio   │    │ Gemini    │  ← Gemini 2.5 Flash  │
│  │ Extract   │    │ Analyze   │                      │
│  └─────┬─────┘    └─────┬─────┘                      │
│        └───────┬─────────┘                           │
│                ▼                                     │
│         Merge HTML + PDF                             │
│                ▼                                     │
│         GPT-4.1 (temp=0)   ← Extracción estructurada│
│                ▼                                     │
│         Validate & Parse                             │
│                ▼                                     │
│         Prepare Output (+ cálculo UVR→EA)            │
│                ▼                                     │
│   ┌────────────┴────────────┐                        │
│   ▼                         ▼                        │
│ Google Sheets            NestJS API                  │
│ (DataVivienda)     POST /api/scraping/ingest         │
│ (respaldo)              (principal)                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│        PDFUrlUpdater (Quincenal: 1 y 15 del mes)     │
│                                                     │
│  Por cada banco activo:                             │
│    Claude Sonnet 4.6 (agente con tools)             │
│      ├── Tool: Read Sheets (leer datos actuales)    │
│      ├── Tool: Verify URL (HEAD request)            │
│      └── Tool: Update Sheets (actualizar pdf_url)   │
│                                                     │
│  Infiere nueva URL del PDF basándose en patrones    │
│  de naming → verifica accesibilidad → actualiza     │
└─────────────────────────────────────────────────────┘
```

---

## Workflows

### 1. TextScrapperTool - Scraping Diario

**Archivo**: `TextScrapperTool.json`
**Trigger**: Cron `0 6 * * *` (6:00 AM hora Bogotá) + trigger manual
**Nodos**: 22+

#### Flujo paso a paso

| # | Nodo | Descripción |
|---|------|-------------|
| 1 | **Read Bank URLs** | Lee la hoja `LinksVivienda` del Google Sheet con la lista de bancos, URLs, pdf_url y flag activo |
| 2 | **Filter Active Banks** | Filtra solo bancos con `activo = TRUE` |
| 3 | **Fetch UVR from BanRep API** | Consulta la API del Banco de la República (serie 850) para obtener el valor UVR actual |
| 4 | **Parse UVR API Response** | Calcula la variación porcentual anual del UVR (`(UVR_hoy / UVR_hace_1_año) - 1`) |
| 5 | **Restore Bank Items** | Recupera la lista de bancos para el loop (el paso de UVR retorna 1 solo item) |
| 6 | **Process Banks One by One** | SplitInBatches de 1 banco a la vez |
| 7 | **Set Bank Variables** | Extrae: url principal, extra_urls (separadas por coma), pdf_url, banco_nombre, tipo_producto |
| 8 | **Add Protocol To Domain** | Agrega `https://` si la URL no tiene protocolo |

#### Rama HTML (extracción web)

| # | Nodo | Descripción |
|---|------|-------------|
| 9 | **Extract Page Structure** | HTTP GET directo a la web del banco con headers de navegador |
| 10 | **HTML Blocked?** | Si hay error → ScraperAPI como fallback (`render=true`, `country_code=co`) |
| 11 | **Extract Body** | Cheerio parsea HTML: extrae tablas, párrafos, headings, listas con keywords de tasas hipotecarias. Soporta **multi-URL** (extra_urls) |
| 12 | **Optimize Context for LLM** | Compacta el contenido relevante a ~8000 chars máximo para el prompt |

#### Rama PDF (extracción de documentos)

| # | Nodo | Descripción |
|---|------|-------------|
| 9b | **Has PDF?** | Verifica si el banco tiene `pdf_url` configurada |
| 10b | **Extract PDF File** | Descarga el PDF (soporta Google Drive con conversión de URL) |
| 11b | **PDF Blocked?** | Si falla → ScraperAPI PDF Fallback |
| 12b | **Fix PDF MIME** | Corrige MIME type `application/octet-stream` → `application/pdf` (Google Drive) |
| 13b | **Analyze PDF Document** | **Gemini 2.5 Flash** analiza el PDF extrayendo solo tasas de crédito hipotecario de compra de vivienda en formato markdown |

#### Procesamiento con IA y salida

| # | Nodo | Descripción |
|---|------|-------------|
| 13 | **Merge HTML + PDF Data** | Combina ambas fuentes de datos |
| 14 | **Prepare LLM Prompt** | Construye prompt con system message que incluye: JSON schema estricto, few-shot examples, reglas de normalización, valores permitidos exactos |
| 15 | **GPT-4.1** | Temperatura 0, extrae datos estructurados en JSON con campos normalizados |
| 16 | **Validate & Parse Response** | Validación estricta: filtra solo hipotecarios de compra de vivienda, normaliza `housing_type` (VIS/No VIS), `rate_denomination` (UVR/Pesos), formato de tasas con punto decimal |
| 17 | **Prepare For Output** | Genera `id_unico` (banco+tipo+vivienda+denominación normalizado), calcula `tasa_final` para UVR con fórmula `((1+spread)*(1+variaciónUVR))-1`, convierte rangos min/max de UVR a EA, agrega fecha/hora Colombia |
| 18 | **Append to Google Sheets** | Escribe en hoja `DataVivienda` con `appendOrUpdate` por `id_unico` (respaldo) |
| 19 | **Send to NestJS API** | `POST /api/scraping/ingest` con header `x-api-key` → PostgreSQL (destino principal) |
| 20 | **Execution Summary** | Resumen al finalizar todos los bancos |

#### Campos de salida por producto

```json
{
  "id_unico": "bancolombia__creditohipotecarioparacompradevivienda__vis__uvr",
  "banco": "Bancolombia",
  "tipo_credito": "Crédito hipotecario para compra de vivienda",
  "tipo_vivienda": "VIS",
  "denominacion": "UVR",
  "tipo_tasa": "Tasa efectiva anual",
  "tasa": "UVR + 6.50%",
  "tasa_final": "12.04%",
  "uvr_variacion_anual": "5.20%",
  "tasa_minima": "",
  "tasa_maxima": "",
  "monto_minimo": "",
  "monto_maximo": "$262,635,750",
  "plazo_maximo": "20 años",
  "tipo_pago": "Cuota fija",
  "descripcion": "Crédito hipotecario para vivienda de interés social en UVR",
  "condiciones": "Valor comercial hasta 150 SMMLV; Financiación hasta el 80%",
  "requisitos": "Ingresos desde 1 SMMLV; Avalúo y estudio jurídico",
  "descuento_nomina": "+200 pbs con Cuenta de Nómina Bancolombia",
  "beneficio_avaluo": "",
  "fecha_extraccion": "2026-03-24",
  "hora_extraccion": "06:15:30",
  "url_pagina": "https://www.bancolombia.com/...",
  "url_pdf": "https://..."
}
```

#### Fórmula de conversión UVR a Tasa EA

```
tasa_final = ((1 + spread_banco) * (1 + variación_anual_UVR)) - 1

Ejemplo:
  spread_banco = 6.50% = 0.065
  variación_UVR = 5.20% = 0.052
  tasa_final = ((1.065) * (1.052)) - 1 = 0.1204 = 12.04% EA
```

---

### 2. PDFUrlUpdater - Actualización de URLs de PDFs

**Archivo**: `PDFUrlUpdater.json`
**Trigger**: Cron `0 5 1,15 * *` (5:00 AM los días 1 y 15 de cada mes, hora Bogotá) + trigger manual
**Nodos**: 12

#### Problema que resuelve

Los bancos colombianos publican PDFs de tasas con URLs que cambian cada mes (incluyen mes, año, versión en el nombre del archivo). Este workflow mantiene esas URLs actualizadas automáticamente.

#### Flujo paso a paso

| # | Nodo | Descripción |
|---|------|-------------|
| 1 | **Read All Banks** | Lee todos los bancos de `LinksVivienda` |
| 2 | **Split Into Batches of 1** | Filtra activos y crea lotes de 1 banco |
| 3 | **One Bank at a Time** | Procesa un banco a la vez |
| 4 | **Build Resolved Prompt** | Resuelve parámetros de fecha en hora Bogotá: mes actual/anterior en múltiples formatos (minúsculas, Title Case, MAYÚSCULAS, número con cero) |
| 5 | **Claude PDF URL Agent** | Agente **Claude Sonnet 4.6** con system prompt especializado y 3 tools |
| 6 | **Write Log** | Registra el resultado en hoja `URL_Update_Log` |
| 7 | **Wait 30s Between Banks** | Rate limiting entre bancos |

#### Tools del agente Claude

| Tool | Descripción |
|------|-------------|
| **Tool: Read Sheets** | Lee la lista completa de bancos con sus URLs actuales del Google Sheet |
| **Tool: Verify URL** | HEAD request con timeout 15s para validar si una URL candidata responde HTTP 200/206 |
| **Tool: Update Sheets** | Actualiza la columna `pdf_url` en el Sheet (match por nombre del banco) |

#### Patrones de URLs que detecta

| Patrón | Ejemplo |
|--------|---------|
| `/YYYY/MM/TASAS-MES-YYYY-N.pdf` | `/2026/03/TASAS-MARZO-2026-1.pdf` |
| `/tasas-mes-yyyy` | `/tasas-marzo-2026` |
| `/Actualizacion_tasas_Mes_YYYY.pdf` | `/Actualizacion_tasas_Marzo_2026.pdf` |
| `/TASAS-DD-DE-MES-DE-YYYY.pdf` | `/TASAS-15-DE-MARZO-DE-2026.pdf` |
| `/Tarifario-YYYY-...-N.pdf` | `/Tarifario-2026-La-Hipotecaria-Colombia-3.pdf` |

#### Formato del reporte

```
✅ [banco] → [nueva URL]
➖ [banco] → sin cambios (URL vigente)
❌ [banco] → no encontrado (URL original conservada)
```

---

### 3. VehicleScrapperTool - Scraping de Vehículos

**Archivo**: `VehicleScrapperTool.json`
**Estado**: En desarrollo

---

## Sync Tool

Herramienta CLI para sincronizar workflows locales con la instancia de n8n en la nube.

### Instalación

```bash
cd n8n
npm install
```

### Configuración

Crear archivo `.env` en la carpeta `n8n/`:

```env
N8N_API_KEY=tu_api_key_aqui
N8N_HOST=https://tu-instancia.n8n.cloud
```

Para obtener la API Key: n8n Settings → API → Create new API Key.

### Uso

```bash
# Sincronizar workflow por defecto (TextScrapperTool.json)
npm run sync

# Sincronizar un archivo específico
node sync-workflow.js PDFUrlUpdater.json
node sync-workflow.js VehicleScrapperTool.json
```

### Sistema de backups

Antes de actualizar, el script ofrece crear un backup del workflow actual en la nube:

```
backups/
├── 24-3-2026/
│   ├── backup1.json
│   └── backup2.json
└── 25-3-2026/
    └── backup1.json
```

- Los backups se organizan por fecha con numeración automática
- Se guardan en formato JSON legible
- Están excluidos del control de versiones (`.gitignore`)

Para restaurar: copiar el backup, renombrarlo al nombre del workflow, y ejecutar `npm run sync`.

---

## Google Sheets (Fuente de Configuración)

**Spreadsheet**: [BankScrappedData](https://docs.google.com/spreadsheets/d/1yUR0Tow3yrbSemyzmsqDY4VoF113wrxfCwVDhSTOsoM/edit?usp=sharing)

### Hoja: LinksVivienda (configuración de bancos)

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `banco` | Nombre del banco | Bancolombia |
| `url` | URL(s) de la página de tasas (separadas por coma si son múltiples) | `https://www.bancolombia.com/...` |
| `pdf_url` | URL del PDF de tasas (actualizada por PDFUrlUpdater) | `https://...tasas-marzo-2026.pdf` |
| `target_url` | URL de destino alternativa | |
| `tipo_producto` | Tipo de producto a extraer | Crédito hipotecario para compra de vivienda |
| `activo` | Flag para incluir/excluir el banco | TRUE / FALSE |

### Hoja: DataVivienda (datos extraídos - respaldo)

Contiene todos los campos de salida del TextScrapperTool con `appendOrUpdate` por `id_unico`.

### Hoja: URL_Update_Log (logs del PDFUrlUpdater)

| Columna | Descripción |
|---------|-------------|
| `fecha_ejecucion` | Fecha de ejecución (YYYY-MM-DD) |
| `hora_ejecucion` | Hora de ejecución (HH:mm) |
| `reporte` | Resultado por banco (actualizado/sin cambios/no encontrado) |
| `batch` | Índice del lote |

---

## Credenciales y APIs Externas

| Servicio | Uso | Workflow |
|----------|-----|----------|
| **Google Sheets OAuth2** | Leer configuración de bancos, escribir datos extraídos, logs | Ambos |
| **Banco de la República API** | Valor UVR actual e histórico (serie 850) | TextScrapperTool |
| **ScraperAPI** | Fallback para webs/PDFs con protección anti-bot (render JS, geo CO) | TextScrapperTool |
| **Gemini 2.5 Flash** | Análisis de PDFs bancarios para extraer tablas de tasas | TextScrapperTool |
| **OpenAI GPT-4.1** | Extracción estructurada de datos en JSON desde HTML+PDF combinados | TextScrapperTool |
| **Anthropic Claude Sonnet 4.6** | Agente AI para inferir y verificar nuevas URLs de PDFs | PDFUrlUpdater |
| **NestJS API** | Destino principal de los datos extraídos (PostgreSQL) | TextScrapperTool |

---

## Estructura del directorio

```
n8n/
├── TextScrapperTool.json          # Workflow principal de scraping diario
├── PDFUrlUpdater.json             # Workflow de actualización quincenal de URLs de PDFs
├── VehicleScrapperTool.json       # Workflow de scraping de vehículos (en desarrollo)
├── sync-workflow.js               # CLI para sincronizar workflows a n8n Cloud
├── package.json                   # Dependencias (dotenv)
├── README.md                      # Este archivo
├── README-DYNAMIC-WORKFLOW.md     # Guía del sistema dinámico multi-producto
├── .env                           # Variables de entorno (no versionado)
├── backups/                       # Backups automáticos (no versionado)
│   └── [fecha]/backupN.json
└── node_modules/                  # Dependencias (no versionado)
```

---

## Solución de Problemas

### El scraping no extrae datos de un banco

1. Verificar que el banco tiene `activo = TRUE` en el Sheet
2. Verificar que la URL es accesible manualmente
3. Si el banco tiene protección anti-bot, ScraperAPI debería manejarlo como fallback
4. Si el banco tiene tablas renderizadas con JavaScript, ScraperAPI con `render=true` debería capturarlas

### La tasa_final está vacía para productos UVR

La conversión UVR→EA requiere que la API del Banco de la República responda correctamente. Si `uvr_calculo_valido = false`, la API falló y no se puede calcular la tasa equivalente.

### El PDFUrlUpdater no encuentra la nueva URL

- El banco puede haber cambiado su patrón de naming de PDFs
- Verificar manualmente la URL actual del PDF y actualizar en el Sheet
- Algunos bancos usan Google Drive (no verificables por HEAD request)

### Error 401 en Send to NestJS API

- Verificar que `N8N_API_KEY` en las variables de entorno de n8n coincida con la del backend
- Verificar que el backend esté corriendo y accesible desde n8n

### Error de conexión al sincronizar workflows

- Verificar `N8N_HOST` y `N8N_API_KEY` en el `.env` local
- Verificar que la instancia de n8n Cloud esté activa

---

**Última actualización**: Marzo 2026
