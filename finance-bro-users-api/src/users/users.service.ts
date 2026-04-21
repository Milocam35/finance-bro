import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity.js';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { email, activo: true } });
  }

  // Incluye password_hash — solo para validación en login
  async findByEmailWithPassword(email: string): Promise<Usuario | null> {
    return this.usuarioRepo
      .createQueryBuilder('usuario')
      .addSelect('usuario.password_hash')
      .where('usuario.email = :email', { email })
      .andWhere('usuario.activo = :activo', { activo: true })
      .getOne();
  }

  async findById(id: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { id, activo: true } });
  }

  async create(data: {
    nombre: string;
    email: string;
    password_hash: string;
  }): Promise<Usuario> {
    const usuario = this.usuarioRepo.create(data);
    const saved = await this.usuarioRepo.save(usuario);
    this.logger.log(`Usuario creado: ${saved.email} (ID: ${saved.id})`);
    return saved;
  }
}
