import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductoCredito } from './producto-credito.entity';

@Entity('beneficios_productos')
export class BeneficioProducto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductoCredito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: ProductoCredito;

  @Column()
  producto_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipo_beneficio: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  valor: string;

  @Column({ type: 'text', nullable: true })
  aplica_condicion: string;

  @Column({ type: 'int', default: 0 })
  orden: number;
}
