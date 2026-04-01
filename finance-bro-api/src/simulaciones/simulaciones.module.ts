import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulacionesController } from './simulaciones.controller';
import { SimulacionesService } from './simulaciones.service';
import { TasaVigente } from '../productos/entities/tasa-vigente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TasaVigente])],
  controllers: [SimulacionesController],
  providers: [SimulacionesService],
  exports: [SimulacionesService],
})
export class SimulacionesModule {}
