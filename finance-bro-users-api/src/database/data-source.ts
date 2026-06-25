import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

import { Usuario } from '../users/entities/usuario.entity';
import { getDbConnectionOptions } from './db-config';

// Para migraciones usa preferentemente DATABASE_MIGRATION_URL (pooler de sesión
// 5432 / conexión directa). Si no existe, cae a DATABASE_URL y luego a las
// variables discretas DATABASE_*.
export const AppDataSource = new DataSource({
  type: 'postgres',
  ...getDbConnectionOptions(process.env.DATABASE_MIGRATION_URL),
  entities: [Usuario],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
});
