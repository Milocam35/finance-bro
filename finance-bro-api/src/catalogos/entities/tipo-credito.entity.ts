import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_credito')
export class TipoCredito {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
