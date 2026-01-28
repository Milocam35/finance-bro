import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);
  private readonly n8nApiKey: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('api.n8nApiKey');

    if (!apiKey) {
      this.logger.error('N8N_API_KEY no está configurada en las variables de entorno');
      throw new Error('N8N_API_KEY no configurada');
    }

    this.n8nApiKey = apiKey;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKeyHeader = request.headers['x-api-key'];

    // Normalizar el header (puede ser string, string[] o undefined)
    const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;

    if (!apiKey) {
      this.logger.warn('Intento de acceso sin API key');
      throw new UnauthorizedException('API key requerida. Incluye el header x-api-key');
    }

    if (apiKey !== this.n8nApiKey) {
      const truncatedKey = apiKey.length > 10 ? apiKey.substring(0, 10) + '...' : apiKey;
      this.logger.warn(`Intento de acceso con API key inválida: ${truncatedKey}`);
      throw new UnauthorizedException('API key inválida');
    }

    this.logger.log('Acceso autorizado con API key válida');
    return true;
  }
}
