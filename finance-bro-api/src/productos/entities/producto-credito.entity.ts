import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntidadFinanciera } from '../../catalogos/entities/entidad-financiera.entity';
import { TipoCredito } from '../../catalogos/entities/tipo-credito.entity';
import { TipoVivienda } from '../../catalogos/entities/tipo-vivienda.entity';
import { Denominacion } from '../../catalogos/entities/denominacion.entity';
import { TipoTasa } from '../../catalogos/entities/tipo-tasa.entity';
import { TipoPago } from '../../catalogos/entities/tipo-pago.entity';

@Entity('productos_credito')
export class ProductoCredito {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  id_unico_scraping: string;

  @ManyToOne(() => EntidadFinanciera)
  @JoinColumn({ name: 'entidad_id' })
  entidad: EntidadFinanciera;

  @Column()
  entidad_id: string;

  @ManyToOne(() => TipoCredito)
  @JoinColumn({ name: 'tipo_credito_id' })
  tipo_credito: TipoCredito;

  @Column()
  tipo_credito_id: string;

  @ManyToOne(() => TipoVivienda)
  @JoinColumn({ name: 'tipo_vivienda_id' })
  tipo_vivienda: TipoVivienda;

  @Column()
  tipo_vivienda_id: string;

  @ManyToOne(() => Denominacion)
  @JoinColumn({ name: 'denominacion_id' })
  denominacion: Denominacion;

  @Column()
  denominacion_id: string;

  @ManyToOne(() => TipoTasa)
  @JoinColumn({ name: 'tipo_tasa_id' })
  tipo_tasa: TipoTasa;

  @Column()
  tipo_tasa_id: string;

  @ManyToOne(() => TipoPago, { nullable: true })
  @JoinColumn({ name: 'tipo_pago_id' })
  tipo_pago: TipoPago;

  @Column({ nullable: true })
  tipo_pago_id: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'text' })
  url_extraccion: string;

  @Column({ type: 'text' })
  url_redireccion: string;

  @Column({ type: 'text', nullable: true })
  url_pdf: string;

  @Column({ type: 'date' })
  fecha_extraccion: Date;

  @Column({ type: 'time' })
  hora_extraccion: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
