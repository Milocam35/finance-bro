import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('entidades_financieras')
export class EntidadFinanciera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  nombre_normalizado: string;

  @Column({type: 'varchar', length: 255, nullable: true})
  logo_url: string | null;

  @Column({type: 'varchar', length: 255, nullable: true})
  sitio_web: string | null;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;
}
