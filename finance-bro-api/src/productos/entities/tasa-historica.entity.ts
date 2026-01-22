import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ProductoCredito } from './producto-credito.entity';

@Entity('tasas_historicas')
export class TasaHistorica {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductoCredito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: ProductoCredito;

  @Column()
  producto_id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  tasa_valor: number;

  @Column({ type: 'date' })
  fecha_extraccion: Date;

  @Column({ type: 'time' })
  hora_extraccion: string;

  @CreateDateColumn()
  created_at: Date;
}
