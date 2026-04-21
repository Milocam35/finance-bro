import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://127.0.0.1:5173',
          'http://127.0.0.1:5174',
          /^http:\/\/192\.168\.\d+\.\d+:517[34]$/,
          /^http:\/\/10\.\d+\.\d+\.\d+:517[34]$/,
          /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:517[34]$/,
          /\.trycloudflare\.com$/,
          /\.devtunnels\.ms$/,
        ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('FinanceBro Users API')
    .setDescription('Microservicio de autenticación y gestión de usuarios')
    .setVersion('1.0')
    .addTag('auth', 'Registro, login y perfil de usuario')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'FinanceBro Users API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`FinanceBro Users API running on :${port}`);
  console.log(`Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
