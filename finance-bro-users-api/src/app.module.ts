import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { HealthModule } from './health/health.module.js';
import { Usuario } from './users/entities/usuario.entity.js';
import { getDbConnectionOptions } from './database/db-config.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // Usa DATABASE_URL (pooler de transacción 6543 en Supabase) si está
        // definida; si no, cae a las variables DATABASE_* (Docker local).
        ...getDbConnectionOptions(),
        entities: [Usuario],
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    HealthModule,
  ],
})
export class AppModule {}
