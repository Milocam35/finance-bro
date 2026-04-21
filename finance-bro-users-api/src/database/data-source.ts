import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

import { Usuario } from '../users/entities/usuario.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'financebro',
  password: process.env.DATABASE_PASSWORD || 'password123',
  database: process.env.DATABASE_NAME || 'financebro_users_db',
  entities: [Usuario],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
});
