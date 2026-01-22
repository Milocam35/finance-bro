import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';

// Importar entidades de catálogos
import { EntidadFinanciera } from './catalogos/entities/entidad-financiera.entity';
import { TipoCredito } from './catalogos/entities/tipo-credito.entity';
import { TipoVivienda } from './catalogos/entities/tipo-vivienda.entity';
import { Denominacion } from './catalogos/entities/denominacion.entity';
import { TipoTasa } from './catalogos/entities/tipo-tasa.entity';
import { TipoPago } from './catalogos/entities/tipo-pago.entity';

// Importar entidades de productos
import { ProductoCredito } from './productos/entities/producto-credito.entity';
import { TasaVigente } from './productos/entities/tasa-vigente.entity';
import { TasaHistorica } from './productos/entities/tasa-historica.entity';
import { MontoProducto } from './productos/entities/monto-producto.entity';
import { CondicionProducto } from './productos/entities/condicion-producto.entity';
import { RequisitoProducto } from './productos/entities/requisito-producto.entity';
import { BeneficioProducto } from './productos/entities/beneficio-producto.entity';
import { EjecucionScraping } from './productos/entities/ejecucion-scraping.entity';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
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
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
