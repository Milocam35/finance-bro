import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { N8nProductoDto } from './dto/n8n-producto.dto';
import { ApiKeyGuard } from './guards/api-key.guard';

@Controller('api/scraping')
@UseGuards(ApiKeyGuard)
export class ScrapingController {
  private readonly logger = new Logger(ScrapingController.name);

  constructor(private readonly scrapingService: ScrapingService) {}

  /**
   * Endpoint de ingesta de productos desde n8n
   *
   * POST /api/scraping/ingest
   *
   * Headers:
   *   x-api-key: <N8N_API_KEY>
   *
   * Body (JSON):
   *   N8nProductoDto
   *
   * Responses:
   *   201: Producto creado/actualizado exitosamente
   *   400: Validación fallida o datos inválidos
   *   401: API key inválida o ausente
   *   500: Error interno del servidor
   */
  @Post('ingest')
  @HttpCode(HttpStatus.CREATED)
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
