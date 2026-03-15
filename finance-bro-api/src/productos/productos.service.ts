import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoCredito } from './entities/producto-credito.entity';
import { TasaVigente } from './entities/tasa-vigente.entity';
import { TasaHistorica } from './entities/tasa-historica.entity';
import { MontoProducto } from './entities/monto-producto.entity';
import { CondicionProducto } from './entities/condicion-producto.entity';
import { RequisitoProducto } from './entities/requisito-producto.entity';
import { BeneficioProducto } from './entities/beneficio-producto.entity';
import { EjecucionScraping } from './entities/ejecucion-scraping.entity';
import { CatalogosService } from '../catalogos/catalogos.service';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger(ProductosService.name);
  private readonly uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  constructor(
    @InjectRepository(ProductoCredito)
    private readonly productoCreditoRepo: Repository<ProductoCredito>,
    @InjectRepository(TasaVigente)
    private readonly tasaVigenteRepo: Repository<TasaVigente>,
    @InjectRepository(TasaHistorica)
    private readonly tasaHistoricaRepo: Repository<TasaHistorica>,
    @InjectRepository(MontoProducto)
    private readonly montoProductoRepo: Repository<MontoProducto>,
    @InjectRepository(CondicionProducto)
    private readonly condicionProductoRepo: Repository<CondicionProducto>,
    @InjectRepository(RequisitoProducto)
    private readonly requisitoProductoRepo: Repository<RequisitoProducto>,
    @InjectRepository(BeneficioProducto)
    private readonly beneficioProductoRepo: Repository<BeneficioProducto>,
    @InjectRepository(EjecucionScraping)
    private readonly ejecucionScrapingRepo: Repository<EjecucionScraping>,
    private readonly catalogosService: CatalogosService,
  ) {}

  // ==================== PRODUCTO CREDITO ====================

  /**
   * Busca un producto por su ID único de scraping
   * @param idUnico - ID único generado por n8n
   * @returns ProductoCredito o null si no existe
   */
  async findByIdUnico(idUnico: string): Promise<ProductoCredito | null> {
    const producto = await this.productoCreditoRepo.findOne({
      where: { id_unico_scraping: idUnico, activo: true },
    });

    if (!producto) {
      this.logger.debug(`Producto no encontrado: ${idUnico}`);
    }

    return producto;
  }

  /**
   * Crea un nuevo producto de crédito
   * @param data - Datos del producto
   * @returns ProductoCredito creado
   */
  async create(data: Partial<ProductoCredito>): Promise<ProductoCredito> {
    const nuevoProducto = this.productoCreditoRepo.create(data);
    const productoGuardado = await this.productoCreditoRepo.save(nuevoProducto);

    this.logger.log(
      `Producto creado: ${productoGuardado.id_unico_scraping} (ID: ${productoGuardado.id})`,
    );

    return productoGuardado;
  }

  /**
   * Actualiza un producto existente
   * @param id - UUID del producto
   * @param data - Datos a actualizar
   * @returns ProductoCredito actualizado
   */
  async update(id: string, data: Partial<ProductoCredito>): Promise<ProductoCredito> {
    const producto = await this.productoCreditoRepo.findOne({ where: { id } });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    Object.assign(producto, data);
    const productoActualizado = await this.productoCreditoRepo.save(producto);

    this.logger.log(`Producto actualizado: ${producto.id_unico_scraping}`);

    return productoActualizado;
  }

  /**
   * Obtiene un producto por su ID con todas sus relaciones
   * @param id - UUID del producto
   * @returns ProductoCredito con relaciones
   */
  async findById(id: string): Promise<ProductoCredito | null> {
    return await this.productoCreditoRepo.findOne({
      where: { id, activo: true },
      relations: ['entidad', 'tipo_credito', 'tipo_vivienda', 'denominacion', 'tipo_tasa', 'tipo_pago'],
    });
  }

  /**
   * Obtiene un producto con TODAS sus relaciones (incluyendo tasas, montos, condiciones, etc.)
   * @param id - UUID del producto
   * @returns ProductoCredito completo con todas las relaciones
   */
  async findOneComplete(id: string): Promise<any> {
    const producto = await this.productoCreditoRepo.findOne({
      where: { id, activo: true },
      relations: ['entidad', 'tipo_credito', 'tipo_vivienda', 'denominacion', 'tipo_tasa', 'tipo_pago'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Obtener tasa vigente
    const tasaVigente = await this.tasaVigenteRepo.findOne({
      where: { producto_id: id },
    });

    // Obtener montos
    const monto = await this.montoProductoRepo.findOne({
      where: { producto_id: id },
    });

    // Obtener condiciones
    const condiciones = await this.condicionProductoRepo.find({
      where: { producto_id: id },
      order: { orden: 'ASC' },
    });

    // Obtener requisitos
    const requisitos = await this.requisitoProductoRepo.find({
      where: { producto_id: id },
      order: { orden: 'ASC' },
    });

    // Obtener beneficios
    const beneficios = await this.beneficioProductoRepo.find({
      where: { producto_id: id },
    });

    return {
      ...producto,
      tasa_vigente: tasaVigente || undefined,
      monto: monto || undefined,
      condiciones: condiciones.map((c) => ({ condicion: c.condicion, orden: c.orden })),
      requisitos: requisitos.map((r) => ({
        requisito: r.requisito,
        es_obligatorio: r.es_obligatorio,
        orden: r.orden,
      })),
      beneficios: beneficios.map((b) => ({
        tipo_beneficio: b.tipo_beneficio,
        descripcion: b.descripcion,
        valor: b.valor,
        aplica_condicion: b.aplica_condicion,
      })),
    };
  }

  /**
   * Lista productos con filtros y paginación
   * @param filters - Filtros de búsqueda
   * @returns Lista paginada de productos
   */
  async findAll(filters: {
    entidad_id?: string;
    tipo_credito_id?: string;
    tipo_vivienda_id?: string;
    denominacion_id?: string;
    tipo_tasa_id?: string;
    tipo_pago_id?: string;
    activo?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ data: ProductoCredito[]; total: number }> {
    const {
      entidad_id,
      tipo_credito_id,
      tipo_vivienda_id,
      denominacion_id,
      tipo_tasa_id,
      tipo_pago_id,
      activo = true,
      search,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = filters;

    const queryBuilder = this.productoCreditoRepo
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.entidad', 'entidad')
      .leftJoinAndSelect('producto.tipo_credito', 'tipo_credito')
      .leftJoinAndSelect('producto.tipo_vivienda', 'tipo_vivienda')
      .leftJoinAndSelect('producto.denominacion', 'denominacion')
      .leftJoinAndSelect('producto.tipo_tasa', 'tipo_tasa')
      .leftJoinAndSelect('producto.tipo_pago', 'tipo_pago');

    // Aplicar filtros
    queryBuilder.where('producto.activo = :activo', { activo });

    if (entidad_id) {
      queryBuilder.andWhere('producto.entidad_id = :entidad_id', { entidad_id });
    }

    if (tipo_credito_id) {
      queryBuilder.andWhere('producto.tipo_credito_id = :tipo_credito_id', { tipo_credito_id });
    }

    if (tipo_vivienda_id) {
      queryBuilder.andWhere('producto.tipo_vivienda_id = :tipo_vivienda_id', { tipo_vivienda_id });
    }

    if (denominacion_id) {
      queryBuilder.andWhere('producto.denominacion_id = :denominacion_id', { denominacion_id });
    }

    if (tipo_tasa_id) {
      queryBuilder.andWhere('producto.tipo_tasa_id = :tipo_tasa_id', { tipo_tasa_id });
    }

    if (tipo_pago_id) {
      queryBuilder.andWhere('producto.tipo_pago_id = :tipo_pago_id', { tipo_pago_id });
    }

    if (search) {
      queryBuilder.andWhere('producto.descripcion ILIKE :search', { search: `%${search}%` });
    }

    // Ordenamiento
    queryBuilder.orderBy(`producto.${sortBy}`, sortOrder);

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    // Enriquecer con tasa_vigente, monto, condiciones, requisitos y beneficios
    const enrichedData = await Promise.all(
      data.map(async (producto) => {
        const [tasaVigente, monto, condiciones, requisitos, beneficios] = await Promise.all([
          this.tasaVigenteRepo.findOne({ where: { producto_id: producto.id } }),
          this.montoProductoRepo.findOne({ where: { producto_id: producto.id } }),
          this.condicionProductoRepo.find({ where: { producto_id: producto.id }, order: { orden: 'ASC' } }),
          this.requisitoProductoRepo.find({ where: { producto_id: producto.id }, order: { orden: 'ASC' } }),
          this.beneficioProductoRepo.find({ where: { producto_id: producto.id } }),
        ]);

        return {
          ...producto,
          tasa_vigente: tasaVigente
            ? {
                tasa_valor: tasaVigente.tasa_valor != null ? Number(tasaVigente.tasa_valor) : null,
                tasa_final: tasaVigente.tasa_final != null ? Number(tasaVigente.tasa_final) : null,
                uvr_variacion_anual: tasaVigente.uvr_variacion_anual != null ? Number(tasaVigente.uvr_variacion_anual) : null,
                tasa_minima: tasaVigente.tasa_minima != null ? Number(tasaVigente.tasa_minima) : null,
                tasa_maxima: tasaVigente.tasa_maxima != null ? Number(tasaVigente.tasa_maxima) : null,
                es_rango: tasaVigente.es_rango,
                tasa_texto_original: tasaVigente.tasa_texto_original,
              }
            : undefined,
          monto: monto
            ? {
                monto_minimo: monto.monto_minimo != null ? Number(monto.monto_minimo) : null,
                monto_maximo: monto.monto_maximo != null ? Number(monto.monto_maximo) : null,
                plazo_minimo_meses: monto.plazo_minimo_meses != null ? Number(monto.plazo_minimo_meses) : null,
                plazo_maximo_meses: monto.plazo_maximo_meses != null ? Number(monto.plazo_maximo_meses) : null,
              }
            : undefined,
          condiciones: condiciones.map((c) => ({ condicion: c.condicion, orden: c.orden })),
          requisitos: requisitos.map((r) => ({
            requisito: r.requisito,
            es_obligatorio: r.es_obligatorio,
            orden: r.orden,
          })),
          beneficios: beneficios.map((b) => ({
            tipo_beneficio: b.tipo_beneficio,
            descripcion: b.descripcion,
            valor: b.valor,
            aplica_condicion: b.aplica_condicion,
          })),
        };
      }),
    );

    this.logger.log(`Consultados ${enrichedData.length} productos (total: ${total})`);

    return { data: enrichedData, total };
  }

  /**
   * Elimina (soft delete) un producto
   * @param id - UUID del producto
   * @returns Producto desactivado
   */
  async remove(id: string): Promise<ProductoCredito> {
    const producto = await this.productoCreditoRepo.findOne({ where: { id } });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    producto.activo = false;
    const productoDesactivado = await this.productoCreditoRepo.save(producto);

    this.logger.log(`Producto desactivado (soft delete): ${id}`);

    return productoDesactivado;
  }

  /**
   * Elimina permanentemente un producto de la base de datos (hard delete)
   * ADVERTENCIA: Esta operación NO se puede deshacer
   * @param id - UUID del producto
   * @returns Resultado de la eliminación
   */
  async hardDelete(id: string): Promise<{ affected: number }> {
    const producto = await this.productoCreditoRepo.findOne({ where: { id } });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Eliminar relaciones primero (debido a foreign keys)
    await this.tasaVigenteRepo.delete({ producto_id: id });
    await this.tasaHistoricaRepo.delete({ producto_id: id });
    await this.montoProductoRepo.delete({ producto_id: id });
    await this.condicionProductoRepo.delete({ producto_id: id });
    await this.requisitoProductoRepo.delete({ producto_id: id });
    await this.beneficioProductoRepo.delete({ producto_id: id });

    // Eliminar el producto
    const result = await this.productoCreditoRepo.delete({ id });

    this.logger.warn(
      `Producto eliminado permanentemente (hard delete): ${id} - ${producto.id_unico_scraping}`,
    );

    return { affected: result.affected || 0 };
  }

  // ==================== MÉTODOS DE RESOLUCIÓN ====================

  /**
   * Resuelve un identificador de entidad (UUID o nombre normalizado) a UUID
   * @param idOrNombre - UUID o nombre normalizado de la entidad
   * @returns UUID de la entidad
   * @throws NotFoundException si la entidad no existe
   */
  async resolveEntidadId(idOrNombre: string): Promise<string> {
    // Si es UUID, devolverlo directamente
    if (this.uuidRegex.test(idOrNombre)) {
      return idOrNombre;
    }

    // Si no es UUID, buscar por nombre normalizado
    const entidad = await this.catalogosService.findEntidadByNombre(idOrNombre);

    if (!entidad) {
      throw new NotFoundException(
        `Entidad financiera con nombre "${idOrNombre}" no encontrada`,
      );
    }

    return entidad.id;
  }

  /**
   * Resuelve un identificador de tipo de crédito (UUID o código) a UUID
   * @param idOrCodigo - UUID o código del tipo de crédito
   * @returns UUID del tipo de crédito
   * @throws NotFoundException si el tipo de crédito no existe
   */
  async resolveTipoCreditoId(idOrCodigo: string): Promise<string> {
    // Si es UUID, devolverlo directamente
    if (this.uuidRegex.test(idOrCodigo)) {
      return idOrCodigo;
    }

    // Si no es UUID, buscar por código
    const tipoCredito = await this.catalogosService.findTipoCreditoByCodigo(idOrCodigo);

    if (!tipoCredito) {
      throw new NotFoundException(
        `Tipo de crédito con código "${idOrCodigo}" no encontrado`,
      );
    }

    return tipoCredito.id;
  }

  // ==================== CONSULTAS ESPECIALES ====================

  /**
   * Obtiene los productos con las mejores tasas (más bajas) de un tipo de crédito
   * @param tipoCreditoId - UUID del tipo de crédito
   * @param limit - Número máximo de productos a retornar
   * @returns Array de productos ordenados por tasa de menor a mayor
   */
  async findMejoresTasas(tipoCreditoId: string, limit: number = 10): Promise<any[]> {
    const productos = await this.productoCreditoRepo
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.entidad', 'entidad')
      .leftJoinAndSelect('producto.tipo_credito', 'tipo_credito')
      .leftJoinAndSelect('producto.tipo_vivienda', 'tipo_vivienda')
      .leftJoinAndSelect('producto.denominacion', 'denominacion')
      .leftJoinAndSelect('producto.tipo_tasa', 'tipo_tasa')
      .leftJoinAndSelect('producto.tipo_pago', 'tipo_pago')
      .leftJoin('tasas_vigentes', 'tasa', 'tasa.producto_id = producto.id')
      .where('producto.activo = :activo', { activo: true })
      .andWhere('producto.tipo_credito_id = :tipoCreditoId', { tipoCreditoId })
      .andWhere('tasa.tasa_valor IS NOT NULL')
      .orderBy('tasa.tasa_valor', 'ASC')
      .take(limit)
      .getMany();

    // Para cada producto, agregar la tasa vigente
    const productosConTasa = await Promise.all(
      productos.map(async (producto) => {
        const tasaVigente = await this.tasaVigenteRepo.findOne({
          where: { producto_id: producto.id },
        });

        const monto = await this.montoProductoRepo.findOne({
          where: { producto_id: producto.id },
        });

        return {
          ...producto,
          tasa_vigente: tasaVigente || undefined,
          monto: monto || undefined,
        };
      }),
    );

    this.logger.log(
      `Consultados ${productosConTasa.length} productos con mejores tasas (tipo: ${tipoCreditoId})`,
    );

    return productosConTasa;
  }

  // ==================== TASA VIGENTE ====================

  /**
   * Obtiene la tasa vigente de un producto
   * @param productoId - UUID del producto
   * @returns TasaVigente o null si no existe
   */
  async getTasaVigente(productoId: string): Promise<TasaVigente | null> {
    return await this.tasaVigenteRepo.findOne({
      where: { producto_id: productoId },
    });
  }

  /**
   * Crea una nueva tasa vigente
   * @param data - Datos de la tasa
   * @returns TasaVigente creada
   */
  async createTasaVigente(data: Partial<TasaVigente>): Promise<TasaVigente> {
    const nuevaTasa = this.tasaVigenteRepo.create(data);
    const tasaGuardada = await this.tasaVigenteRepo.save(nuevaTasa);

    this.logger.log(`Tasa vigente creada para producto: ${tasaGuardada.producto_id}`);

    return tasaGuardada;
  }

  /**
   * Actualiza la tasa vigente de un producto
   * @param productoId - UUID del producto
   * @param data - Datos a actualizar
   * @returns TasaVigente actualizada
   */
  async updateTasaVigente(productoId: string, data: Partial<TasaVigente>): Promise<TasaVigente> {
    let tasa = await this.getTasaVigente(productoId);

    if (!tasa) {
      // Si no existe, crear una nueva
      return await this.createTasaVigente({ ...data, producto_id: productoId });
    }

    Object.assign(tasa, data);
    const tasaActualizada = await this.tasaVigenteRepo.save(tasa);

    this.logger.log(`Tasa vigente actualizada para producto: ${productoId}`);

    return tasaActualizada;
  }

  // ==================== TASA HISTORICA ====================

  /**
   * Inserta un registro en el histórico de tasas
   * @param data - Datos del histórico
   * @returns TasaHistorica creada
   */
  async insertTasaHistorica(data: Partial<TasaHistorica>): Promise<TasaHistorica> {
    const nuevoHistorico = this.tasaHistoricaRepo.create(data);
    const historicoGuardado = await this.tasaHistoricaRepo.save(nuevoHistorico);

    this.logger.log(`Histórico de tasa insertado para producto: ${historicoGuardado.producto_id}`);

    return historicoGuardado;
  }

  /**
   * Obtiene el histórico de tasas de un producto
   * @param productoId - UUID del producto
   * @param limit - Número máximo de registros (default: 10)
   * @returns Array de TasaHistorica
   */
  async getHistoricoTasas(productoId: string, limit: number = 10): Promise<TasaHistorica[]> {
    return await this.tasaHistoricaRepo.find({
      where: { producto_id: productoId },
      order: { fecha_extraccion: 'DESC', hora_extraccion: 'DESC' },
      take: limit,
    });
  }

  // ==================== MONTO PRODUCTO ====================

  /**
   * Upsert de montos de un producto (crea o actualiza)
   * @param productoId - UUID del producto
   * @param data - Datos de montos
   * @returns MontoProducto guardado
   */
  async upsertMontos(productoId: string, data: Partial<MontoProducto>): Promise<MontoProducto> {
    let monto = await this.montoProductoRepo.findOne({
      where: { producto_id: productoId },
    });

    if (!monto) {
      // Crear nuevo
      monto = this.montoProductoRepo.create({ ...data, producto_id: productoId });
    } else {
      // Actualizar existente
      Object.assign(monto, data);
    }

    const montoGuardado = await this.montoProductoRepo.save(monto);

    this.logger.log(`Montos actualizados para producto: ${productoId}`);

    return montoGuardado;
  }

  // ==================== CONDICIONES ====================

  /**
   * Reemplaza todas las condiciones de un producto
   * @param productoId - UUID del producto
   * @param condiciones - Array de condiciones
   * @returns Array de CondicionProducto creadas
   */
  async replaceCondiciones(
    productoId: string,
    condiciones: Array<{ condicion: string; orden: number }>,
  ): Promise<CondicionProducto[]> {
    // Eliminar condiciones existentes
    await this.condicionProductoRepo.delete({ producto_id: productoId });

    if (condiciones.length === 0) {
      return [];
    }

    // Crear nuevas condiciones
    const nuevasCondiciones = this.condicionProductoRepo.create(
      condiciones.map((cond) => ({
        producto_id: productoId,
        condicion: cond.condicion,
        orden: cond.orden,
      })),
    );

    const condicionesGuardadas = await this.condicionProductoRepo.save(nuevasCondiciones);

    this.logger.log(`${condiciones.length} condiciones reemplazadas para producto: ${productoId}`);

    return condicionesGuardadas;
  }

  // ==================== REQUISITOS ====================

  /**
   * Reemplaza todos los requisitos de un producto
   * @param productoId - UUID del producto
   * @param requisitos - Array de requisitos
   * @returns Array de RequisitoProducto creados
   */
  async replaceRequisitos(
    productoId: string,
    requisitos: Array<{
      requisito: string;
      tipo_requisito: string;
      es_obligatorio: boolean;
      orden: number;
    }>,
  ): Promise<RequisitoProducto[]> {
    // Eliminar requisitos existentes
    await this.requisitoProductoRepo.delete({ producto_id: productoId });

    if (requisitos.length === 0) {
      return [];
    }

    // Crear nuevos requisitos
    const nuevosRequisitos = this.requisitoProductoRepo.create(
      requisitos.map((req) => ({
        producto_id: productoId,
        requisito: req.requisito,
        tipo_requisito: req.tipo_requisito,
        es_obligatorio: req.es_obligatorio,
        orden: req.orden,
      })),
    );

    const requisitosGuardados = await this.requisitoProductoRepo.save(nuevosRequisitos);

    this.logger.log(`${requisitos.length} requisitos reemplazados para producto: ${productoId}`);

    return requisitosGuardados;
  }

  // ==================== BENEFICIOS ====================

  /**
   * Reemplaza todos los beneficios de un producto
   * @param productoId - UUID del producto
   * @param beneficios - Array de beneficios
   * @returns Array de BeneficioProducto creados
   */
  async replaceBeneficios(
    productoId: string,
    beneficios: Array<{
      tipo_beneficio: string;
      descripcion: string;
      valor: string | null;
      aplica_condicion: string | null;
    }>,
  ): Promise<BeneficioProducto[]> {
    // Eliminar beneficios existentes
    await this.beneficioProductoRepo.delete({ producto_id: productoId });

    if (beneficios.length === 0) {
      return [];
    }

    // Crear nuevos beneficios
    const nuevosBeneficios = this.beneficioProductoRepo.create(
      beneficios.map((ben) => ({
        producto_id: productoId,
        tipo_beneficio: ben.tipo_beneficio,
        descripcion: ben.descripcion,
        valor: ben.valor ?? undefined,
        aplica_condicion: ben.aplica_condicion ?? undefined,
      })),
    );

    const beneficiosGuardados = await this.beneficioProductoRepo.save(nuevosBeneficios);

    this.logger.log(`${beneficios.length} beneficios reemplazados para producto: ${productoId}`);

    return beneficiosGuardados;
  }

  // ==================== EJECUCION SCRAPING ====================

  /**
   * Registra una ejecución de scraping
   * @param data - Datos de la ejecución
   * @returns EjecucionScraping creada
   */
  async registrarEjecucion(data: Partial<EjecucionScraping>): Promise<EjecucionScraping> {
    const ejecucion = this.ejecucionScrapingRepo.create(data);
    const ejecucionGuardada = await this.ejecucionScrapingRepo.save(ejecucion);

    this.logger.log(`Ejecución de scraping registrada: ${ejecucionGuardada.id}`);

    return ejecucionGuardada;
  }

  /**
   * Actualiza una ejecución de scraping
   * @param id - UUID de la ejecución
   * @param data - Datos a actualizar
   * @returns EjecucionScraping actualizada
   */
  async actualizarEjecucion(id: string, data: Partial<EjecucionScraping>): Promise<EjecucionScraping> {
    const ejecucion = await this.ejecucionScrapingRepo.findOne({ where: { id } });

    if (!ejecucion) {
      throw new NotFoundException(`Ejecución con ID ${id} no encontrada`);
    }

    Object.assign(ejecucion, data);
    return await this.ejecucionScrapingRepo.save(ejecucion);
  }
}
