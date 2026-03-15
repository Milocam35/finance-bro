import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntidadFinanciera } from './entities/entidad-financiera.entity';
import { TipoCredito } from './entities/tipo-credito.entity';
import { TipoVivienda } from './entities/tipo-vivienda.entity';
import { Denominacion } from './entities/denominacion.entity';
import { TipoTasa } from './entities/tipo-tasa.entity';
import { TipoPago } from './entities/tipo-pago.entity';
import {
  CreateEntidadFinancieraDto,
  UpdateEntidadFinancieraDto,
} from './dto';

@Injectable()
export class CatalogosService {
  private readonly logger = new Logger(CatalogosService.name);

  constructor(
    @InjectRepository(EntidadFinanciera)
    private readonly entidadFinancieraRepo: Repository<EntidadFinanciera>,
    @InjectRepository(TipoCredito)
    private readonly tipoCreditoRepo: Repository<TipoCredito>,
    @InjectRepository(TipoVivienda)
    private readonly tipoViviendaRepo: Repository<TipoVivienda>,
    @InjectRepository(Denominacion)
    private readonly denominacionRepo: Repository<Denominacion>,
    @InjectRepository(TipoTasa)
    private readonly tipoTasaRepo: Repository<TipoTasa>,
    @InjectRepository(TipoPago)
    private readonly tipoPagoRepo: Repository<TipoPago>,
  ) {}

  /**
   * Busca una entidad financiera por su nombre normalizado
   * @param nombreNormalizado - Nombre normalizado del banco (ej: 'bancolombia', 'banco-de-bogota')
   * @returns EntidadFinanciera o null si no existe
   */
  async findEntidadByNombre(
    nombreNormalizado: string,
  ): Promise<EntidadFinanciera | null> {
    const entidad = await this.entidadFinancieraRepo.findOne({
      where: { nombre_normalizado: nombreNormalizado, activo: true },
    });

    if (!entidad) {
      this.logger.debug(
        `Entidad financiera no encontrada: ${nombreNormalizado}`,
      );
    }

    return entidad;
  }

  /**
   * Crea una nueva entidad financiera
   * @param data - Datos de la entidad financiera
   * @returns EntidadFinanciera creada
   */
  async createEntidad(data: {
    nombre: string;
    nombre_normalizado: string;
  }): Promise<EntidadFinanciera> {
    const nuevaEntidad = this.entidadFinancieraRepo.create({
      nombre: data.nombre,
      nombre_normalizado: data.nombre_normalizado,
      activo: true,
    });

    const entidadGuardada = await this.entidadFinancieraRepo.save(nuevaEntidad);

    this.logger.log(
      `Nueva entidad financiera creada: ${entidadGuardada.nombre} (ID: ${entidadGuardada.id})`,
    );

    return entidadGuardada;
  }

  /**
   * Busca un tipo de crédito por su código
   * @param codigo - Código del tipo de crédito (ej: 'hipotecario', 'consumo', 'vehiculo')
   * @returns TipoCredito o null si no existe
   */
  async findTipoCreditoByCodigo(codigo: string): Promise<TipoCredito | null> {
    const tipo = await this.tipoCreditoRepo.findOne({
      where: { codigo, activo: true },
    });

    if (!tipo) {
      this.logger.warn(`Tipo de crédito no encontrado: ${codigo}`);
    }

    return tipo;
  }

  /**
   * Busca un tipo de vivienda por su código
   * @param codigo - Código del tipo de vivienda (ej: 'vis', 'no_vis', 'vip', 'aplica_ambos')
   * @returns TipoVivienda o null si no existe
   */
  async findTipoViviendaByCodigo(
    codigo: string,
  ): Promise<TipoVivienda | null> {
    const tipo = await this.tipoViviendaRepo.findOne({
      where: { codigo, activo: true },
    });

    if (!tipo) {
      this.logger.warn(`Tipo de vivienda no encontrado: ${codigo}`);
    }

    return tipo;
  }

