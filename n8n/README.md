# n8n Workflow Sync Tool

Herramienta para sincronizar workflows de n8n desde archivos JSON locales hacia tu instancia de n8n en la nube.

## Descripción

Este script permite actualizar workflows de n8n que están en la nube utilizando archivos JSON locales. Es útil cuando trabajas con workflows versionados en Git o cuando necesitas hacer cambios locales y subirlos de forma controlada a tu instancia de n8n.

### Características

- Lee workflows desde archivos JSON locales
- Valida las credenciales de n8n desde variables de entorno
- Verifica que el workflow existe en la nube antes de actualizar
- Muestra una comparación entre la versión local y en la nube
- **Sistema de backups automático**: Crea copias de seguridad antes de actualizar
- Backups organizados por fecha con numeración automática
- Solicita confirmación antes de realizar cambios
- Manejo robusto de errores con mensajes claros
- Output visual con colores en la terminal

## Requisitos

- Node.js >= 18.0.0 (para soporte nativo de `fetch`)
- Cuenta de n8n con acceso a la API
- API Key de n8n

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea o edita el archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
N8N_API_KEY=tu_api_key_aqui
N8N_HOST=https://tu-instancia.n8n.cloud
```

#### Cómo obtener tu API Key de n8n:

1. Inicia sesión en tu instancia de n8n
2. Ve a **Settings** → **API**
3. Crea una nueva API Key
4. Copia el token generado y pégalo en el archivo `.env`

## Uso

### Sincronizar el workflow por defecto

Por defecto, el script busca el archivo `TextScrapperTool.json`:

```bash
npm run sync
```

### Sincronizar un archivo específico

Puedes especificar cualquier archivo JSON de workflow:

```bash
node sync-workflow.js MiWorkflow.json
```

O también:

```bash
node sync-workflow.js path/to/otro-workflow.json
```

## Sistema de Backups

El script incluye un sistema de backups automático que crea copias de seguridad del workflow en la nube antes de actualizarlo.

### Estructura de los backups

Los backups se organizan de la siguiente manera:

```
backups/
├── 8-1-2026/
│   ├── backup1.json
│   ├── backup2.json
│   └── backup3.json
├── 9-1-2026/
│   ├── backup1.json
│   └── backup2.json
└── 10-1-2026/
    └── backup1.json
```

- **Carpetas por fecha**: Cada día se crea una carpeta con el formato `día-mes-año` (ej: `8-1-2026`)
- **Numeración automática**: Los backups se numeran secuencialmente (backup1.json, backup2.json, etc.)
- **Sin límite de backups**: Puedes crear tantos backups como necesites

### Cómo funcionan los backups

1. Antes de actualizar, el script pregunta: **"Do you want to create a backup before updating? (Y/n)"**
2. Si presionas Enter o respondes "y"/"yes", se crea el backup
3. Si respondes "n"/"no", se salta el backup
4. El backup guarda el workflow **actual de la nube** (no el archivo local)
5. El archivo se guarda en formato JSON con indentación legible

### Restaurar un backup

Para restaurar un backup anterior:

1. Ve a la carpeta `backups/[fecha]/`
2. Copia el archivo `backupN.json` que deseas restaurar
3. Renómbralo a algo como `TextScrapperTool.json` o el nombre que corresponda
4. Ejecuta el script normalmente: `npm run sync`

### Notas importantes sobre backups

- Los backups están excluidos del control de versiones (`.gitignore`)
- Se recomienda hacer respaldo manual de backups críticos fuera del proyecto
- Cada backup contiene el workflow completo con todos sus nodos y configuraciones

## Flujo de ejecución

Cuando ejecutas el script, realiza los siguientes pasos:

1. **Validación de entorno**: Verifica que `N8N_API_KEY` y `N8N_HOST` estén configurados
2. **Lectura del archivo**: Lee y parsea el archivo JSON del workflow
3. **Extracción del ID**: Obtiene el ID del workflow desde el JSON
4. **Verificación en la nube**: Comprueba que el workflow existe en n8n
5. **Comparación**: Muestra las diferencias entre local y nube
6. **Backup (opcional)**: Te pregunta si deseas crear un backup del workflow actual
   - Si aceptas, crea una copia en `backups/[fecha]/backup[N].json`
   - Los backups se organizan por fecha (formato: `8-1-2026`)
   - Numeración automática (backup1.json, backup2.json, etc.)
7. **Confirmación**: Te pregunta si deseas continuar con la actualización
8. **Actualización**: Si confirmas, actualiza el workflow usando la API de n8n

## Ejemplo de salida

```
========================================
   n8n Workflow Sync Tool
