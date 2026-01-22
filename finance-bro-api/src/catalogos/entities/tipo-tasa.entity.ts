import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_tasa')
export class TipoTasa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
