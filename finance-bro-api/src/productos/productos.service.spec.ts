import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductoCredito } from './entities/producto-credito.entity';
import { TasaVigente } from './entities/tasa-vigente.entity';
import { TasaHistorica } from './entities/tasa-historica.entity';
import { MontoProducto } from './entities/monto-producto.entity';
import { CondicionProducto } from './entities/condicion-producto.entity';
import { RequisitoProducto } from './entities/requisito-producto.entity';
import { BeneficioProducto } from './entities/beneficio-producto.entity';
import { EjecucionScraping } from './entities/ejecucion-scraping.entity';

describe('ProductosService', () => {
  let service: ProductosService;
  let productoCreditoRepo: jest.Mocked<Repository<ProductoCredito>>;
  let tasaVigenteRepo: jest.Mocked<Repository<TasaVigente>>;
  let tasaHistoricaRepo: jest.Mocked<Repository<TasaHistorica>>;
  let montoProductoRepo: jest.Mocked<Repository<MontoProducto>>;
  let condicionProductoRepo: jest.Mocked<Repository<CondicionProducto>>;
  let requisitoProductoRepo: jest.Mocked<Repository<RequisitoProducto>>;
  let beneficioProductoRepo: jest.Mocked<Repository<BeneficioProducto>>;
  let ejecucionScrapingRepo: jest.Mocked<Repository<EjecucionScraping>>;

  const mockRepository = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(ProductoCredito),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(TasaVigente),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(TasaHistorica),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(MontoProducto),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(CondicionProducto),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(RequisitoProducto),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(BeneficioProducto),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(EjecucionScraping),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    productoCreditoRepo = module.get(getRepositoryToken(ProductoCredito));
    tasaVigenteRepo = module.get(getRepositoryToken(TasaVigente));
    tasaHistoricaRepo = module.get(getRepositoryToken(TasaHistorica));
    montoProductoRepo = module.get(getRepositoryToken(MontoProducto));
    condicionProductoRepo = module.get(getRepositoryToken(CondicionProducto));
    requisitoProductoRepo = module.get(getRepositoryToken(RequisitoProducto));
    beneficioProductoRepo = module.get(getRepositoryToken(BeneficioProducto));
    ejecucionScrapingRepo = module.get(getRepositoryToken(EjecucionScraping));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByIdUnico', () => {
    it('should return a product when found', async () => {
      const mockProducto = {
        id: '123',
        id_unico_scraping: 'bancolombia-hipotecario-vis',
        activo: true,
      } as ProductoCredito;

      jest.spyOn(productoCreditoRepo, 'findOne').mockResolvedValue(mockProducto);

      const result = await service.findByIdUnico('bancolombia-hipotecario-vis');

      expect(result).toEqual(mockProducto);
      expect(productoCreditoRepo.findOne).toHaveBeenCalledWith({
        where: { id_unico_scraping: 'bancolombia-hipotecario-vis', activo: true },
      });
    });

    it('should return null when product not found', async () => {
      jest.spyOn(productoCreditoRepo, 'findOne').mockResolvedValue(null);

      const result = await service.findByIdUnico('inexistente');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new product', async () => {
      const inputData: Partial<ProductoCredito> = {
        id_unico_scraping: 'bancolombia-hipotecario-vis',
        entidad_id: 'entidad-123',
        tipo_credito_id: 'tipo-123',
      };

      const mockCreatedProducto = {
        id: '456',
        ...inputData,
        activo: true,
      } as ProductoCredito;

      jest.spyOn(productoCreditoRepo, 'create').mockReturnValue(mockCreatedProducto);
      jest.spyOn(productoCreditoRepo, 'save').mockResolvedValue(mockCreatedProducto);

      const result = await service.create(inputData);

      expect(result).toEqual(mockCreatedProducto);
      expect(productoCreditoRepo.create).toHaveBeenCalledWith(inputData);
      expect(productoCreditoRepo.save).toHaveBeenCalledWith(mockCreatedProducto);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const mockProducto = {
        id: '123',
        id_unico_scraping: 'bancolombia-hipotecario-vis',
        descripcion: 'Descripción antigua',
      } as ProductoCredito;

      const updateData: Partial<ProductoCredito> = {
        descripcion: 'Descripción actualizada',
      };

      jest.spyOn(productoCreditoRepo, 'findOne').mockResolvedValue(mockProducto);
      jest.spyOn(productoCreditoRepo, 'save').mockResolvedValue({
        ...mockProducto,
        ...updateData,
      });

      const result = await service.update('123', updateData);

      expect(result.descripcion).toBe('Descripción actualizada');
      expect(productoCreditoRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product not found', async () => {
      jest.spyOn(productoCreditoRepo, 'findOne').mockResolvedValue(null);

      await expect(service.update('inexistente', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a product with relations', async () => {
      const mockProducto = {
        id: '123',
        id_unico_scraping: 'bancolombia-hipotecario-vis',
        activo: true,
        entidad: {},
        tipo_credito: {},
      } as ProductoCredito;

      jest.spyOn(productoCreditoRepo, 'findOne').mockResolvedValue(mockProducto);

      const result = await service.findById('123');

      expect(result).toEqual(mockProducto);
      expect(productoCreditoRepo.findOne).toHaveBeenCalledWith({
        where: { id: '123', activo: true },
        relations: ['entidad', 'tipo_credito', 'tipo_vivienda', 'denominacion', 'tipo_tasa', 'tipo_pago'],
      });
    });
  });

  describe('getTasaVigente', () => {
    it('should return tasa vigente when found', async () => {
      const mockTasa = {
        producto_id: 'producto-123',
        tasa_valor: 12.5,
      } as TasaVigente;

      jest.spyOn(tasaVigenteRepo, 'findOne').mockResolvedValue(mockTasa);

      const result = await service.getTasaVigente('producto-123');

      expect(result).toEqual(mockTasa);
    });
  });

  describe('createTasaVigente', () => {
    it('should create a new tasa vigente', async () => {
      const inputData: Partial<TasaVigente> = {
        producto_id: 'producto-123',
        tasa_valor: 12.5,
      };

      const mockTasa = {
        id: '789',
        ...inputData,
      } as TasaVigente;

      jest.spyOn(tasaVigenteRepo, 'create').mockReturnValue(mockTasa);
      jest.spyOn(tasaVigenteRepo, 'save').mockResolvedValue(mockTasa);

      const result = await service.createTasaVigente(inputData);

      expect(result).toEqual(mockTasa);
    });
  });

  describe('updateTasaVigente', () => {
    it('should update existing tasa vigente', async () => {
      const existingTasa = {
        producto_id: 'producto-123',
        tasa_valor: 12.5,
      } as TasaVigente;

      const updateData: Partial<TasaVigente> = {
        tasa_valor: 13.0,
      };

      jest.spyOn(service, 'getTasaVigente').mockResolvedValue(existingTasa);
      jest.spyOn(tasaVigenteRepo, 'save').mockResolvedValue({
        ...existingTasa,
        ...updateData,
      });

      const result = await service.updateTasaVigente('producto-123', updateData);

      expect(result.tasa_valor).toBe(13.0);
    });

    it('should create tasa vigente if not exists', async () => {
      const createData: Partial<TasaVigente> = {
        tasa_valor: 12.5,
      };

      jest.spyOn(service, 'getTasaVigente').mockResolvedValue(null);
      jest.spyOn(service, 'createTasaVigente').mockResolvedValue({
        producto_id: 'producto-123',
        tasa_valor: 12.5,
      } as TasaVigente);

      const result = await service.updateTasaVigente('producto-123', createData);

      expect(result.producto_id).toBe('producto-123');
      expect(service.createTasaVigente).toHaveBeenCalled();
    });
  });

  describe('insertTasaHistorica', () => {
    it('should insert historico de tasa', async () => {
      const inputData: Partial<TasaHistorica> = {
        producto_id: 'producto-123',
        tasa_valor: 12.5,
      };

      const mockHistorico = {
        id: '999',
        ...inputData,
      } as TasaHistorica;

      jest.spyOn(tasaHistoricaRepo, 'create').mockReturnValue(mockHistorico);
      jest.spyOn(tasaHistoricaRepo, 'save').mockResolvedValue(mockHistorico);

      const result = await service.insertTasaHistorica(inputData);

      expect(result).toEqual(mockHistorico);
    });
  });

  describe('getHistoricoTasas', () => {
    it('should return historico de tasas with limit', async () => {
      const mockHistorico = [
        { producto_id: 'producto-123', tasa_valor: 12.5 },
        { producto_id: 'producto-123', tasa_valor: 12.3 },
      ] as TasaHistorica[];

      jest.spyOn(tasaHistoricaRepo, 'find').mockResolvedValue(mockHistorico);

      const result = await service.getHistoricoTasas('producto-123', 5);

      expect(result).toEqual(mockHistorico);
      expect(tasaHistoricaRepo.find).toHaveBeenCalledWith({
        where: { producto_id: 'producto-123' },
        order: { fecha_extraccion: 'DESC', hora_extraccion: 'DESC' },
        take: 5,
      });
    });
  });

  describe('upsertMontos', () => {
    it('should create montos if not exists', async () => {
      const inputData: Partial<MontoProducto> = {
        monto_minimo: 10000000,
        monto_maximo: 500000000,
      };

      const mockMonto = {
        id: '111',
        producto_id: 'producto-123',
        ...inputData,
      } as MontoProducto;

      jest.spyOn(montoProductoRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(montoProductoRepo, 'create').mockReturnValue(mockMonto);
      jest.spyOn(montoProductoRepo, 'save').mockResolvedValue(mockMonto);

      const result = await service.upsertMontos('producto-123', inputData);

      expect(result).toEqual(mockMonto);
    });

    it('should update montos if exists', async () => {
      const existingMonto = {
        id: '111',
        producto_id: 'producto-123',
        monto_minimo: 10000000,
      } as MontoProducto;

      const updateData: Partial<MontoProducto> = {
        monto_minimo: 15000000,
      };

      jest.spyOn(montoProductoRepo, 'findOne').mockResolvedValue(existingMonto);
      jest.spyOn(montoProductoRepo, 'save').mockResolvedValue({
        ...existingMonto,
        ...updateData,
      });

      const result = await service.upsertMontos('producto-123', updateData);

      expect(result.monto_minimo).toBe(15000000);
    });
  });

  describe('replaceCondiciones', () => {
    it('should replace all condiciones', async () => {
      const condiciones = [
        { condicion: 'Condición 1', orden: 1 },
        { condicion: 'Condición 2', orden: 2 },
      ];

      const mockCondiciones = condiciones.map((c, i) => ({
        id: `cond-${i}`,
        producto_id: 'producto-123',
        ...c,
      })) as CondicionProducto[];

      jest.spyOn(condicionProductoRepo, 'delete').mockResolvedValue({ affected: 2 } as any);
      jest.spyOn(condicionProductoRepo, 'create').mockImplementation((data) => data as CondicionProducto);
      jest.spyOn(condicionProductoRepo, 'save').mockResolvedValue(mockCondiciones);

      const result = await service.replaceCondiciones('producto-123', condiciones);

      expect(condicionProductoRepo.delete).toHaveBeenCalledWith({ producto_id: 'producto-123' });
      expect(result).toEqual(mockCondiciones);
    });
  });

  describe('replaceRequisitos', () => {
    it('should replace all requisitos', async () => {
      const requisitos = [
        { requisito: 'Requisito 1', tipo_requisito: 'documento', es_obligatorio: true, orden: 1 },
      ];

      const mockRequisitos = requisitos.map((r, i) => ({
        id: `req-${i}`,
        producto_id: 'producto-123',
        ...r,
      })) as RequisitoProducto[];

      jest.spyOn(requisitoProductoRepo, 'delete').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(requisitoProductoRepo, 'create').mockImplementation((data) => data as RequisitoProducto);
      jest.spyOn(requisitoProductoRepo, 'save').mockResolvedValue(mockRequisitos);

      const result = await service.replaceRequisitos('producto-123', requisitos);

      expect(requisitoProductoRepo.delete).toHaveBeenCalledWith({ producto_id: 'producto-123' });
      expect(result).toEqual(mockRequisitos);
    });
  });

  describe('replaceBeneficios', () => {
    it('should replace all beneficios', async () => {
      const beneficios = [
        { tipo_beneficio: 'descuento_nomina', descripcion: 'Descuento', valor: '200pbs', aplica_condicion: null },
      ];

      const mockBeneficios = beneficios.map((b, i) => ({
        id: `ben-${i}`,
        producto_id: 'producto-123',
        ...b,
      })) as BeneficioProducto[];

      jest.spyOn(beneficioProductoRepo, 'delete').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(beneficioProductoRepo, 'create').mockImplementation((data) => data as BeneficioProducto);
      jest.spyOn(beneficioProductoRepo, 'save').mockResolvedValue(mockBeneficios);

      const result = await service.replaceBeneficios('producto-123', beneficios);

      expect(beneficioProductoRepo.delete).toHaveBeenCalledWith({ producto_id: 'producto-123' });
      expect(result).toEqual(mockBeneficios);
    });
  });

  describe('registrarEjecucion', () => {
    it('should register scraping execution', async () => {
      const inputData: Partial<EjecucionScraping> = {
        entidad_id: 'entidad-123',
        fecha_inicio: new Date(),
        estado: 'completado',
      };

      const mockEjecucion = {
        id: 'ejec-123',
        ...inputData,
      } as EjecucionScraping;

      jest.spyOn(ejecucionScrapingRepo, 'create').mockReturnValue(mockEjecucion);
      jest.spyOn(ejecucionScrapingRepo, 'save').mockResolvedValue(mockEjecucion);

      const result = await service.registrarEjecucion(inputData);

      expect(result).toEqual(mockEjecucion);
    });
  });

  describe('actualizarEjecucion', () => {
    it('should update scraping execution', async () => {
      const existingEjecucion = {
        id: 'ejec-123',
        estado: 'en_progreso',
      } as EjecucionScraping;

      const updateData: Partial<EjecucionScraping> = {
        estado: 'completado',
        fecha_fin: new Date(),
      };

      jest.spyOn(ejecucionScrapingRepo, 'findOne').mockResolvedValue(existingEjecucion);
      jest.spyOn(ejecucionScrapingRepo, 'save').mockResolvedValue({
        ...existingEjecucion,
        ...updateData,
      });

      const result = await service.actualizarEjecucion('ejec-123', updateData);

      expect(result.estado).toBe('completado');
    });

    it('should throw NotFoundException when execution not found', async () => {
      jest.spyOn(ejecucionScrapingRepo, 'findOne').mockResolvedValue(null);

      await expect(service.actualizarEjecucion('inexistente', {})).rejects.toThrow(NotFoundException);
    });
  });
});
