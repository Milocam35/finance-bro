/**
 * Parsea montos en formato texto a número
 * @example parseMonto("$20M") => 20000000
 * @example parseMonto("$262M") => 262000000
 * @example parseMonto("$1.5K") => 1500
 */
export function parseMonto(monto?: string): number | null {
  if (!monto) return null;

  const cleaned = monto.replace(/[$,\s]/g, '');

  if (cleaned.endsWith('M')) {
    return parseFloat(cleaned.replace('M', '')) * 1_000_000;
  }
  if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.replace('K', '')) * 1_000;
  }

  return parseFloat(cleaned) || null;
}

/**
 * Parsea tasas en formato texto a número
 * @example parseTasa("6.50%") => 6.50
 * @example parseTasa("6.5") => 6.5
 */
export function parseTasa(tasa?: string): number | null {
  if (!tasa) return null;

  const cleaned = tasa.replace('%', '').trim();
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? null : parsed;
}

/**
 * Parsea plazos en formato texto a meses
 * @example parsePlazo("30 años") => 360
 * @example parsePlazo("20 años") => 240
 * @example parsePlazo("24 meses") => 24
 */
export function parsePlazo(plazo?: string): number | null {
  if (!plazo) return null;

  const match = plazo.match(/\d+/);
  if (!match) return null;

  const numero = parseInt(match[0]);

  if (plazo.toLowerCase().includes('año')) {
    return numero * 12;
  }

  return numero; // asume meses por defecto
}

/**
 * Normaliza strings para comparaciones y claves
 * @example normalizeString("Bancolombia") => "bancolombia"
 * @example normalizeString("Banco de Bogotá") => "banco_de_bogota"
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, ''); // Remover caracteres especiales
}

/**
 * Mapea tipo de crédito a código
 * @example mapTipoCredito("Crédito hipotecario para compra de vivienda") => "hipotecario"
 */
export function mapTipoCredito(tipoCredito: string): string {
  const normalized = tipoCredito.toLowerCase();

  if (normalized.includes('hipotecario')) return 'hipotecario';
  if (normalized.includes('consumo')) return 'consumo';
  if (normalized.includes('vehiculo') || normalized.includes('vehículo'))
    return 'vehiculo';
  if (normalized.includes('leasing')) return 'leasing';

  return 'hipotecario'; // Default
}

/**
 * Mapea tipo de vivienda a código
 * @example mapTipoVivienda("VIS") => "vis"
 * @example mapTipoVivienda("Aplica para ambos") => "aplica_ambos"
 */
export function mapTipoVivienda(tipoVivienda?: string): string | null {
  if (!tipoVivienda) return null;

  const normalized = tipoVivienda.toLowerCase();

  if (normalized.includes('vis') && !normalized.includes('no'))
    return 'vis';
  if (normalized.includes('no vis') || normalized.includes('no_vis'))
    return 'no_vis';
  if (normalized.includes('ambos')) return 'aplica_ambos';
  if (normalized.includes('vip')) return 'vip';

  return 'aplica_ambos'; // Default
}

/**
 * Mapea denominación a código
 * @example mapDenominacion("UVR") => "uvr"
 * @example mapDenominacion("Pesos") => "pesos"
 */
export function mapDenominacion(denominacion: string): string {
  const normalized = denominacion.toLowerCase();

  if (normalized.includes('uvr')) return 'uvr';
  return 'pesos';
}

/**
 * Mapea tipo de pago a código
 * @example mapTipoPago("Cuota variable") => "cuota_variable"
 * @example mapTipoPago("Cuota fija") => "cuota_fija"
 */
export function mapTipoPago(tipoPago: string): string {
  const normalized = tipoPago.toLowerCase();

  if (normalized.includes('variable')) return 'cuota_variable';
  return 'cuota_fija';
}
