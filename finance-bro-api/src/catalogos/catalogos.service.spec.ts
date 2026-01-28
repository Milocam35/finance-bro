import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogosService } from './catalogos.service';
import { EntidadFinanciera } from './entities/entidad-financiera.entity';
import { TipoCredito } from './entities/tipo-credito.entity';
import { TipoVivienda } from './entities/tipo-vivienda.entity';
import { Denominacion } from './entities/denominacion.entity';
import { TipoTasa } from './entities/tipo-tasa.entity';
import { TipoPago } from './entities/tipo-pago.entity';

describe('CatalogosService', () => {
  let service: CatalogosService;
  let entidadFinancieraRepo: jest.Mocked<Repository<EntidadFinanciera>>;
  let tipoCreditoRepo: jest.Mocked<Repository<TipoCredito>>;
  let tipoViviendaRepo: jest.Mocked<Repository<TipoVivienda>>;
  let denominacionRepo: jest.Mocked<Repository<Denominacion>>;
  let tipoTasaRepo: jest.Mocked<Repository<TipoTasa>>;
  let tipoPagoRepo: jest.Mocked<Repository<TipoPago>>;

  // Mock repositories
  const mockRepository = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogosService,
        {
          provide: getRepositoryToken(EntidadFinanciera),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(TipoCredito),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(TipoVivienda),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(Denominacion),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(TipoTasa),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(TipoPago),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CatalogosService>(CatalogosService);
    entidadFinancieraRepo = module.get(
      getRepositoryToken(EntidadFinanciera),
    );
    tipoCreditoRepo = module.get(
      getRepositoryToken(TipoCredito),
    );
    tipoViviendaRepo = module.get(
      getRepositoryToken(TipoVivienda),
    );
    denominacionRepo = module.get(
      getRepositoryToken(Denominacion),
    );
    tipoTasaRepo = module.get(
      getRepositoryToken(TipoTasa),
    );
    tipoPagoRepo = module.get(
      getRepositoryToken(TipoPago),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findEntidadByNombre', () => {
    it('should return an entidad financiera when found', async () => {
      const mockEntidad = {
        id: '123',
        nombre: 'Bancolombia',
        nombre_normalizado: 'bancolombia',
        activo: true,
        created_at: new Date(),
      } as EntidadFinanciera;

      jest.spyOn(entidadFinancieraRepo, 'findOne').mockResolvedValue(mockEntidad);

      const result = await service.findEntidadByNombre('bancolombia');

      expect(result).toEqual(mockEntidad);
      expect(entidadFinancieraRepo.findOne).toHaveBeenCalledWith({
        where: { nombre_normalizado: 'bancolombia', activo: true },
      });
    });

    it('should return null when entidad not found', async () => {
      jest.spyOn(entidadFinancieraRepo, 'findOne').mockResolvedValue(null);

      const result = await service.findEntidadByNombre('banco-inexistente');

      expect(result).toBeNull();
    });
  });

  describe('createEntidad', () => {
    it('should create and save a new entidad financiera', async () => {
      const inputData = {
        nombre: 'Banco de Bogotá',
        nombre_normalizado: 'banco-de-bogota',
      };

      const mockCreatedEntidad = {
        id: '456',
        nombre: inputData.nombre,
        nombre_normalizado: inputData.nombre_normalizado,
        activo: true,
        created_at: new Date(),
      } as EntidadFinanciera;

      jest.spyOn(entidadFinancieraRepo, 'create').mockReturnValue(mockCreatedEntidad);
      jest.spyOn(entidadFinancieraRepo, 'save').mockResolvedValue(mockCreatedEntidad);

      const result = await service.createEntidad(inputData);

      expect(result).toEqual(mockCreatedEntidad);
      expect(entidadFinancieraRepo.create).toHaveBeenCalledWith({
        nombre: inputData.nombre,
        nombre_normalizado: inputData.nombre_normalizado,
        activo: true,
      });
      expect(entidadFinancieraRepo.save).toHaveBeenCalledWith(mockCreatedEntidad);
    });
  });

  describe('findTipoCreditoByCodigo', () => {
    it('should return tipo credito when found', async () => {
      const mockTipo = {
        id: '1',
        codigo: 'hipotecario',
        nombre: 'Crédito Hipotecario',
        activo: true,
      } as TipoCredito;

      jest.spyOn(tipoCreditoRepo, 'findOne').mockResolvedValue(mockTipo);

      const result = await service.findTipoCreditoByCodigo('hipotecario');

      expect(result).toEqual(mockTipo);
      expect(tipoCreditoRepo.findOne).toHaveBeenCalledWith({
        where: { codigo: 'hipotecario', activo: true },
      });
    });

    it('should return null when tipo credito not found', async () => {
      jest.spyOn(tipoCreditoRepo, 'findOne').mockResolvedValue(null);

      const result = await service.findTipoCreditoByCodigo('inexistente');

      expect(result).toBeNull();
    });
  });

  describe('findTipoViviendaByCodigo', () => {
    it('should return tipo vivienda when found', async () => {
      const mockTipo = {
        id: '1',
        codigo: 'vis',
        nombre: 'Vivienda de Interés Social',
        valor_maximo_smmlv: 135,
        activo: true,
      } as TipoVivienda;

      jest.spyOn(tipoViviendaRepo, 'findOne').mockResolvedValue(mockTipo);

      const result = await service.findTipoViviendaByCodigo('vis');

      expect(result).toEqual(mockTipo);
    });
  });

  describe('findDenominacionByCodigo', () => {
    it('should return denominacion when found', async () => {
      const mockDenominacion = {
        id: '1',
        codigo: 'pesos',
        nombre: 'Pesos Colombianos',
        activo: true,
      } as Denominacion;

      jest.spyOn(denominacionRepo, 'findOne').mockResolvedValue(mockDenominacion);

      const result = await service.findDenominacionByCodigo('pesos');

      expect(result).toEqual(mockDenominacion);
    });
  });

  describe('findTipoTasaByCodigo', () => {
    it('should return tipo tasa when found', async () => {
      const mockTipo = {
        id: '1',
        codigo: 'efectiva_anual',
        nombre: 'Efectiva Anual',
        activo: true,
      } as TipoTasa;

      jest.spyOn(tipoTasaRepo, 'findOne').mockResolvedValue(mockTipo);

      const result = await service.findTipoTasaByCodigo('efectiva_anual');

      expect(result).toEqual(mockTipo);
    });
  });

  describe('findTipoPagoByCodigo', () => {
    it('should return tipo pago when found', async () => {
      const mockTipo = {
        id: '1',
        codigo: 'cuota_fija',
        nombre: 'Cuota Fija',
        activo: true,
      } as TipoPago;

      jest.spyOn(tipoPagoRepo, 'findOne').mockResolvedValue(mockTipo);

      const result = await service.findTipoPagoByCodigo('cuota_fija');

      expect(result).toEqual(mockTipo);
    });
  });

  describe('getOrCreateEntidad', () => {
    it('should return existing entidad if found', async () => {
      const mockEntidad = {
        id: '123',
        nombre: 'Bancolombia',
        nombre_normalizado: 'bancolombia',
        activo: true,
        created_at: new Date(),
      } as EntidadFinanciera;

      jest.spyOn(service, 'findEntidadByNombre').mockResolvedValue(mockEntidad);
      jest.spyOn(service, 'createEntidad');

      const result = await service.getOrCreateEntidad('bancolombia', 'Bancolombia');

      expect(result).toEqual(mockEntidad);
      expect(service.findEntidadByNombre).toHaveBeenCalledWith('bancolombia');
      expect(service.createEntidad).not.toHaveBeenCalled();
    });

    it('should create new entidad if not found', async () => {
      const mockNewEntidad = {
        id: '999',
        nombre: 'Banco Nuevo',
        nombre_normalizado: 'banco-nuevo',
        activo: true,
        created_at: new Date(),
      } as EntidadFinanciera;

      jest.spyOn(service, 'findEntidadByNombre').mockResolvedValue(null);
      jest.spyOn(service, 'createEntidad').mockResolvedValue(mockNewEntidad);

      const result = await service.getOrCreateEntidad('banco-nuevo', 'Banco Nuevo');

      expect(result).toEqual(mockNewEntidad);
      expect(service.findEntidadByNombre).toHaveBeenCalledWith('banco-nuevo');
      expect(service.createEntidad).toHaveBeenCalledWith({
        nombre: 'Banco Nuevo',
        nombre_normalizado: 'banco-nuevo',
      });
    });
  });
});
