import { Module } from '@nestjs/common';
import { ScrapingController } from './scraping.controller';
import { ScrapingService } from './scraping.service';
import { CatalogosModule } from '../catalogos/catalogos.module';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    CatalogosModule, // Para buscar/crear entidades y resolver códigos
    ProductosModule, // Para crear/actualizar productos y tasas
  ],
  controllers: [ScrapingController],
  providers: [ScrapingService],
  exports: [ScrapingService],
})
export class ScrapingModule {}
