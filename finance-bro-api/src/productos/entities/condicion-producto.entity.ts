import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductoCredito } from './producto-credito.entity';

@Entity('condiciones_productos')
export class CondicionProducto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductoCredito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: ProductoCredito;

  @Column()
  producto_id: string;

  @Column({ type: 'text' })
  condicion: string;

  @Column({ type: 'int', default: 0 })
  orden: number;
}
