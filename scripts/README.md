# Script de Conversión a WebP

Este script convierte automáticamente todas las imágenes (JPG, PNG, GIF) a formato WebP con alta calidad y optimización.

## Instalación

Instala la dependencia Sharp:

```bash
cd finance-bro-web
npm install
```

## Uso

Ejecuta el script desde el directorio `finance-bro-web`:

```bash
npm run convert:webp
```

## Configuración

Puedes ajustar la configuración en `convert-to-webp.js`:

```javascript
const CONFIG = {
  quality: 90,      // Calidad de 0-100 (recomendado: 85-95)
  lossless: false,  // true = sin pérdida, false = con pérdida mínima
  effort: 6,        // 0-6, mayor = mejor compresión (recomendado: 6)
};
```

### Niveles de Calidad Recomendados

- **90-95**: Calidad premium, ideal para imágenes importantes
- **85-90**: Excelente balance calidad/tamaño (recomendado)
- **75-85**: Buena calidad, mayor compresión
- **100 + lossless: true**: Sin pérdida (archivos más grandes)

## Agregar Más Directorios

Edita la constante `DIRECTORIES` en el script:

```javascript
const DIRECTORIES = [
  join(__dirname, '../finance-bro-web/public/images/index'),
  join(__dirname, '../finance-bro-web/public/images/logos'),
  join(__dirname, '../finance-bro-web/src/assets'),
];
```

## Qué Hace el Script

1. ✅ Escanea los directorios configurados
2. ✅ Identifica imágenes JPG, PNG y GIF
3. ✅ Convierte cada imagen a WebP con la calidad especificada
4. ✅ Guarda las nuevas imágenes junto a las originales
5. ✅ Muestra estadísticas de ahorro de espacio

## Salida Esperada

```
🚀 Iniciando conversión de imágenes a WebP
⚙️  Configuración: calidad=90, lossless=false, effort=6

📂 Procesando directorio: .../public/images/index
📷 Encontradas 7 imágenes

🔄 Convirtiendo: analisis-detallado.jpg
✅ analisis-detallado.webp - Ahorro: 32.5% (150KB → 101KB)
🔄 Convirtiendo: comparacion.jpg
✅ comparacion.webp - Ahorro: 28.3% (120KB → 86KB)
...

📊 Resumen del directorio:
   Procesadas: 7
   Exitosas: 7
   Fallidas: 0
   Ahorro total: 30.2%

============================================================
📈 RESUMEN GENERAL
============================================================
Total procesadas: 7
Total exitosas: 7
Total fallidas: 0
Tamaño original: 850.0KB
Tamaño final: 593.3KB
Ahorro total: 30.2%
============================================================

✨ Conversión completada

💡 Próximos pasos:
   1. Verifica la calidad de las imágenes convertidas
   2. Actualiza las referencias en tu código React
   3. Elimina las imágenes originales (opcional)
```

## Próximos Pasos

### 1. Verificar Calidad
Abre las imágenes `.webp` generadas y compara con las originales.

### 2. Actualizar Código React
Cambia las referencias de imágenes en tus componentes:

```tsx
// Antes
<img src="/images/index/analisis-detallado.jpg" alt="..." />

// Después
<img src="/images/index/analisis-detallado.webp" alt="..." />
```

### 3. Fallback para Navegadores Antiguos (Opcional)
Usa el elemento `<picture>` para compatibilidad:

```tsx
<picture>
  <source srcSet="/images/index/analisis-detallado.webp" type="image/webp" />
  <img src="/images/index/analisis-detallado.jpg" alt="..." />
</picture>
```

### 4. Eliminar Originales
Una vez verificado todo, elimina las imágenes originales:

```bash
# Revisa que todo funcione antes de eliminar
rm finance-bro-web/public/images/index/*.jpg
rm finance-bro-web/public/images/index/*.png
```

## Ventajas de WebP

- 🚀 **25-35% menor tamaño** que JPG/PNG
- ✨ **Misma calidad visual** perceptible
- 🎯 **Mejor rendimiento web** (PageSpeed, Core Web Vitals)
- 🌐 **Soporte universal** (Chrome, Firefox, Safari, Edge)
- 💾 **Soporte transparencia** (mejor que PNG)

## Troubleshooting

### Error: "Cannot find module 'sharp'"
```bash
cd finance-bro-web
npm install
```

### Error: "sharp ENOENT"
Sharp necesita compilarse para tu sistema. Reinstala:
```bash
npm uninstall sharp
npm install sharp
```

### Calidad baja en las imágenes
Aumenta `quality` a 95 o usa `lossless: true` en la configuración.

## Recursos

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP Documentation](https://developers.google.com/speed/webp)
- [Can I Use WebP](https://caniuse.com/webp)
