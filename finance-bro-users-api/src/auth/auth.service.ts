import {
  Injectable,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const usuario = await this.usersService.findByEmailWithPassword(email);
    if (!usuario) return null;

    const isPasswordValid = await bcrypt.compare(
      password,
      (usuario as any).password_hash,
    );
    if (!isPasswordValid) return null;

    // Retorna el usuario sin el hash
    const { password_hash: _pw, ...result } = usuario as any;
    return result;
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);
    const usuario = await this.usersService.create({
      nombre: dto.nombre,
      email: dto.email,
      password_hash,
    });

    this.logger.log(`Nuevo registro: ${usuario.email}`);

    return {
      access_token: this.signToken(usuario),
      user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    };
  }

  async login(usuario: any) {
    return {
      access_token: this.signToken(usuario),
      user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    };
  }

  private signToken(usuario: { id: string; email: string; nombre: string }): string {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
    };
    return this.jwtService.sign(payload);
  }
}