  /**
   * Busca una denominación por su código
   * @param codigo - Código de la denominación (ej: 'pesos', 'uvr')
   * @returns Denominacion o null si no existe
   */
  async findDenominacionByCodigo(codigo: string): Promise<Denominacion | null> {
    const denominacion = await this.denominacionRepo.findOne({
      where: { codigo, activo: true },
    });

    if (!denominacion) {
      this.logger.warn(`Denominación no encontrada: ${codigo}`);
    }

    return denominacion;
  }

  /**
   * Busca un tipo de tasa por su código
   * @param codigo - Código del tipo de tasa (ej: 'efectiva_anual', 'nominal_mensual')
   * @returns TipoTasa o null si no existe
   */
  async findTipoTasaByCodigo(codigo: string): Promise<TipoTasa | null> {
    const tipo = await this.tipoTasaRepo.findOne({
      where: { codigo, activo: true },
    });

    if (!tipo) {
      this.logger.warn(`Tipo de tasa no encontrado: ${codigo}`);
    }

    return tipo;
  }

  /**
   * Busca un tipo de pago por su código
   * @param codigo - Código del tipo de pago (ej: 'cuota_fija', 'cuota_variable')
   * @returns TipoPago o null si no existe
   */
  async findTipoPagoByCodigo(codigo: string): Promise<TipoPago | null> {
    const tipo = await this.tipoPagoRepo.findOne({
      where: { codigo, activo: true },
    });

    if (!tipo) {
      this.logger.debug(`Tipo de pago no encontrado: ${codigo}`);
    }

    return tipo;
  }

  /**
   * Obtiene o crea una entidad financiera (upsert pattern)
   * @param nombreNormalizado - Nombre normalizado del banco
   * @param nombre - Nombre completo del banco
   * @returns EntidadFinanciera (existente o nueva)
   */
  async getOrCreateEntidad(
    nombreNormalizado: string,
    nombre: string,
  ): Promise<EntidadFinanciera> {
    let entidad = await this.findEntidadByNombre(nombreNormalizado);

    if (!entidad) {
      entidad = await this.createEntidad({
        nombre,
        nombre_normalizado: nombreNormalizado,
      });
    }

    return entidad;
  }

  // ============================================
  // CRUD METHODS FOR ENTIDADES FINANCIERAS
  // ============================================

  /**
   * Obtiene todas las entidades financieras
   * @param includeInactive - Si true, incluye entidades inactivas
   * @returns Array de EntidadFinanciera
   */
  async findAllEntidades(
    includeInactive = false,
  ): Promise<EntidadFinanciera[]> {
    const where = includeInactive ? {} : { activo: true };

    const entidades = await this.entidadFinancieraRepo.find({
      where,
      order: { nombre: 'ASC' },
    });

    this.logger.debug(
      `Encontradas ${entidades.length} entidades financieras`,
    );

    return entidades;
  }

  /**
   * Busca una entidad financiera por ID o nombre normalizado
   * @param identifier - UUID o nombre normalizado
   * @returns EntidadFinanciera
   * @throws NotFoundException si no existe
   */
  async findOneEntidad(identifier: string): Promise<EntidadFinanciera> {
    // Intentar buscar por UUID primero
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier,
      );

    let entidad: EntidadFinanciera | null = null;

    if (isUUID) {
      entidad = await this.entidadFinancieraRepo.findOne({
        where: { id: identifier },
      });
    } else {
      // Buscar por nombre normalizado
      entidad = await this.entidadFinancieraRepo.findOne({
        where: { nombre_normalizado: identifier },
      });
    }

    if (!entidad) {
      throw new NotFoundException(
        `Entidad financiera con identificador "${identifier}" no encontrada`,
      );
    }

