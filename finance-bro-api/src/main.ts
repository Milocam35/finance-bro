import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para el frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : [
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          /^http:\/\/192\.168\.\d+\.\d+:5173$/,
          /^http:\/\/10\.\d+\.\d+\.\d+:5173$/,
          /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:5173$/,
          /\.trycloudflare\.com$/,
        ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Habilitar validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma payloads a instancias de DTO
    }),
  );

  // Configurar Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('FinanceBro API')
    .setDescription('API para ingesta y gestión de productos financieros desde n8n')
    .setVersion('1.0')
    .addTag('scraping', 'Endpoints de ingesta desde n8n')
    .addTag('catalogos', 'Catálogos maestros (entidades, tipos)')
    .addTag('productos', 'Gestión de productos crediticios')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API Key para autenticación de n8n',
      },
      'x-api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'FinanceBro API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🚀 FinanceBro API is running!                          ║
  ║                                                           ║
  ║   📍 API:     http://localhost:${port}                        ║
  ║   📚 Swagger: http://localhost:${port}/api/docs              ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
