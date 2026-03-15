import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiBody,
} from '@nestjs/swagger';
import { ScrapingService } from './scraping.service';
import { N8nProductoDto } from './dto/n8n-producto.dto';
import { ApiKeyGuard } from './guards/api-key.guard';

@ApiTags('scraping')
@ApiSecurity('x-api-key')
@Controller('api/scraping')
@UseGuards(ApiKeyGuard)
export class ScrapingController {
  private readonly logger = new Logger(ScrapingController.name);

  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('ingest')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Ingestar producto desde n8n',
    description:
      'Endpoint para recibir datos de productos financieros desde el workflow de n8n. ' +
      'Crea o actualiza productos usando el campo id_unico como identificador. ' +
      'Detecta cambios en tasas y mantiene histórico completo.',
  })
  @ApiBody({
    type: N8nProductoDto,
    description: 'Datos del producto extraído por n8n',
    examples: {
      ejemplo_completo: {
        summary: 'Producto completo con todos los campos',
        value: {
          id_unico: 'bancolombia__hipotecario__vis__pesos',
          banco: 'Bancolombia',
          tipo_credito: 'Crédito hipotecario para compra de vivienda',
          tipo_vivienda: 'VIS',
          denominacion: 'Pesos',
          descripcion: 'Crédito hipotecario VIS en pesos',
          fecha_extraccion: '2025-01-28',
          hora_extraccion: '10:30:00',
          url_pagina: 'https://www.bancolombia.com/personas/creditos/hipotecario',
          tasa: '11.50% EA',
          tasa_minima: '10.50',
          tasa_maxima: '12.50',
          tipo_tasa: 'Tasa efectiva anual',
          monto_minimo: '$50.000.000',
          monto_maximo: '$200.000.000',
          plazo_maximo: '20 años',
          tipo_pago: 'Cuota fija',
          condiciones: 'Tener cuenta de nómina; Seguro de vida obligatorio',
          requisitos: 'Documento de identidad; Certificado de ingresos',
          descuento_nomina: '+200 pbs con cuenta de nómina',
          beneficio_avaluo: 'Avalúo sin costo',
          url_pdf: 'https://www.bancolombia.com/docs/credito.pdf',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Producto creado o actualizado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Producto creado exitosamente',
        data: {
          success: true,
          producto_id: '550e8400-e29b-41d4-a716-446655440000',
          accion: 'creado',
          cambio_tasa: false,
          tasa_anterior: undefined,
          tasa_nueva: 11.5,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validación fallida o datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'El id_unico debe tener al menos 5 caracteres',
          'El banco es obligatorio',
          'La fecha_extraccion debe tener formato YYYY-MM-DD',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'API key inválida o ausente',
    schema: {
      example: {
        statusCode: 401,
        message: 'API key requerida. Incluye el header x-api-key',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error procesando producto',
        error: 'Internal Server Error',
      },
    },
  })
  async ingestarProducto(@Body() dto: N8nProductoDto) {
    this.logger.log(`Recibida solicitud de ingesta: id_unico=${dto.id_unico}, banco=${dto.banco}`);

    try {
      const resultado = await this.scrapingService.ingestarProducto(dto);

      this.logger.log(
        `Ingesta exitosa: ${resultado.accion} | Producto ID: ${resultado.producto_id}`,
      );

      return {
        success: true,
        message: `Producto ${resultado.accion} exitosamente`,
        data: resultado,
      };
    } catch (error) {
      this.logger.error(`Error en ingesta: ${error.message}`, error.stack);
      throw error;
    }
  }
}
