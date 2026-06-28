import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { getDbConnectionOptions } from './db-config';

// Cargar variables de entorno
config();

// Importar todas las entidades de catálogos
import { EntidadFinanciera } from '../catalogos/entities/entidad-financiera.entity';
import { TipoCredito } from '../catalogos/entities/tipo-credito.entity';
import { TipoVivienda } from '../catalogos/entities/tipo-vivienda.entity';
import { Denominacion } from '../catalogos/entities/denominacion.entity';
import { TipoTasa } from '../catalogos/entities/tipo-tasa.entity';
import { TipoPago } from '../catalogos/entities/tipo-pago.entity';

// Importar todas las entidades de productos
import { ProductoCredito } from '../productos/entities/producto-credito.entity';
import { TasaVigente } from '../productos/entities/tasa-vigente.entity';
import { TasaHistorica } from '../productos/entities/tasa-historica.entity';
import { MontoProducto } from '../productos/entities/monto-producto.entity';
import { CondicionProducto } from '../productos/entities/condicion-producto.entity';
import { RequisitoProducto } from '../productos/entities/requisito-producto.entity';
import { BeneficioProducto } from '../productos/entities/beneficio-producto.entity';
import { EjecucionScraping } from '../productos/entities/ejecucion-scraping.entity';

// Para migraciones usa preferentemente DATABASE_MIGRATION_URL (pooler de sesión
// 5432 / conexión directa). Si no existe, cae a DATABASE_URL y luego a las
// variables discretas DATABASE_*.
export const AppDataSource = new DataSource({
  type: 'postgres',
  ...getDbConnectionOptions(process.env.DATABASE_MIGRATION_URL),
  entities: [
    // Catálogos
    EntidadFinanciera,
    TipoCredito,
    TipoVivienda,
    Denominacion,
    TipoTasa,
    TipoPago,
    // Productos
    ProductoCredito,
    TasaVigente,
    TasaHistorica,
    MontoProducto,
    CondicionProducto,
    RequisitoProducto,
    BeneficioProducto,
    EjecucionScraping,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // NUNCA true en producción
  logging: process.env.TYPEORM_LOGGING === 'true',
});
