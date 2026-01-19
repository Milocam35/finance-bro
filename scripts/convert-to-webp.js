import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración
const CONFIG = {
  quality: 80, // Calidad de 0-100 (80 es excelente balance para web)
  lossless: false, // true = sin pérdida, false = con pérdida mínima
  effort: 6, // 0-6, mayor = mejor compresión pero más lento

  // Configuración para thumbnails (preview rápido)
  thumbnail: {
    width: 800, // Ancho máximo para thumbnails
    quality: 75,
    suffix: '-thumb',
  },

  // Configuración para optimización adicional
  resize: {
    maxWidth: 1920, // Ancho máximo para imágenes grandes
    maxHeight: 1080,
  }
};

// Directorios a procesar
const DIRECTORIES = [
  join(__dirname, '../finance-bro-web/public/images/index'),
  // Agrega más directorios aquí si necesitas
];

// Extensiones soportadas
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

/**
 * Convierte una imagen a formato WebP (versión optimizada)
 */
async function convertToWebP(inputPath, outputPath) {
  try {
    // Obtener tamaño del archivo original
    const inputStats = await stat(inputPath);
    const inputSize = inputStats.size;

    // Obtener metadata de la imagen
    const metadata = await sharp(inputPath).metadata();

    // Crear pipeline de Sharp
    let pipeline = sharp(inputPath);

    // Redimensionar si la imagen es muy grande
    if (metadata.width > CONFIG.resize.maxWidth || metadata.height > CONFIG.resize.maxHeight) {
      pipeline = pipeline.resize(CONFIG.resize.maxWidth, CONFIG.resize.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convertir a WebP
    const outputStats = await pipeline
      .webp({
        quality: CONFIG.quality,
        lossless: CONFIG.lossless,
        effort: CONFIG.effort,
      })
      .toFile(outputPath);

    return {
      success: true,
      inputSize: inputSize,
      outputSize: outputStats.size,
      savings: 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Crea un thumbnail (versión pequeña) de la imagen
 */
async function createThumbnail(inputPath, outputPath) {
  try {
    const inputStats = await stat(inputPath);

    const outputStats = await sharp(inputPath)
      .resize(CONFIG.thumbnail.width, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: CONFIG.thumbnail.quality,
        lossless: false,
        effort: CONFIG.effort,
      })
      .toFile(outputPath);

    return {
      success: true,
      inputSize: inputStats.size,
      outputSize: outputStats.size,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Procesa todas las imágenes en un directorio
 */
async function processDirectory(dirPath) {
  console.log(`\n📂 Procesando directorio: ${dirPath}`);

  if (!existsSync(dirPath)) {
    console.log(`❌ El directorio no existe: ${dirPath}`);
    return { processed: 0, success: 0, failed: 0, totalSavings: 0 };
  }

  const files = await readdir(dirPath);
  const imageFiles = files.filter((file) =>
    SUPPORTED_EXTENSIONS.includes(extname(file).toLowerCase())
  );

  console.log(`📷 Encontradas ${imageFiles.length} imágenes\n`);

  let processed = 0;
  let success = 0;
  let failed = 0;
  let totalInputSize = 0;
  let totalOutputSize = 0;

  for (const file of imageFiles) {
    const inputPath = join(dirPath, file);
    const baseName = basename(file, extname(file));
    const outputFileName = baseName + '.webp';
    const outputPath = join(dirPath, outputFileName);
    const thumbFileName = baseName + CONFIG.thumbnail.suffix + '.webp';
    const thumbPath = join(dirPath, thumbFileName);

    console.log(`🔄 Convirtiendo: ${file}`);

    // Convertir imagen principal
    const result = await convertToWebP(inputPath, outputPath);
    processed++;

    if (result.success) {
      success++;
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;

      const savings = ((1 - result.outputSize / result.inputSize) * 100).toFixed(1);
      console.log(
        `✅ ${outputFileName} - Ahorro: ${savings}% (${(result.inputSize / 1024).toFixed(1)}KB → ${(result.outputSize / 1024).toFixed(1)}KB)`
      );

      // Crear thumbnail
      console.log(`   🖼️  Creando thumbnail...`);
      const thumbResult = await createThumbnail(inputPath, thumbPath);
      if (thumbResult.success) {
        console.log(
          `   ✅ ${thumbFileName} - ${(thumbResult.outputSize / 1024).toFixed(1)}KB`
        );
      }
    } else {
      failed++;
      console.log(`❌ Error: ${result.error}`);
    }
  }

  const totalSavings = totalInputSize > 0
    ? ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1)
    : 0;

  return { processed, success, failed, totalSavings, totalInputSize, totalOutputSize };
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando conversión de imágenes a WebP');
  console.log(`⚙️  Configuración: calidad=${CONFIG.quality}, lossless=${CONFIG.lossless}, effort=${CONFIG.effort}\n`);

  let grandTotalProcessed = 0;
  let grandTotalSuccess = 0;
  let grandTotalFailed = 0;
  let grandTotalInputSize = 0;
  let grandTotalOutputSize = 0;

  for (const dir of DIRECTORIES) {
    const stats = await processDirectory(dir);
    grandTotalProcessed += stats.processed;
    grandTotalSuccess += stats.success;
    grandTotalFailed += stats.failed;
    grandTotalInputSize += stats.totalInputSize || 0;
    grandTotalOutputSize += stats.totalOutputSize || 0;

    if (stats.processed > 0) {
      console.log(`\n📊 Resumen del directorio:`);
      console.log(`   Procesadas: ${stats.processed}`);
      console.log(`   Exitosas: ${stats.success}`);
      console.log(`   Fallidas: ${stats.failed}`);
      console.log(`   Ahorro total: ${stats.totalSavings}%`);
    }
  }

  const grandTotalSavings = grandTotalInputSize > 0
    ? ((1 - grandTotalOutputSize / grandTotalInputSize) * 100).toFixed(1)
    : 0;

  console.log('\n' + '='.repeat(60));
  console.log('📈 RESUMEN GENERAL');
  console.log('='.repeat(60));
  console.log(`Total procesadas: ${grandTotalProcessed}`);
  console.log(`Total exitosas: ${grandTotalSuccess}`);
  console.log(`Total fallidas: ${grandTotalFailed}`);
  console.log(`Tamaño original: ${(grandTotalInputSize / 1024).toFixed(1)}KB`);
  console.log(`Tamaño final: ${(grandTotalOutputSize / 1024).toFixed(1)}KB`);
  console.log(`Ahorro total: ${grandTotalSavings}%`);
  console.log('='.repeat(60));

  console.log('\n✨ Conversión completada');
  console.log('\n💡 Próximos pasos:');
  console.log('   1. Verifica la calidad de las imágenes convertidas');
  console.log('   2. Actualiza las referencias en tu código React');
  console.log('   3. Elimina las imágenes originales (opcional)');
}

main().catch(console.error);
