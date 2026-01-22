import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductoCredito } from './producto-credito.entity';

@Entity('requisitos_productos')
export class RequisitoProducto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductoCredito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: ProductoCredito;

  @Column()
  producto_id: string;

  @Column({ type: 'text' })
  requisito: string;

  @Column({ type: 'boolean', default: true })
  es_obligatorio: boolean;

  @Column({ type: 'int', default: 0 })
  orden: number;
}