========================================

[OK] Connected to: https://n8n-camilo.cloud
[INFO] Reading workflow from: TextScrapperTool.json

----------------------------------------
Workflow Details:
  Name: TextScrapperTool
  ID:   0TP2ZS49dTix90SW
  Nodes: 22
  Active: No
----------------------------------------

[INFO] Checking workflow in cloud...
[OK] Found workflow "TextScrapperTool" in cloud

----------------------------------------
Changes to apply:
  Local name:  TextScrapperTool
  Cloud name:  TextScrapperTool
  Local nodes: 22
  Cloud nodes: 20
----------------------------------------

Do you want to create a backup before updating? (Y/n): y

[INFO] Creating backup of current cloud workflow...
[OK] Backup created: backups/8-1-2026/backup1.json

Do you want to update the workflow in n8n cloud? (y/N): y

[INFO] Updating workflow...

========================================
   Workflow updated successfully!
========================================

  ID: 0TP2ZS49dTix90SW
  Name: TextScrapperTool
  Updated at: 2025-01-08T15:30:45.123Z
  URL: https://n8n-camilo.cloud/workflow/0TP2ZS49dTix90SW
```

## Manejo de errores

El script maneja varios tipos de errores comunes:

| Error | Descripción |
|-------|-------------|
| **Missing credentials** | `N8N_API_KEY` o `N8N_HOST` no están definidos en `.env` |
| **File not found** | El archivo JSON especificado no existe |
| **Invalid JSON** | El archivo no contiene JSON válido |
| **Missing workflow ID** | El JSON no contiene el campo `id` |
| **Workflow not found** | El workflow con ese ID no existe en n8n |
| **Connection error** | No se puede conectar al servidor de n8n |
| **API error** | Error en la respuesta de la API de n8n |

## Estructura del proyecto

```
n8n/
├── .env                    # Variables de entorno (no versionado)
├── .gitignore              # Archivos excluidos del control de versiones
├── package.json            # Dependencias y scripts npm
├── sync-workflow.js        # Script principal de sincronización
├── TextScrapperTool.json   # Workflow de ejemplo
├── node_modules/           # Dependencias de Node.js (no versionado)
├── backups/                # Backups automáticos (no versionado)
│   ├── 8-1-2026/
│   │   ├── backup1.json
│   │   └── backup2.json
│   └── 9-1-2026/
│       └── backup1.json
└── README.md              # Este archivo
```

## API de n8n utilizada

El script utiliza el endpoint de actualización de workflows de n8n:

```
PUT /api/v1/workflows/:id
```

**Headers requeridos:**
```
Content-Type: application/json
X-N8N-API-KEY: <tu_api_key>
```

**Documentación oficial**: [n8n API Documentation](https://docs.n8n.io/api/)

## Notas importantes

- El script NO crea workflows nuevos, solo actualiza existentes
- El ID del workflow debe estar presente en el archivo JSON
- **Sistema de backups integrado**: El script te pregunta si quieres crear un backup antes de actualizar
- Los backups se guardan automáticamente en `backups/[fecha]/backupN.json`
- La actualización sobrescribe completamente el workflow en la nube
- El campo `id` del JSON se usa para identificar el workflow pero no se envía en el body del request
- Los backups NO se versionan en Git para mantener el repositorio limpio

## Solución de problemas

### Error: "Cannot connect to n8n"

Verifica que:
- El `N8N_HOST` en `.env` sea correcto
- Tu instancia de n8n esté activa y accesible
- No haya problemas de red o firewall

### Error: "Workflow not found"

Asegúrate de que:
- El ID en el archivo JSON corresponda a un workflow existente
- La API Key tenga permisos para acceder a ese workflow

### Error: "Invalid JSON"

Revisa que:
- El archivo JSON esté bien formado
- No haya caracteres especiales que rompan el formato
- El archivo se exportó correctamente desde n8n

## Contribuciones

Este es un proyecto interno, pero se aceptan mejoras y sugerencias.

## Licencia

Proyecto interno - Uso exclusivo del equipo de FinanceBro.
