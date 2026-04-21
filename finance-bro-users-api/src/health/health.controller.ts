import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check del MS Usuarios' })
  @ApiResponse({ status: 200, description: 'Servicio saludable' })
  @ApiResponse({ status: 503, description: 'Servicio no disponible' })
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
