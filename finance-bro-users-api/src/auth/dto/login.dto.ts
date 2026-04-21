import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail({}, { message: 'Ingresa un correo válido' })
  email: string;

  @ApiProperty({ example: 'MiClave123' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
}
