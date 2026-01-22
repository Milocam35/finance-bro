import { DataSource } from 'typeorm';
import { config } from 'dotenv';

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

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'financebro',
  password: process.env.DATABASE_PASSWORD || 'password123',
  database: process.env.DATABASE_NAME || 'financebro_db',
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
