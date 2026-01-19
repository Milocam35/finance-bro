# 🔄 Workflow Dinámico de Scraping - Guía de Uso

## 📋 Resumen

El workflow ahora soporta **múltiples tipos de productos financieros** desde un único formulario, con prompts y configuraciones específicas para cada tipo.

---

## 🎯 Tipos de Producto Soportados

### 1. 🏠 Crédito Hipotecario para Compra de Vivienda

**Campos específicos extraídos:**
- `housing_type`: VIS | No VIS | Aplica para ambos
- `rate_denomination`: UVR | Pesos

**Exclusiones automáticas:**
- Leasing habitacional
- Créditos para constructores
- Créditos de consumo
- Créditos de libranza
- Créditos de mejoramiento

**Ejemplo de uso:**
```
URL: https://www.bancolombia.com/personas/creditos/vivienda/credito-hipotecario
Tipo: Crédito hipotecario para compra de vivienda
```

---

### 2. 💰 Crédito de Consumo

**Campos específicos extraídos:**
- `credit_purpose`: libre inversión | compra cartera | libranza

**Exclusiones automáticas:**
- Créditos hipotecarios
- Leasing
- Tarjetas de crédito
- Créditos de vehículo

**Ejemplo de uso:**
```
URL: https://www.davivienda.com/personas/creditos/credito-de-consumo
Tipo: Crédito de consumo
```

---

### 3. 🚗 Crédito de Vehículo

**Campos específicos extraídos:**
- `vehicle_type`: nuevo | usado

**Exclusiones automáticas:**
- Créditos hipotecarios
- Créditos de consumo
- Leasing
- Tarjetas de crédito

**Ejemplo de uso:**
```
URL: https://www.bbva.com.co/personas/productos/creditos/vehiculo
Tipo: Crédito de vehículo
```

---

### 4. 🏢 Leasing Habitacional

**Campos específicos extraídos:**
- `housing_type`: VIS | No VIS | Aplica para ambos

**Exclusiones automáticas:**
- Créditos hipotecarios tradicionales
- Créditos de consumo
- Tarjetas de crédito

**Ejemplo de uso:**
```
URL: https://www.bancodebogota.com/personas/leasing/habitacional
Tipo: Leasing habitacional
```

---

### 5. 💳 Tarjeta de Crédito

**Campos específicos extraídos:**
- `annual_fee`: $X | Sin cuota de manejo
- `benefits`: cashback, millas, descuentos

**Exclusiones automáticas:**
- Créditos hipotecarios
- Créditos de consumo
- Créditos de vehículo
- Leasing

**Ejemplo de uso:**
```
URL: https://www.bancolombia.com/personas/tarjetas/credito
Tipo: Tarjeta de crédito
```

---

## 🎨 Interfaz del Formulario

```
┌─────────────────────────────────────────────────┐
│  Scraper de Productos Financieros               │
├─────────────────────────────────────────────────┤
│                                                  │
│  🌐 URL *                                        │
│  ┌──────────────────────────────────────────┐  │
│  │ https://www.ejemplo.com/credito          │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  📦 Tipo de Producto *                          │
│  ┌──────────────────────────────────────────┐  │
│  │ Crédito hipotecario para compra... ▾     │  │
│  └──────────────────────────────────────────┘  │
│    • Crédito hipotecario para compra de viv... │
│    • Crédito de consumo                        │
│    • Crédito de vehículo                       │
│    • Leasing habitacional                      │
│    • Tarjeta de crédito                        │
│                                                  │
│  📄 URL del PDF (opcional)                      │
│  ┌──────────────────────────────────────────┐  │
│  │                                           │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  🏠 URL del home (anti-bot)                     │
│  ┌──────────────────────────────────────────┐  │
│  │                                           │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────┐                                   │
│  │  Enviar  │                                   │
│  └──────────┘                                   │
└─────────────────────────────────────────────────┘

* Campos obligatorios
```

---

## 🔧 Cómo Funciona Internamente

### Flujo de Configuración Dinámica

