import { AppDataSource } from '../src/database/data-source';
import { TipoCredito } from '../src/catalogos/entities/tipo-credito.entity';
import { TipoVivienda } from '../src/catalogos/entities/tipo-vivienda.entity';
import { Denominacion } from '../src/catalogos/entities/denominacion.entity';
import { TipoTasa } from '../src/catalogos/entities/tipo-tasa.entity';
import { TipoPago } from '../src/catalogos/entities/tipo-pago.entity';

async function seed() {
  console.log('🌱 Iniciando seed de catálogos...');

  // Inicializar conexión
  await AppDataSource.initialize();
  console.log('✅ Conexión a base de datos establecida');

  try {
    // 1. TIPOS DE CRÉDITO
    console.log('\n📋 Seeding tipos_credito...');
    const tipoCreditoRepo = AppDataSource.getRepository(TipoCredito);

    const tiposCredito = [
      { codigo: 'hipotecario', nombre: 'Crédito Hipotecario', activo: true },
      { codigo: 'consumo', nombre: 'Crédito de Consumo', activo: true },
      { codigo: 'vehiculo', nombre: 'Crédito de Vehículo', activo: true },
      { codigo: 'leasing', nombre: 'Leasing Habitacional', activo: true },
    ];

    for (const tipo of tiposCredito) {
      const exists = await tipoCreditoRepo.findOne({
        where: { codigo: tipo.codigo },
      });
      if (!exists) {
        await tipoCreditoRepo.save(tipo);
        console.log(`  ✓ Creado: ${tipo.nombre} (${tipo.codigo})`);
      } else {
        console.log(`  ⊘ Ya existe: ${tipo.nombre} (${tipo.codigo})`);
      }
    }

    // 2. TIPOS DE VIVIENDA
    console.log('\n🏠 Seeding tipos_vivienda...');
    const tipoViviendaRepo = AppDataSource.getRepository(TipoVivienda);

    const tiposVivienda = [
      {
        codigo: 'vis',
        nombre: 'VIS (Vivienda de Interés Social)',
        activo: true,
      },
      { codigo: 'no_vis', nombre: 'No VIS', activo: true },
      {
        codigo: 'vip',
        nombre: 'VIP (Vivienda de Interés Prioritario)',
        activo: true,
      },
      {
        codigo: 'aplica_ambos',
        nombre: 'Aplica para VIS y No VIS',
        activo: true,
      },
    ];

    for (const tipo of tiposVivienda) {
      const exists = await tipoViviendaRepo.findOne({
        where: { codigo: tipo.codigo },
      });
      if (!exists) {
        await tipoViviendaRepo.save(tipo);
        console.log(`  ✓ Creado: ${tipo.nombre} (${tipo.codigo})`);
      } else {
        console.log(`  ⊘ Ya existe: ${tipo.nombre} (${tipo.codigo})`);
      }
    }

    // 3. DENOMINACIONES
    console.log('\n💰 Seeding denominaciones...');
    const denominacionRepo = AppDataSource.getRepository(Denominacion);

    const denominaciones = [
      { codigo: 'pesos', nombre: 'Pesos Colombianos (COP)', activo: true },
      { codigo: 'uvr', nombre: 'UVR (Unidad de Valor Real)', activo: true },
    ];

    for (const denom of denominaciones) {
      const exists = await denominacionRepo.findOne({
        where: { codigo: denom.codigo },
      });
      if (!exists) {
        await denominacionRepo.save(denom);
        console.log(`  ✓ Creado: ${denom.nombre} (${denom.codigo})`);
      } else {
        console.log(`  ⊘ Ya existe: ${denom.nombre} (${denom.codigo})`);
      }
    }

    // 4. TIPOS DE TASA
    console.log('\n📊 Seeding tipos_tasa...');
    const tipoTasaRepo = AppDataSource.getRepository(TipoTasa);

    const tiposTasa = [
      {
        codigo: 'efectiva_anual',
        nombre: 'Tasa Efectiva Anual (EA)',
        activo: true,
      },
      {
        codigo: 'nominal_mensual',
        nombre: 'Tasa Nominal Mensual Vencida (NMV)',
        activo: true,
      },
    ];

    for (const tipo of tiposTasa) {
      const exists = await tipoTasaRepo.findOne({
        where: { codigo: tipo.codigo },
      });
      if (!exists) {
        await tipoTasaRepo.save(tipo);
        console.log(`  ✓ Creado: ${tipo.nombre} (${tipo.codigo})`);
      } else {
        console.log(`  ⊘ Ya existe: ${tipo.nombre} (${tipo.codigo})`);
      }
    }

    // 5. TIPOS DE PAGO
    console.log('\n💳 Seeding tipos_pago...');
    const tipoPagoRepo = AppDataSource.getRepository(TipoPago);

    const tiposPago = [
      { codigo: 'cuota_fija', nombre: 'Cuota Fija', activo: true },
      { codigo: 'cuota_variable', nombre: 'Cuota Variable', activo: true },
    ];

    for (const tipo of tiposPago) {
      const exists = await tipoPagoRepo.findOne({
        where: { codigo: tipo.codigo },
      });
      if (!exists) {
        await tipoPagoRepo.save(tipo);
        console.log(`  ✓ Creado: ${tipo.nombre} (${tipo.codigo})`);
      } else {
        console.log(`  ⊘ Ya existe: ${tipo.nombre} (${tipo.codigo})`);
      }
    }

    console.log('\n✅ Seed de catálogos completado exitosamente');
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar seed
seed()
  .then(() => {
    console.log('\n🎉 Seed finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
