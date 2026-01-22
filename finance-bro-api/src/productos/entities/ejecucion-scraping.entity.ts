import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('ejecuciones_scraping')
export class EjecucionScraping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  entidad_nombre: string;

  @Column({ type: 'int', default: 0 })
  productos_procesados: number;

  @Column({ type: 'int', default: 0 })
  productos_nuevos: number;

  @Column({ type: 'int', default: 0 })
  productos_actualizados: number;

  @Column({ type: 'text', nullable: true })
  errores: string;

  @CreateDateColumn()
  created_at: Date;
}