    return entidad;
  }

  /**
   * Crea una nueva entidad financiera con validación de duplicados
   * @param createDto - Datos de la entidad financiera
   * @returns EntidadFinanciera creada
   * @throws ConflictException si el nombre normalizado ya existe
   */
  async createEntidadFinanciera(
    createDto: CreateEntidadFinancieraDto,
  ): Promise<EntidadFinanciera> {
    // Verificar si ya existe una entidad con ese nombre normalizado
    const existente = await this.entidadFinancieraRepo.findOne({
      where: { nombre_normalizado: createDto.nombre_normalizado },
    });

    if (existente) {
      throw new ConflictException(
        `Ya existe una entidad financiera con el nombre normalizado "${createDto.nombre_normalizado}"`,
      );
    }

    const nuevaEntidad = this.entidadFinancieraRepo.create({
      ...createDto,
      activo: true,
    });

    const entidadGuardada =
      await this.entidadFinancieraRepo.save(nuevaEntidad);

    this.logger.log(
      `Entidad financiera creada: ${entidadGuardada.nombre} (ID: ${entidadGuardada.id})`,
    );

    return entidadGuardada;
  }

  /**
   * Actualiza una entidad financiera existente
   * @param identifier - UUID o nombre normalizado
   * @param updateDto - Datos a actualizar
   * @returns EntidadFinanciera actualizada
   * @throws NotFoundException si no existe
   * @throws ConflictException si el nuevo nombre normalizado ya existe
   */
  async updateEntidadFinanciera(
    identifier: string,
    updateDto: UpdateEntidadFinancieraDto,
  ): Promise<EntidadFinanciera> {
    const entidad = await this.findOneEntidad(identifier);

    // Si se está actualizando el nombre normalizado, verificar duplicados
    if (
      updateDto.nombre_normalizado &&
      updateDto.nombre_normalizado !== entidad.nombre_normalizado
    ) {
      const existente = await this.entidadFinancieraRepo.findOne({
        where: { nombre_normalizado: updateDto.nombre_normalizado },
      });

      if (existente && existente.id !== entidad.id) {
        throw new ConflictException(
          `Ya existe una entidad financiera con el nombre normalizado "${updateDto.nombre_normalizado}"`,
        );
      }
    }

    // Actualizar campos
    Object.assign(entidad, updateDto);

    const entidadActualizada =
      await this.entidadFinancieraRepo.save(entidad);

    this.logger.log(
      `Entidad financiera actualizada: ${entidadActualizada.nombre} (ID: ${entidadActualizada.id})`,
    );

    return entidadActualizada;
  }

  /**
   * Elimina (soft delete) una entidad financiera
   * @param identifier - UUID o nombre normalizado
   * @returns EntidadFinanciera eliminada
   * @throws NotFoundException si no existe
   * @throws BadRequestException si la entidad tiene productos asociados
   */
  async deleteEntidadFinanciera(identifier: string): Promise<EntidadFinanciera> {
    const entidad = await this.findOneEntidad(identifier);

    // TODO: Verificar si tiene productos asociados antes de eliminar
    // Esto requeriría inyectar ProductosService o hacer una query directa

    entidad.activo = false;
    const entidadEliminada = await this.entidadFinancieraRepo.save(entidad);

    this.logger.log(
      `Entidad financiera desactivada: ${entidadEliminada.nombre} (ID: ${entidadEliminada.id})`,
    );

    return entidadEliminada;
  }

  /**
   * Elimina permanentemente una entidad financiera (hard delete)
   * @param identifier - UUID o nombre normalizado
   * @returns void
   * @throws NotFoundException si no existe
   * @throws BadRequestException si la entidad tiene productos asociados
   */
  async hardDeleteEntidadFinanciera(identifier: string): Promise<void> {
    const entidad = await this.findOneEntidad(identifier);

    // TODO: Verificar si tiene productos asociados antes de eliminar

    await this.entidadFinancieraRepo.remove(entidad);

    this.logger.warn(
      `Entidad financiera eliminada permanentemente: ${entidad.nombre} (ID: ${entidad.id})`,
    );
  }

  /**
   * Restaura una entidad financiera desactivada
   * @param identifier - UUID o nombre normalizado
   * @returns EntidadFinanciera restaurada
   * @throws NotFoundException si no existe
   */
  async restoreEntidadFinanciera(
    identifier: string,
  ): Promise<EntidadFinanciera> {
    const entidad = await this.findOneEntidad(identifier);

    if (entidad.activo) {
      this.logger.debug(
        `Entidad financiera ya está activa: ${entidad.nombre}`,
      );
      return entidad;
    }

    entidad.activo = true;
    const entidadRestaurada = await this.entidadFinancieraRepo.save(entidad);

    this.logger.log(
      `Entidad financiera restaurada: ${entidadRestaurada.nombre} (ID: ${entidadRestaurada.id})`,
    );

    return entidadRestaurada;
  }
}
