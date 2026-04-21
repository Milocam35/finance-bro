import { config } from 'dotenv';

config();

export default () => ({
  port: parseInt(process.env.PORT || '3001', 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10) || 5432,
    username: process.env.DATABASE_USER || 'financebro',
    password: process.env.DATABASE_PASSWORD || 'password123',
    database: process.env.DATABASE_NAME || 'financebro_users_db',
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  },
});
