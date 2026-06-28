import { config } from 'dotenv';

config();

/**
 * Construye las opciones de conexión de TypeORM a partir de variables de entorno.
 *
 * - Si hay una URL de conexión (`DATABASE_URL`, o la que se pase como override
 *   para migraciones), se usa esa cadena con SSL. Pensado para Postgres
 *   gestionado como Supabase (pooler 6543 en runtime, 5432 en migraciones).
 * - Si no hay URL, se cae a las variables discretas `DATABASE_*`
 *   (Postgres local en Docker para desarrollo).
 *
 * SSL se activa automáticamente cuando se usa una URL. Se puede forzar con
 * `DATABASE_SSL=true` o desactivar con `DATABASE_SSL=false`.
 *
 * @param urlOverride URL alternativa (ej. `DATABASE_MIGRATION_URL` para migraciones).
 */
export function getDbConnectionOptions(urlOverride?: string) {
  const url = urlOverride || process.env.DATABASE_URL;

  const sslEnabled =
    process.env.DATABASE_SSL === 'true' ||
    (!!url && process.env.DATABASE_SSL !== 'false');

  // rejectUnauthorized:false acepta el certificado de Supabase sin CA local.
  const ssl = sslEnabled ? { rejectUnauthorized: false } : undefined;

  if (url) {
    // Se quita la query string (ej. ?sslmode=require): pg la interpreta y entra
    // en conflicto con el objeto `ssl` explícito, provocando
    // SELF_SIGNED_CERT_IN_CHAIN. Dejamos que mande nuestra opción `ssl`.
    const cleanUrl = url.split('?')[0];
    return { url: cleanUrl, ssl };
  }

  return {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'financebro',
    password: process.env.DATABASE_PASSWORD || 'password123',
    database: process.env.DATABASE_NAME || 'financebro_db',
    ssl,
  };
}
