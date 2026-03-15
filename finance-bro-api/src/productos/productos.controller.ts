import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryProductosDto } from './dto/query-productos.dto';
import {
  ProductoResponseDto,
  PaginatedProductosResponseDto,
} from './dto/producto-response.dto';

@ApiTags('productos')
@Controller('api/productos')
export class ProductosController {
  private readonly logger = new Logger(ProductosController.name);

  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar productos de crédito',
    description:
      'Obtiene una lista paginada de productos con filtros opcionales por entidad, tipo de crédito, tipo de vivienda, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
    type: PaginatedProductosResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de query inválidos',
  })
  async findAll(@Query() query: QueryProductosDto) {
    this.logger.log(
      `GET /api/productos - Filtros: ${JSON.stringify(query)}`,
    );

    const { page = 1, limit = 10, ...filters } = query;

    const { data, total } = await this.productosService.findAll({
      ...filters,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  @Get('tipo-credito/:tipoCreditoIdOrCodigo')
  @ApiOperation({
    summary: 'Listar productos por tipo de crédito',
    description:
      'Obtiene todos los productos de un tipo de crédito específico (hipotecario, consumo, etc.) con paginación. ' +
      'Acepta tanto UUID como código (ej: "hipotecario", "consumo").',
  })
  @ApiParam({
    name: 'tipoCreditoIdOrCodigo',
    description: 'UUID o código del tipo de crédito',
    examples: {
      uuid: {
        summary: 'Por UUID',
        value: '2e0430b1-d94d-4472-a34c-1b41fb9661c7',
      },
      codigo: {
        summary: 'Por código',
        value: 'hipotecario',
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos del tipo de crédito',
    type: PaginatedProductosResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de crédito no encontrado',
  })
  async findByTipoCredito(
    @Param('tipoCreditoIdOrCodigo') tipoCreditoIdOrCodigo: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    this.logger.log(
      `GET /api/productos/tipo-credito/${tipoCreditoIdOrCodigo} - page: ${page}, limit: ${limit}`,
    );

    const pageNum = page || 1;
    const limitNum = limit || 10;

    const tipoCreditoId = await this.productosService.resolveTipoCreditoId(
      tipoCreditoIdOrCodigo,
    );

    const { data, total } = await this.productosService.findAll({
      tipo_credito_id: tipoCreditoId,
      page: pageNum,
      limit: limitNum,
    });

    return {
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Get('entidad/:entidadIdOrNombre')
  @ApiOperation({
    summary: 'Listar productos por entidad financiera',
    description:
      'Obtiene todos los productos de una entidad financiera específica (Bancolombia, etc.) con paginación. ' +
      'Acepta tanto UUID como nombre normalizado (ej: "bancolombia").',
  })
  @ApiParam({
    name: 'entidadIdOrNombre',
    description: 'UUID o nombre normalizado de la entidad financiera',
    examples: {
      uuid: {
        summary: 'Por UUID',
        value: '092a19bc-7f8c-41cb-9a56-a49ac9c35508',
      },
      nombre: {
        summary: 'Por nombre normalizado',
        value: 'bancolombia',
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos de la entidad',
    type: PaginatedProductosResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Entidad financiera no encontrada',
  })
  async findByEntidad(
    @Param('entidadIdOrNombre') entidadIdOrNombre: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    this.logger.log(
      `GET /api/productos/entidad/${entidadIdOrNombre} - page: ${page}, limit: ${limit}`,
    );

    const pageNum = page || 1;
    const limitNum = limit || 10;

    const entidadId = await this.productosService.resolveEntidadId(
      entidadIdOrNombre,
    );

    const { data, total } = await this.productosService.findAll({
      entidad_id: entidadId,
      page: pageNum,
      limit: limitNum,
    });

    return {
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Get('mejores-tasas/:tipoCreditoId')
  @ApiOperation({
    summary: 'Obtener productos con mejores tasas',
    description:
      'Obtiene los productos con las tasas más bajas de un tipo de crédito específico, ordenados de menor a mayor.',
  })
  @ApiParam({
    name: 'tipoCreditoId',
    description: 'UUID del tipo de crédito',
    example: '2e0430b1-d94d-4472-a34c-1b41fb9661c7',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Cantidad de productos a retornar',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos con mejores tasas',
    type: [ProductoResponseDto],
  })
  async findMejoresTasas(
    @Param('tipoCreditoId', ParseUUIDPipe) tipoCreditoId: string,
    @Query('limit') limit?: number,
  ) {
    this.logger.log(
      `GET /api/productos/mejores-tasas/${tipoCreditoId} - limit: ${limit}`,
    );

    const limitNum = limit || 10;

    const productos = await this.productosService.findMejoresTasas(
      tipoCreditoId,
      limitNum,
    );

    return productos;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener producto por ID',
    description:
      'Obtiene un producto específico con todas sus relaciones: tasas, montos, condiciones, requisitos y beneficios.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del producto',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: ProductoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Producto con ID 550e8400-e29b-41d4-a716-446655440000 no encontrado',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`GET /api/productos/${id}`);

    const producto = await this.productosService.findOneComplete(id);

    return producto;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear producto de crédito',
    description:
      'Crea un nuevo producto de crédito con todas sus relaciones opcionales (tasas, montos, condiciones, etc.). ' +
      'Requiere IDs de catálogos existentes.',
  })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: ProductoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validación fallida o datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'id_unico_scraping no debe estar vacío',
          'entidad_id debe ser un UUID',
          'descripcion es obligatoria',
        ],
        error: 'Bad Request',
      },
    },
  })
  async create(@Body() dto: CreateProductoDto) {
    this.logger.log(
      `POST /api/productos - Creando: ${dto.id_unico_scraping}`,
    );

    // Crear producto base
    const producto = await this.productosService.create({
      id_unico_scraping: dto.id_unico_scraping,
      entidad_id: dto.entidad_id,
      tipo_credito_id: dto.tipo_credito_id,
      tipo_vivienda_id: dto.tipo_vivienda_id,
      denominacion_id: dto.denominacion_id,
      tipo_tasa_id: dto.tipo_tasa_id,
      tipo_pago_id: dto.tipo_pago_id,
      descripcion: dto.descripcion,
      url_extraccion: dto.url_extraccion,
      url_redireccion: dto.url_redireccion,
      url_pdf: dto.url_pdf,
      fecha_extraccion: new Date(dto.fecha_extraccion),
      hora_extraccion: dto.hora_extraccion,
      activo: dto.activo ?? true,
    });

    // Crear relaciones opcionales
    if (dto.tasa) {
      await this.productosService.createTasaVigente({
        producto_id: producto.id,
        ...dto.tasa,
        fecha_vigencia: new Date(),
      });
    }

    if (dto.monto) {
      await this.productosService.upsertMontos(producto.id, dto.monto);
    }

    if (dto.condiciones && dto.condiciones.length > 0) {
      await this.productosService.replaceCondiciones(producto.id, dto.condiciones);
    }

    if (dto.requisitos && dto.requisitos.length > 0) {
      await this.productosService.replaceRequisitos(
        producto.id,
        dto.requisitos.map((r) => ({
          ...r,
          tipo_requisito: 'general', // Valor por defecto
        })),
      );
    }

    if (dto.beneficios && dto.beneficios.length > 0) {
      await this.productosService.replaceBeneficios(
        producto.id,
        dto.beneficios.map((b) => ({
          tipo_beneficio: b.tipo_beneficio,
          descripcion: b.descripcion,
          valor: b.valor ?? null,
          aplica_condicion: b.aplica_condicion ?? null,
        })),
      );
    }

    this.logger.log(`Producto creado: ${producto.id}`);

    // Retornar producto completo
    return await this.productosService.findOneComplete(producto.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar producto de crédito',
    description:
      'Actualiza un producto existente. Todos los campos son opcionales. ' +
      'Si se envían arrays (condiciones, requisitos, beneficios), se reemplazan completamente.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del producto',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
    type: ProductoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Validación fallida',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductoDto,
  ) {
    this.logger.log(`PUT /api/productos/${id}`);

    // Actualizar producto base
    if (
      dto.id_unico_scraping ||
      dto.entidad_id ||
      dto.tipo_credito_id ||
      dto.tipo_vivienda_id ||
      dto.denominacion_id ||
      dto.tipo_tasa_id ||
      dto.tipo_pago_id ||
      dto.descripcion ||
      dto.url_extraccion ||
      dto.url_redireccion ||
      dto.url_pdf !== undefined ||
      dto.fecha_extraccion ||
      dto.hora_extraccion ||
      dto.activo !== undefined
    ) {
      await this.productosService.update(id, {
        id_unico_scraping: dto.id_unico_scraping,
        entidad_id: dto.entidad_id,
        tipo_credito_id: dto.tipo_credito_id,
        tipo_vivienda_id: dto.tipo_vivienda_id,
        denominacion_id: dto.denominacion_id,
        tipo_tasa_id: dto.tipo_tasa_id,
        tipo_pago_id: dto.tipo_pago_id,
        descripcion: dto.descripcion,
        url_extraccion: dto.url_extraccion,
        url_redireccion: dto.url_redireccion,
        url_pdf: dto.url_pdf,
        fecha_extraccion: dto.fecha_extraccion ? new Date(dto.fecha_extraccion) : undefined,
        hora_extraccion: dto.hora_extraccion,
        activo: dto.activo,
      });
    }

    // Actualizar relaciones opcionales
    if (dto.tasa) {
      await this.productosService.updateTasaVigente(id, {
        ...dto.tasa,
        fecha_vigencia: new Date(),
      });
    }

    if (dto.monto) {
      await this.productosService.upsertMontos(id, dto.monto);
    }

    if (dto.condiciones) {
      await this.productosService.replaceCondiciones(id, dto.condiciones);
    }

    if (dto.requisitos) {
      await this.productosService.replaceRequisitos(
        id,
        dto.requisitos.map((r) => ({
          ...r,
          tipo_requisito: 'general',
        })),
      );
    }

    if (dto.beneficios) {
      await this.productosService.replaceBeneficios(
        id,
        dto.beneficios.map((b) => ({
          tipo_beneficio: b.tipo_beneficio,
          descripcion: b.descripcion,
          valor: b.valor ?? null,
          aplica_condicion: b.aplica_condicion ?? null,
        })),
      );
    }

    this.logger.log(`Producto actualizado: ${id}`);

    // Retornar producto completo actualizado
    return await this.productosService.findOneComplete(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar producto de crédito',
    description:
      'Elimina un producto de crédito. Por defecto hace soft delete (desactivación), ' +
      'pero se puede hacer hard delete (eliminación física) usando el parámetro ?permanent=true. ' +
      'ADVERTENCIA: El hard delete NO se puede deshacer y elimina todas las relaciones.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del producto',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'permanent',
    required: false,
    type: Boolean,
    description: 'Si es true, elimina permanentemente (hard delete). Por defecto es false (soft delete).',
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado exitosamente',
    schema: {
      oneOf: [
        {
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Producto desactivado exitosamente' },
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            type: { type: 'string', example: 'soft_delete' },
          },
        },
        {
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Producto eliminado permanentemente' },
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            type: { type: 'string', example: 'hard_delete' },
            affected: { type: 'number', example: 1 },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('permanent') permanent?: string,
  ) {
    const isPermanent = permanent === 'true';

    this.logger.log(
      `DELETE /api/productos/${id} - permanent: ${isPermanent}`,
    );

    if (isPermanent) {
      // Hard delete
      const result = await this.productosService.hardDelete(id);

      return {
        success: true,
        message: 'Producto eliminado permanentemente (IRREVERSIBLE)',
        id,
        type: 'hard_delete',
        affected: result.affected,
      };
    } else {
      // Soft delete (default)
      await this.productosService.remove(id);

      return {
        success: true,
        message: 'Producto desactivado exitosamente',
        id,
        type: 'soft_delete',
      };
    }
  }
}