```javascript
// 1. Usuario selecciona tipo de producto en formulario
const tipoProducto = "Crédito hipotecario para compra de vivienda";

// 2. Workflow obtiene configuración específica
const config = productConfig[tipoProducto];

// 3. Construye prompt dinámico
const systemPrompt = `
  Extrae ÚNICAMENTE tasas de ${tipoProducto.toUpperCase()}
  EXCLUYE: ${config.exclusions.join(', ')}
  ${config.instructions}
`;

// 4. Genera JSON con campos específicos
{
  "bank": "Bancolombia",
  "credit_type": "Crédito hipotecario para compra de vivienda",
  ${config.extraFields}  // housing_type, rate_denomination, etc.
  "rate": "6.50%",
  ...
}
```

---

## 📊 Ejemplo de Salida JSON

### Crédito Hipotecario
```json
{
  "bank": "Bancolombia",
  "credit_type": "Crédito hipotecario para compra de vivienda",
  "housing_type": "VIS",
  "rate_denomination": "UVR",
  "rate_type": "Tasa efectiva anual",
  "rate": "6.50%",
  "rate_range": null,
  "description": "Crédito VIS en UVR con tasa desde 6.50%",
  "conditions": ["Aplica para VIS hasta $262M"],
  "requirements": ["Ingresos mínimos 1 SMMLV"],
  "min_amount": "$20M",
  "max_amount": "$262M",
  "max_term": "30 años",
  "payment_type": "Cuota variable"
}
```

### Crédito de Consumo
```json
{
  "bank": "Davivienda",
  "credit_type": "Crédito de consumo",
  "credit_purpose": "libre inversión",
  "rate_type": "Tasa efectiva anual",
  "rate": "18.50%",
  "min_amount": "$1M",
  "max_amount": "$100M",
  "max_term": "5 años",
  "payment_type": "Cuota fija"
}
```

### Tarjeta de Crédito
```json
{
  "bank": "BBVA",
  "credit_type": "Tarjeta de crédito",
  "rate_type": "Tasa efectiva anual",
  "rate": "32.50%",
  "annual_fee": "$50.000",
  "benefits": ["cashback 2%", "millas aéreas", "descuentos tiendas"],
  "description": "Tarjeta Gold con beneficios de viaje"
}
```

---

## 🚀 Sincronizar con n8n Cloud

```bash
cd n8n
npm run sync
```

O subir manualmente `TextScrapperTool.json` a tu instancia n8n cloud.

---

## ✅ Ventajas del Sistema Dinámico

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Productos soportados** | Solo hipotecarios | 5 tipos diferentes |
| **Workflows necesarios** | 1 por producto (5 total) | 1 único workflow |
| **Mantenimiento** | Editar 5 workflows | Editar 1 configuración |
| **Agregar producto nuevo** | Crear workflow completo | Agregar entrada al config |
| **Precisión de extracción** | Genérica | Específica por producto |
| **Complejidad** | Alta (múltiples workflows) | Baja (centralizado) |

---

## 🎯 Roadmap Futuro

### Q1 2026
- [x] Crédito hipotecario para compra de vivienda
- [x] Crédito de consumo
- [x] Crédito de vehículo
- [x] Leasing habitacional
- [x] Tarjeta de crédito

### Q2 2026
- [ ] Seguros (Vida, Auto, Hogar)
- [ ] CDT (Certificados de Depósito a Término)
- [ ] Fondos de inversión

### Q3 2026
- [ ] Cuentas de ahorro
- [ ] Cuentas corrientes
- [ ] Productos empresariales

---

## 🔗 Archivos Relacionados

- **Workflow**: `n8n/TextScrapperTool.json`
- **Changelog**: `n8n/CHANGELOG.md`
- **Documentación completa**: `.claude/CLAUDE.md`

---

## 📞 Soporte

Si encuentras algún problema o necesitas agregar un nuevo tipo de producto:

1. Editar `productConfig` en el nodo "Prepare LLM Prompt"
2. Agregar entrada en `pdfInstructions` en el nodo "Analyze document"
3. Actualizar formulario con nueva opción en dropdown

---

**Última actualización**: 2026-01-19
**Versión**: 1.1.0
**Desarrollado con**: Claude Code (Sonnet 4.5)
