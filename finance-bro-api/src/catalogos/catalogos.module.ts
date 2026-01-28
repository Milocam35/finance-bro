import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogosService } from './catalogos.service';
import { EntidadFinanciera } from './entities/entidad-financiera.entity';
import { TipoCredito } from './entities/tipo-credito.entity';
import { TipoVivienda } from './entities/tipo-vivienda.entity';
import { Denominacion } from './entities/denominacion.entity';
import { TipoTasa } from './entities/tipo-tasa.entity';
import { TipoPago } from './entities/tipo-pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EntidadFinanciera,
      TipoCredito,
      TipoVivienda,
      Denominacion,
      TipoTasa,
      TipoPago,
    ]),
  ],
  providers: [CatalogosService],
  exports: [CatalogosService], // Exportamos para usar en ScrapingModule
})
export class CatalogosModule {}
