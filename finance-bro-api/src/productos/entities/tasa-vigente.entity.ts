import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductoCredito } from './producto-credito.entity';

@Entity('tasas_vigentes')
export class TasaVigente {
  @PrimaryColumn('uuid')
  producto_id: string;

  @ManyToOne(() => ProductoCredito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: ProductoCredito;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  tasa_valor: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tasa_texto_original: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  tasa_minima: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  tasa_maxima: number;

  @Column({ type: 'boolean', default: false })
  es_rango: boolean;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_vigencia: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
