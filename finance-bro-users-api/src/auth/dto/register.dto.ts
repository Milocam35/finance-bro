import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan García', minLength: 2, maxLength: 120 })
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(120, { message: 'El nombre no puede superar 120 caracteres' })
  nombre: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail({}, { message: 'Ingresa un correo válido' })
  email: string;

  @ApiProperty({ example: 'MiClave123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'La contraseña debe contener al menos una mayúscula y un número',
  })
  password: string;
}
