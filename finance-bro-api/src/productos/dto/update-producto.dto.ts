import { PartialType } from '@nestjs/swagger';
import { CreateProductoDto } from './create-producto.dto';

/**
 * DTO para actualizar un producto de crédito
 * Todos los campos son opcionales (hereda de CreateProductoDto con PartialType)
 */
export class UpdateProductoDto extends PartialType(CreateProductoDto) {}
