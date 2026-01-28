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

@Injectable()
export class ProductosService {
  private readonly logger = new Logger(ProductosService.name);

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
