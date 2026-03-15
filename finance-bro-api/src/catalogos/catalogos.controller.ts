import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CatalogosService } from './catalogos.service';
import {
  CreateEntidadFinancieraDto,
  UpdateEntidadFinancieraDto,
  EntidadFinancieraResponseDto,
} from './dto';

@ApiTags('Catálogos - Entidades Financieras')
@Controller('catalogos/entidades')
export class CatalogosController {
  constructor(private readonly catalogosService: CatalogosService) {}

  // ============================================
  // GET ALL
  // ============================================
  @Get()
  @ApiOperation({
    summary: 'Obtener todas las entidades financieras',
    description:
      'Retorna un listado de todas las entidades financieras registradas en el sistema. Por defecto solo retorna entidades activas.',
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Incluir entidades inactivas en el resultado',
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de entidades financieras obtenido exitosamente',
    type: [EntidadFinancieraResponseDto],
  })
  async findAll(
    @Query('includeInactive', new ParseBoolPipe({ optional: true }))
    includeInactive?: boolean,
  ): Promise<EntidadFinancieraResponseDto[]> {
    const entidades =
      await this.catalogosService.findAllEntidades(includeInactive);
    return EntidadFinancieraResponseDto.fromEntities(entidades);
  }

  // ============================================
  // GET ONE
  // ============================================
  @Get(':identifier')
  @ApiOperation({
    summary: 'Obtener una entidad financiera por ID o nombre normalizado',
    description:
      'Busca una entidad financiera específica usando su UUID o nombre normalizado (slug). Ejemplo: "123e4567-e89b-12d3-a456-426614174000" o "bancolombia"',
  })
  @ApiParam({
    name: 'identifier',
    description: 'UUID o nombre normalizado de la entidad financiera',
    example: 'bancolombia',
  })
  @ApiResponse({
    status: 200,
    description: 'Entidad financiera encontrada',
    type: EntidadFinancieraResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Entidad financiera no encontrada',
  })
  async findOne(
    @Param('identifier') identifier: string,
  ): Promise<EntidadFinancieraResponseDto> {
    const entidad = await this.catalogosService.findOneEntidad(identifier);
    return EntidadFinancieraResponseDto.fromEntity(entidad);
  }

  // ============================================
  // CREATE
  // ============================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una nueva entidad financiera',
    description:
      'Crea una nueva entidad financiera en el sistema. El nombre normalizado debe ser único y seguir el formato slug (ej: banco-de-bogota).',
  })
  @ApiBody({
    type: CreateEntidadFinancieraDto,
    description: 'Datos de la entidad financiera a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Entidad financiera creada exitosamente',
    type: EntidadFinancieraResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una entidad con ese nombre normalizado',
  })
  async create(
    @Body() createDto: CreateEntidadFinancieraDto,
  ): Promise<EntidadFinancieraResponseDto> {
    const entidad =
      await this.catalogosService.createEntidadFinanciera(createDto);
    return EntidadFinancieraResponseDto.fromEntity(entidad);
  }

  // ============================================
  // UPDATE
  // ============================================
  @Put(':identifier')
  @ApiOperation({
    summary: 'Actualizar una entidad financiera',
    description:
      'Actualiza los datos de una entidad financiera existente. Se puede actualizar nombre, nombre_normalizado, logo_url, sitio_web y estado activo.',
  })
  @ApiParam({
    name: 'identifier',
    description: 'UUID o nombre normalizado de la entidad financiera',
    example: 'bancolombia',
  })
  @ApiBody({
    type: UpdateEntidadFinancieraDto,
    description: 'Datos a actualizar (todos los campos son opcionales)',
  })
  @ApiResponse({
    status: 200,
    description: 'Entidad financiera actualizada exitosamente',
    type: EntidadFinancieraResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Entidad financiera no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'El nuevo nombre normalizado ya está en uso',
  })
  async update(
    @Param('identifier') identifier: string,
    @Body() updateDto: UpdateEntidadFinancieraDto,
  ): Promise<EntidadFinancieraResponseDto> {
    const entidad = await this.catalogosService.updateEntidadFinanciera(
      identifier,
      updateDto,
    );
    return EntidadFinancieraResponseDto.fromEntity(entidad);
  }

  // ============================================
  // SOFT DELETE
  // ============================================
  @Delete(':identifier')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desactivar una entidad financiera (soft delete)',
    description:
      'Desactiva una entidad financiera marcándola como inactiva. No elimina el registro de la base de datos. Use el endpoint /restore para reactivarla.',
  })
  @ApiParam({
    name: 'identifier',
    description: 'UUID o nombre normalizado de la entidad financiera',
    example: 'bancolombia',
  })
  @ApiResponse({
    status: 200,
    description: 'Entidad financiera desactivada exitosamente',
    type: EntidadFinancieraResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Entidad financiera no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede desactivar: tiene productos asociados',
  })
  async delete(
    @Param('identifier') identifier: string,
  ): Promise<EntidadFinancieraResponseDto> {
    const entidad =
      await this.catalogosService.deleteEntidadFinanciera(identifier);
    return EntidadFinancieraResponseDto.fromEntity(entidad);
  }

  // ============================================
  // HARD DELETE
  // ============================================
  @Delete(':identifier/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar permanentemente una entidad financiera (hard delete)',
    description:
      '⚠️ PELIGRO: Elimina permanentemente una entidad financiera de la base de datos. Esta acción no se puede deshacer. Solo usar en desarrollo o casos excepcionales.',
  })
  @ApiParam({
    name: 'identifier',
    description: 'UUID o nombre normalizado de la entidad financiera',
    example: 'bancolombia',
  })
  @ApiResponse({
    status: 204,
    description: 'Entidad financiera eliminada permanentemente',
  })
  @ApiResponse({
    status: 404,
    description: 'Entidad financiera no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar: tiene productos asociados',
  })
  async hardDelete(@Param('identifier') identifier: string): Promise<void> {
    await this.catalogosService.hardDeleteEntidadFinanciera(identifier);
  }

  // ============================================
  // RESTORE
  // ============================================
  @Put(':identifier/restore')
  @ApiOperation({
    summary: 'Restaurar una entidad financiera desactivada',
    description:
      'Reactiva una entidad financiera que fue desactivada previamente mediante soft delete.',
  })
  @ApiParam({
    name: 'identifier',
    description: 'UUID o nombre normalizado de la entidad financiera',
    example: 'bancolombia',
  })
  @ApiResponse({
    status: 200,
    description: 'Entidad financiera restaurada exitosamente',
    type: EntidadFinancieraResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Entidad financiera no encontrada',
  })
  async restore(
    @Param('identifier') identifier: string,
  ): Promise<EntidadFinancieraResponseDto> {
    const entidad =
      await this.catalogosService.restoreEntidadFinanciera(identifier);
    return EntidadFinancieraResponseDto.fromEntity(entidad);
  }
}
