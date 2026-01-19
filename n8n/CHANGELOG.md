# Changelog - TextScrapperTool Workflow

## 2026-01-19 - Implementación de Tipo de Producto Dinámico

### 🎯 Resumen
Implementado sistema de selección dinámica de tipo de producto financiero en el workflow, permitiendo extraer diferentes tipos de productos desde un único workflow configurable.

### ✨ Características Nuevas

#### 1. **Formulario Mejorado**
- ✅ Título actualizado: "Scraper de Productos Financieros"
- ✅ Nuevo campo dropdown "Tipo de Producto" con opciones:
  - Crédito hipotecario para compra de vivienda
  - Crédito de consumo
  - Crédito de vehículo
  - Leasing habitacional
  - Tarjeta de crédito
- ✅ Campo obligatorio para evitar errores

#### 2. **Nodo "Set Domain"**
- ✅ Captura el campo `tipo_producto` del formulario
- ✅ ID: `tipo-producto-001`

#### 3. **Nodo "Add Protocol To Domain"**
- ✅ Propaga el campo `tipo_producto` a través del flujo
- ✅ ID: `tipo-producto-002`

#### 4. **Nodo "Prepare LLM Prompt" (OpenAI)**
- ✅ Sistema de configuración dinámico por tipo de producto
- ✅ Prompts personalizados según el producto seleccionado
- ✅ Campos JSON variables según el tipo de producto:

**Crédito Hipotecario:**
```json
{
  "housing_type": "VIS|No VIS|Aplica para ambos",
  "rate_denomination": "UVR|Pesos"
}
```

**Crédito de Consumo:**
```json
{
  "credit_purpose": "libre inversión|compra cartera|libranza"
}
```

**Crédito de Vehículo:**
```json
{
  "vehicle_type": "nuevo|usado"
}
```

**Tarjeta de Crédito:**
```json
{
  "annual_fee": "$X|Sin cuota de manejo",
  "benefits": ["cashback", "millas", "descuentos"]
}
```

#### 5. **Nodo "Analyze document" (Gemini PDF)**
- ✅ Instrucciones dinámicas para extracción de PDFs según tipo de producto
- ✅ Filtros específicos por producto
- ✅ Formato de salida adaptado

### 🔧 Configuración Técnica

**productConfig Object:**
```javascript
{
  'Crédito hipotecario para compra de vivienda': {
    fields: ['housing_type', 'rate_denomination'],
    extraFields: `  "housing_type": "VIS|No VIS|Aplica para ambos",\n  "rate_denomination": "UVR|Pesos",`,
    exclusions: ['leasing habitacional', 'créditos para constructores', ...],
    instructions: 'Diferencia VIS y No VIS. Diferencia UVR y Pesos.'
  },
  // ... más configuraciones
}
```

### 📊 Flujo de Datos

```
Formulario
  ↓ [tipo_producto]
Set Domain
  ↓ [tipo_producto]
Add Protocol To Domain
  ↓ [tipo_producto]
  ├→ Extract Page Structure → Extract Body → Optimize Context
  └→ Extract PDF File → Analyze document (Gemini)
      ↓
  Merge Data
      ↓ [tipo_producto]
  Prepare LLM Prompt (Dinámico)
      ↓
  GPT-4.1 (OpenAI)
      ↓
  Parse Response
      ↓
  Prepare For Spreadsheet
      ↓
  Google Sheets
```

### 🎨 Ventajas

1. **Escalabilidad**: Agregar nuevos tipos de producto solo requiere actualizar el `productConfig`
2. **Mantenibilidad**: Configuración centralizada en un solo objeto
3. **Flexibilidad**: Cada tipo de producto tiene sus propios campos y reglas
4. **Precisión**: Prompts específicos mejoran la calidad de extracción
5. **Futuro-proof**: Fácil extensión para nuevos productos del roadmap (seguros, inversiones, etc.)

### 🚀 Uso

1. Acceder al formulario del workflow
2. Ingresar URL del producto financiero
3. **Seleccionar tipo de producto** desde el dropdown
4. (Opcional) Agregar URL del PDF
5. (Opcional) Agregar URL del home para anti-bot
6. Enviar formulario
7. El workflow extrae automáticamente según el tipo seleccionado

### 📝 Próximos Pasos

- [ ] Agregar más tipos de producto (Seguros, Inversiones)
- [ ] Implementar validación de campos específicos por producto
- [ ] Agregar filtros dinámicos opcionales (VIS/No VIS, UVR/Pesos)
- [ ] Optimizar prompts por producto basado en resultados reales

### 🔗 Referencias

- Archivo: `n8n/TextScrapperTool.json`
- Nodos modificados: 5
- Líneas de código agregadas: ~150
- Productos soportados: 5

---

**Fecha de implementación**: 2026-01-19
**Versión workflow**: 1.1.0
**Desarrollado con**: Claude Code (Sonnet 4.5)
