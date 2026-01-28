import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductoCredito } from './entities/producto-credito.entity';
import { TasaVigente } from './entities/tasa-vigente.entity';
import { TasaHistorica } from './entities/tasa-historica.entity';
import { MontoProducto } from './entities/monto-producto.entity';
import { CondicionProducto } from './entities/condicion-producto.entity';
import { RequisitoProducto } from './entities/requisito-producto.entity';
import { BeneficioProducto } from './entities/beneficio-producto.entity';
import { EjecucionScraping } from './entities/ejecucion-scraping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductoCredito,
      TasaVigente,
      TasaHistorica,
      MontoProducto,
      CondicionProducto,
      RequisitoProducto,
      BeneficioProducto,
      EjecucionScraping,
    ]),
  ],
  providers: [ProductosService],
  exports: [ProductosService], // Exportamos para usar en ScrapingModule
})
export class ProductosModule {}
