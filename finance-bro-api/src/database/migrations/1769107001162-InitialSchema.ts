import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1769107001162 implements MigrationInterface {
    name = 'InitialSchema1769107001162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "entidades_financieras" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(255) NOT NULL, "nombre_normalizado" character varying(255) NOT NULL, "activo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a7a6c5142f8bedd1f97e51599ad" UNIQUE ("nombre_normalizado"), CONSTRAINT "PK_00e5ff9573a0272c2fe4a4dca03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipos_credito" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying(50) NOT NULL, "nombre" character varying(255) NOT NULL, "activo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_223cd631ffaa2ba0af87f6d368d" UNIQUE ("codigo"), CONSTRAINT "PK_bdfe81c969ba8ec4e19a91675be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipos_vivienda" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying(50) NOT NULL, "nombre" character varying(255) NOT NULL, "activo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_67673a4003ca9f1b156ade79ea9" UNIQUE ("codigo"), CONSTRAINT "PK_abef1731203b84d4e2424a424dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "denominaciones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying(50) NOT NULL, "nombre" character varying(255) NOT NULL, "activo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_94f3584c61ddc44643aaf1c5a7a" UNIQUE ("codigo"), CONSTRAINT "PK_a5c06caefb91af3c6af59b35484" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipos_tasa" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying(50) NOT NULL, "nombre" character varying(255) NOT NULL, "activo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_c5a6d426ab3c5d4b9b6438c318d" UNIQUE ("codigo"), CONSTRAINT "PK_b8b8ebd230e5dc3343e143732a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipos_pago" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying(50) NOT NULL, "nombre" character varying(255) NOT NULL, "activo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_74e911fcb7da912733c32f4b416" UNIQUE ("codigo"), CONSTRAINT "PK_ed0a3c97505c2ac594a92b91380" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "productos_credito" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_unico_scraping" character varying(255) NOT NULL, "entidad_id" uuid NOT NULL, "tipo_credito_id" uuid NOT NULL, "tipo_vivienda_id" uuid, "denominacion_id" uuid NOT NULL, "tipo_tasa_id" uuid NOT NULL, "tipo_pago_id" uuid NOT NULL, "descripcion" text, "url_pagina" text, "url_pdf" text, "activo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d7d8510f32ecf1f7889a5a43b94" UNIQUE ("id_unico_scraping"), CONSTRAINT "PK_3d56ee53a06f672794584bdfddf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tasas_vigentes" ("producto_id" uuid NOT NULL, "tasa_valor" numeric(5,2) NOT NULL, "tasa_texto_original" character varying(50), "tasa_minima" numeric(5,2), "tasa_maxima" numeric(5,2), "es_rango" boolean NOT NULL DEFAULT false, "fecha_vigencia" date NOT NULL DEFAULT ('now'::text)::date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c56af9f39c06ca3ad8ea2e905bf" PRIMARY KEY ("producto_id"))`);
        await queryRunner.query(`CREATE TABLE "tasas_historicas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "producto_id" uuid NOT NULL, "tasa_valor" numeric(5,2) NOT NULL, "fecha_extraccion" date NOT NULL, "hora_extraccion" TIME NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7317eca7e6f9f80a9f35eebac6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "montos_productos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "producto_id" uuid NOT NULL, "monto_minimo" bigint, "monto_maximo" bigint, "plazo_minimo_meses" integer, "plazo_maximo_meses" integer, CONSTRAINT "UQ_319a49680509ac0ba14f397a7dd" UNIQUE ("producto_id"), CONSTRAINT "PK_953aedcabfe50456dbc7d7d08ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "condiciones_productos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "producto_id" uuid NOT NULL, "condicion" text NOT NULL, "orden" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_ea881a8f3f13897919390905e43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "requisitos_productos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "producto_id" uuid NOT NULL, "requisito" text NOT NULL, "es_obligatorio" boolean NOT NULL DEFAULT true, "orden" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_7d0243fff004db21ae6924d201d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "beneficios_productos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "producto_id" uuid NOT NULL, "tipo_beneficio" character varying(100), "descripcion" text, "valor" character varying(50), "aplica_condicion" text, "orden" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_03001a6f048dab5fb94d86be8e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ejecuciones_scraping" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entidad_nombre" character varying(255), "productos_procesados" integer NOT NULL DEFAULT '0', "productos_nuevos" integer NOT NULL DEFAULT '0', "productos_actualizados" integer NOT NULL DEFAULT '0', "errores" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_76c06221a2a8a2088c6481421e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_e9afda99305caf60fd708b25685" FOREIGN KEY ("entidad_id") REFERENCES "entidades_financieras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_6fee9fad1d27ba4835e788b233f" FOREIGN KEY ("tipo_credito_id") REFERENCES "tipos_credito"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_5bb4634178300acf33974f4946f" FOREIGN KEY ("tipo_vivienda_id") REFERENCES "tipos_vivienda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_98c9920ec1e1aaae920e41d72fc" FOREIGN KEY ("denominacion_id") REFERENCES "denominaciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_d47b02ed43052878e1b235a0da4" FOREIGN KEY ("tipo_tasa_id") REFERENCES "tipos_tasa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_c4074ee52838a05ce2dbf96bb5b" FOREIGN KEY ("tipo_pago_id") REFERENCES "tipos_pago"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasas_vigentes" ADD CONSTRAINT "FK_c56af9f39c06ca3ad8ea2e905bf" FOREIGN KEY ("producto_id") REFERENCES "productos_credito"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasas_historicas" ADD CONSTRAINT "FK_2918420844525caab5cea9e4d5a" FOREIGN KEY ("producto_id") REFERENCES "productos_credito"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "montos_productos" ADD CONSTRAINT "FK_319a49680509ac0ba14f397a7dd" FOREIGN KEY ("producto_id") REFERENCES "productos_credito"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "condiciones_productos" ADD CONSTRAINT "FK_2840d712a55111693f9f633756a" FOREIGN KEY ("producto_id") REFERENCES "productos_credito"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requisitos_productos" ADD CONSTRAINT "FK_55d2c06a10d81325be7af287760" FOREIGN KEY ("producto_id") REFERENCES "productos_credito"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "beneficios_productos" ADD CONSTRAINT "FK_55f609e4ca5fbb76886e64ef4b9" FOREIGN KEY ("producto_id") REFERENCES "productos_credito"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beneficios_productos" DROP CONSTRAINT "FK_55f609e4ca5fbb76886e64ef4b9"`);
        await queryRunner.query(`ALTER TABLE "requisitos_productos" DROP CONSTRAINT "FK_55d2c06a10d81325be7af287760"`);
        await queryRunner.query(`ALTER TABLE "condiciones_productos" DROP CONSTRAINT "FK_2840d712a55111693f9f633756a"`);
        await queryRunner.query(`ALTER TABLE "montos_productos" DROP CONSTRAINT "FK_319a49680509ac0ba14f397a7dd"`);
        await queryRunner.query(`ALTER TABLE "tasas_historicas" DROP CONSTRAINT "FK_2918420844525caab5cea9e4d5a"`);
        await queryRunner.query(`ALTER TABLE "tasas_vigentes" DROP CONSTRAINT "FK_c56af9f39c06ca3ad8ea2e905bf"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_c4074ee52838a05ce2dbf96bb5b"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_d47b02ed43052878e1b235a0da4"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_98c9920ec1e1aaae920e41d72fc"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_5bb4634178300acf33974f4946f"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_6fee9fad1d27ba4835e788b233f"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_e9afda99305caf60fd708b25685"`);
        await queryRunner.query(`DROP TABLE "ejecuciones_scraping"`);
        await queryRunner.query(`DROP TABLE "beneficios_productos"`);
        await queryRunner.query(`DROP TABLE "requisitos_productos"`);
        await queryRunner.query(`DROP TABLE "condiciones_productos"`);
        await queryRunner.query(`DROP TABLE "montos_productos"`);
        await queryRunner.query(`DROP TABLE "tasas_historicas"`);
        await queryRunner.query(`DROP TABLE "tasas_vigentes"`);
        await queryRunner.query(`DROP TABLE "productos_credito"`);
        await queryRunner.query(`DROP TABLE "tipos_pago"`);
        await queryRunner.query(`DROP TABLE "tipos_tasa"`);
        await queryRunner.query(`DROP TABLE "denominaciones"`);
        await queryRunner.query(`DROP TABLE "tipos_vivienda"`);
        await queryRunner.query(`DROP TABLE "tipos_credito"`);
        await queryRunner.query(`DROP TABLE "entidades_financieras"`);
    }

}
