import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductoCredito } from './producto-credito.entity';

@Entity('montos_productos')
export class MontoProducto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductoCredito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: ProductoCredito;

  @Column({ unique: true })
  producto_id: string;

  @Column({ type: 'bigint', nullable: true })
  monto_minimo: number;

  @Column({ type: 'bigint', nullable: true })
  monto_maximo: number;

  @Column({ type: 'int', nullable: true })
  plazo_minimo_meses: number;

  @Column({ type: 'int', nullable: true })
  plazo_maximo_meses: number;
}
