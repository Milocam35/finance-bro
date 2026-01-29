import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { ProductoCredito } from '../src/productos/entities/producto-credito.entity';
import { TasaVigente } from '../src/productos/entities/tasa-vigente.entity';
import { TasaHistorica } from '../src/productos/entities/tasa-historica.entity';
import { MontoProducto } from '../src/productos/entities/monto-producto.entity';
import { CondicionProducto } from '../src/productos/entities/condicion-producto.entity';
import { RequisitoProducto } from '../src/productos/entities/requisito-producto.entity';
import { BeneficioProducto } from '../src/productos/entities/beneficio-producto.entity';
import { EntidadFinanciera } from '../src/catalogos/entities/entidad-financiera.entity';

describe('ScrapingController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  // Repositorios para verificaciones
  let productoRepo: any;
  let tasaVigenteRepo: any;
  let tasaHistoricaRepo: any;
  let montoRepo: any;
  let condicionRepo: any;
  let requisitoRepo: any;
  let beneficioRepo: any;
  let entidadRepo: any;

  const validApiKey = process.env.N8N_API_KEY || 'test-api-key-12345';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Habilitar ValidationPipe globalmente (igual que en main.ts)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    // Obtener DataSource para acceso directo a repositorios
    dataSource = moduleFixture.get<DataSource>(DataSource);
    productoRepo = dataSource.getRepository(ProductoCredito);
    tasaVigenteRepo = dataSource.getRepository(TasaVigente);
    tasaHistoricaRepo = dataSource.getRepository(TasaHistorica);
    montoRepo = dataSource.getRepository(MontoProducto);
    condicionRepo = dataSource.getRepository(CondicionProducto);
    requisitoRepo = dataSource.getRepository(RequisitoProducto);
    beneficioRepo = dataSource.getRepository(BeneficioProducto);
    entidadRepo = dataSource.getRepository(EntidadFinanciera);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // Limpiar datos de prueba después de cada test
    // Usamos query raw para evitar problemas con foreign keys
    await dataSource.query('DELETE FROM beneficios_productos WHERE 1=1');
    await dataSource.query('DELETE FROM requisitos_productos WHERE 1=1');
    await dataSource.query('DELETE FROM condiciones_productos WHERE 1=1');
    await dataSource.query('DELETE FROM montos_productos WHERE 1=1');
    await dataSource.query('DELETE FROM tasas_historicas WHERE 1=1');
    await dataSource.query('DELETE FROM tasas_vigentes WHERE 1=1');
    await dataSource.query('DELETE FROM productos_credito WHERE 1=1');
    // No eliminar entidades ni catálogos (son datos maestros)
  });

  describe('POST /api/scraping/ingest', () => {
    it('debe crear un producto completo con todos los parámetros y verificar todas las relaciones', async () => {
      // ==================== PAYLOAD COMPLETO ====================
      const payload = {
        // Campos obligatorios básicos
        id_unico: 'bancolombia__hipotecario__vis__pesos',
        banco: 'Bancolombia',
        tipo_credito: 'Crédito hipotecario para compra de vivienda',
        tipo_vivienda: 'VIS',
        denominacion: 'Pesos',
        descripcion: 'Crédito hipotecario VIS en pesos colombianos con tasa fija',
        fecha_extraccion: '2025-01-28',
        hora_extraccion: '10:30:00',
        url_pagina: 'https://www.bancolombia.com/personas/creditos/hipotecario',

        // Tasas
        tasa: '11.50% EA',
        tasa_minima: '10.50',
        tasa_maxima: '12.50',
        tipo_tasa: 'Tasa efectiva anual',

        // Montos y plazos
        monto_minimo: '$50.000.000',
        monto_maximo: '$200.000.000',
        plazo_maximo: '20 años',

        // Tipo de pago
        tipo_pago: 'Cuota fija',

        // Condiciones (separadas por punto y coma)
        condiciones:
          'Tener cuenta de nómina; Seguro de vida obligatorio; Edad máxima 70 años al finalizar el crédito',

        // Requisitos (separados por punto y coma)
        requisitos:
          'Documento de identidad; Certificado de ingresos; Extractos bancarios últimos 3 meses; Certificado de tradición del inmueble',

        // Beneficios
        descuento_nomina: '+200 pbs con cuenta de nómina',
        beneficio_avaluo: 'Avalúo sin costo',

        // URL del PDF (opcional)
        url_pdf:
          'https://www.bancolombia.com/wcm/connect/www.bancolombia.com/personas/creditos/hipotecario.pdf',
      };

      // ==================== HACER REQUEST ====================
      const response = await request(app.getHttpServer())
        .post('/api/scraping/ingest')
        .set('x-api-key', validApiKey)
        .send(payload)
        .expect(201);

      // ==================== VERIFICAR RESPONSE ====================
      expect(response.body).toMatchObject({
        success: true,
        message: 'Producto creado exitosamente',
        data: {
          success: true,
          accion: 'creado',
          cambio_tasa: false,
          tasa_nueva: 11.5,
        },
      });

      const productoId = response.body.data.producto_id;
      expect(productoId).toBeDefined();
      expect(typeof productoId).toBe('string');

      // ==================== VERIFICAR PRODUCTO EN DB ====================
      const producto = await productoRepo.findOne({
        where: { id: productoId },
        relations: ['entidad', 'tipo_credito', 'tipo_vivienda', 'denominacion'],
      });

      expect(producto).toBeDefined();
      expect(producto.id_unico_scraping).toBe('bancolombia__hipotecario__vis__pesos');
      expect(producto.descripcion).toBe(
        'Crédito hipotecario VIS en pesos colombianos con tasa fija',
      );
      expect(producto.url_extraccion).toBe(
        'https://www.bancolombia.com/personas/creditos/hipotecario',
      );
      expect(producto.url_pdf).toBe(
        'https://www.bancolombia.com/wcm/connect/www.bancolombia.com/personas/creditos/hipotecario.pdf',
      );
      expect(producto.activo).toBe(true);

      // Verificar relaciones catálogo
      expect(producto.entidad.nombre).toBe('Bancolombia');
      expect(producto.tipo_credito.codigo).toBe('hipotecario');
      expect(producto.tipo_vivienda.codigo).toBe('vis');
      expect(producto.denominacion.codigo).toBe('pesos');

      // ==================== VERIFICAR TASA VIGENTE ====================
      const tasaVigente = await tasaVigenteRepo.findOne({
        where: { producto_id: productoId },
      });

      expect(tasaVigente).toBeDefined();
      expect(Number(tasaVigente.tasa_valor)).toBe(11.5);
      expect(Number(tasaVigente.tasa_minima)).toBe(10.5);
      expect(Number(tasaVigente.tasa_maxima)).toBe(12.5);
      expect(tasaVigente.es_rango).toBe(true);
      expect(tasaVigente.tasa_texto_original).toBe('11.50% EA');

      // ==================== VERIFICAR TASA HISTÓRICA ====================
      const tasasHistoricas = await tasaHistoricaRepo.find({
        where: { producto_id: productoId },
      });

      expect(tasasHistoricas).toHaveLength(1);
      expect(Number(tasasHistoricas[0].tasa_valor)).toBe(11.5);
      // Verificar fecha (puede tener desfase de timezone)
      const fechaStr = new Date(tasasHistoricas[0].fecha_extraccion).toISOString().split('T')[0];
      expect(['2025-01-27', '2025-01-28']).toContain(fechaStr);
      expect(tasasHistoricas[0].hora_extraccion).toBe('10:30:00');

      // ==================== VERIFICAR MONTOS ====================
      const monto = await montoRepo.findOne({
        where: { producto_id: productoId },
      });

      expect(monto).toBeDefined();
      expect(Number(monto.monto_minimo)).toBe(50000000);
      expect(Number(monto.monto_maximo)).toBe(200000000);
      expect(Number(monto.plazo_maximo_meses)).toBe(240); // 20 años = 240 meses

      // ==================== VERIFICAR CONDICIONES ====================
      const condiciones = await condicionRepo.find({
        where: { producto_id: productoId },
        order: { orden: 'ASC' },
      });

      expect(condiciones).toHaveLength(3);
      expect(condiciones[0].condicion).toBe('Tener cuenta de nómina');
      expect(condiciones[0].orden).toBe(1);
      expect(condiciones[1].condicion).toBe('Seguro de vida obligatorio');
      expect(condiciones[1].orden).toBe(2);
      expect(condiciones[2].condicion).toBe('Edad máxima 70 años al finalizar el crédito');
      expect(condiciones[2].orden).toBe(3);

      // ==================== VERIFICAR REQUISITOS ====================
      const requisitos = await requisitoRepo.find({
        where: { producto_id: productoId },
        order: { orden: 'ASC' },
      });

      expect(requisitos).toHaveLength(4);
      expect(requisitos[0].requisito).toBe('Documento de identidad');
      expect(requisitos[0].es_obligatorio).toBe(true);
      expect(requisitos[0].orden).toBe(1);

      expect(requisitos[1].requisito).toBe('Certificado de ingresos');
      expect(requisitos[1].orden).toBe(2);

      expect(requisitos[2].requisito).toBe('Extractos bancarios últimos 3 meses');
      expect(requisitos[2].orden).toBe(3);

      expect(requisitos[3].requisito).toBe('Certificado de tradición del inmueble');
      expect(requisitos[3].orden).toBe(4);

      // ==================== VERIFICAR BENEFICIOS ====================
      const beneficios = await beneficioRepo.find({
        where: { producto_id: productoId },
      });

      expect(beneficios).toHaveLength(2);

      // Beneficio descuento nómina
      const beneficioNomina = beneficios.find((b) => b.tipo_beneficio === 'descuento_nomina');
      expect(beneficioNomina).toBeDefined();
      expect(beneficioNomina.descripcion).toBe('+200 pbs con cuenta de nómina');
      expect(beneficioNomina.valor).toBe('+200 pbs');
      expect(beneficioNomina.aplica_condicion).toBe('Con cuenta de nómina');

      // Beneficio avalúo
      const beneficioAvaluo = beneficios.find((b) => b.tipo_beneficio === 'avaluo');
      expect(beneficioAvaluo).toBeDefined();
      expect(beneficioAvaluo.descripcion).toBe('Avalúo sin costo');
      expect(beneficioAvaluo.valor).toBeNull();
      expect(beneficioAvaluo.aplica_condicion).toBeNull();
    });

    it('debe rechazar la petición sin API key (401)', async () => {
      const payload = {
        id_unico: 'test__hipotecario__vis__pesos',
        banco: 'Banco Test',
        tipo_credito: 'Crédito hipotecario para compra de vivienda',
        tipo_vivienda: 'VIS',
        denominacion: 'Pesos',
        descripcion: 'Test',
        fecha_extraccion: '2025-01-28',
        hora_extraccion: '10:30:00',
        url_pagina: 'https://test.com',
      };

      const response = await request(app.getHttpServer())
        .post('/api/scraping/ingest')
        // NO enviar header x-api-key
        .send(payload)
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'API key requerida. Incluye el header x-api-key',
      });
    });

    it('debe rechazar la petición con API key inválida (401)', async () => {
      const payload = {
        id_unico: 'test__hipotecario__vis__pesos',
        banco: 'Banco Test',
        tipo_credito: 'Crédito hipotecario para compra de vivienda',
        tipo_vivienda: 'VIS',
        denominacion: 'Pesos',
        descripcion: 'Test',
        fecha_extraccion: '2025-01-28',
        hora_extraccion: '10:30:00',
        url_pagina: 'https://test.com',
      };

      const response = await request(app.getHttpServer())
        .post('/api/scraping/ingest')
        .set('x-api-key', 'invalid-api-key-wrong')
        .send(payload)
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'API key inválida',
      });
    });

    it('debe actualizar un producto existente (201)', async () => {
      // Primer request: Crear producto
      const payloadInicial = {
        id_unico: 'bancolombia__hipotecario__no_vis__pesos',
        banco: 'Bancolombia',
        tipo_credito: 'Crédito hipotecario para compra de vivienda',
        tipo_vivienda: 'No VIS',
        denominacion: 'Pesos',
        descripcion: 'Descripción inicial',
        fecha_extraccion: '2025-01-28',
        hora_extraccion: '10:00:00',
        url_pagina: 'https://www.bancolombia.com/inicial',
        tasa: '12.00',
        tipo_tasa: 'Tasa efectiva anual',
      };

      const response1 = await request(app.getHttpServer())
        .post('/api/scraping/ingest')
        .set('x-api-key', validApiKey)
        .send(payloadInicial)
        .expect(201);

      expect(response1.body.data.accion).toBe('creado');
      const productoId = response1.body.data.producto_id;

      // Segundo request: Actualizar el mismo producto
      const payloadActualizado = {
        ...payloadInicial,
        descripcion: 'Descripción actualizada',
        url_pagina: 'https://www.bancolombia.com/actualizado',
        fecha_extraccion: '2025-01-28',
        hora_extraccion: '11:00:00',
        tasa: '12.00', // Misma tasa (sin cambio)
      };

      const response2 = await request(app.getHttpServer())
        .post('/api/scraping/ingest')
        .set('x-api-key', validApiKey)
        .send(payloadActualizado)
        .expect(201);

      expect(response2.body.data.accion).toBe('actualizado');
      expect(response2.body.data.producto_id).toBe(productoId);
      expect(response2.body.data.cambio_tasa).toBe(false);

      // Verificar que el producto se actualizó
      const producto = await productoRepo.findOne({
        where: { id: productoId },
      });

      expect(producto.descripcion).toBe('Descripción actualizada');
      expect(producto.url_extraccion).toBe('https://www.bancolombia.com/actualizado');
    });

    it('debe detectar cambio de tasa', async () => {
      // Crear producto con tasa inicial
      const payloadInicial = {
        id_unico: 'bancolombia__hipotecario__no_vis__uvr',
        banco: 'Bancolombia',
        tipo_credito: 'Crédito hipotecario para compra de vivienda',
        tipo_vivienda: 'No VIS',
        denominacion: 'UVR',
        descripcion: 'Test cambio de tasa',
        fecha_extraccion: '2025-01-28',
        hora_extraccion: '10:00:00',
        url_pagina: 'https://test.com',
        tasa: '10.00',
        tipo_tasa: 'Tasa efectiva anual',
      };

      const response1 = await request(app.getHttpServer())
        .post('/api/scraping/ingest')
        .set('x-api-key', validApiKey)
        .send(payloadInicial)
        .expect(201);

      const productoId = response1.body.data.producto_id;

      // Actualizar con nueva tasa (diferencia >= 0.01%)
      const payloadConCambio = {
        ...payloadInicial,
        tasa: '10.50', // Cambio de 0.50%
        fecha_extraccion: '2025-01-28',
        hora_extraccion: '11:00:00',
      };

      const response2 = await request(app.getHttpServer())
        .post('/api/scraping/ingest')
        .set('x-api-key', validApiKey)
        .send(payloadConCambio)
        .expect(201);

      expect(response2.body.data.cambio_tasa).toBe(true);
      expect(response2.body.data.tasa_anterior).toBe(10.0);
      expect(response2.body.data.tasa_nueva).toBe(10.5);

      // Verificar que hay 2 registros en histórico
      const tasasHistoricas = await tasaHistoricaRepo.find({
        where: { producto_id: productoId },
        order: { created_at: 'DESC' },
      });

      expect(tasasHistoricas).toHaveLength(2);
      expect(Number(tasasHistoricas[0].tasa_valor)).toBe(10.5); // Más reciente
      expect(Number(tasasHistoricas[1].tasa_valor)).toBe(10.0); // Anterior
    });

    it('debe rechazar payload con validación fallida (400)', async () => {
      const payloadInvalido = {
        id_unico: 'abc', // Muy corto (min 5 caracteres)
        banco: '', // Vacío (obligatorio)
        tipo_credito: 'Crédito hipotecario para compra de vivienda',
        tipo_vivienda: 'VIS',
        denominacion: 'Pesos',
        descripcion: 'Test',
        fecha_extraccion: '2025-13-45', // Fecha inválida
        hora_extraccion: '25:99:99', // Hora inválida
        url_pagina: 'not-a-url', // URL inválida
      };

      const response = await request(app.getHttpServer())
        .post('/api/scraping/ingest')
        .set('x-api-key', validApiKey)
        .send(payloadInvalido)
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message.length).toBeGreaterThan(0);
    });

    it('debe crear producto con campos opcionales vacíos', async () => {
      const payloadMinimo = {
        id_unico: 'banco_test__consumo__aplica_ambos__pesos',
        banco: 'Banco Test',
        tipo_credito: 'Crédito de consumo',
        tipo_vivienda: 'Aplica para ambos',
        denominacion: 'Pesos',
        descripcion: 'Producto sin campos opcionales',
        fecha_extraccion: '2025-01-28',
        hora_extraccion: '10:30:00',
        url_pagina: 'https://test.com',
        // Sin tasas, montos, condiciones, requisitos, beneficios
      };

      const response = await request(app.getHttpServer())
        .post('/api/scraping/ingest')
        .set('x-api-key', validApiKey)
        .send(payloadMinimo)
        .expect(201);

      const productoId = response.body.data.producto_id;

      // Verificar que el producto se creó
      const producto = await productoRepo.findOne({
        where: { id: productoId },
      });

      expect(producto).toBeDefined();

      // Verificar que NO hay tasa vigente (tasa_valor es null)
      const tasaVigente = await tasaVigenteRepo.findOne({
        where: { producto_id: productoId },
      });

      expect(tasaVigente).toBeDefined();
      expect(tasaVigente.tasa_valor).toBeNull();

      // Verificar que NO hay montos
      const monto = await montoRepo.findOne({
        where: { producto_id: productoId },
      });

      expect(monto).toBeNull();

      // Verificar que NO hay condiciones, requisitos, beneficios
      const condiciones = await condicionRepo.find({
        where: { producto_id: productoId },
      });
      const requisitos = await requisitoRepo.find({
        where: { producto_id: productoId },
      });
      const beneficios = await beneficioRepo.find({
        where: { producto_id: productoId },
      });

      expect(condiciones).toHaveLength(0);
      expect(requisitos).toHaveLength(0);
      expect(beneficios).toHaveLength(0);
    });
  });
});
