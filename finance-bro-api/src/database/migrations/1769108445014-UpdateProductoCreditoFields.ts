import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductoCreditoFields1769108445014 implements MigrationInterface {
    name = 'UpdateProductoCreditoFields1769108445014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP COLUMN "url_pagina"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD "url_extraccion" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD "url_redireccion" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD "fecha_extraccion" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD "hora_extraccion" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_5bb4634178300acf33974f4946f"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_c4074ee52838a05ce2dbf96bb5b"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ALTER COLUMN "tipo_vivienda_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ALTER COLUMN "tipo_pago_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ALTER COLUMN "descripcion" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasas_vigentes" ALTER COLUMN "tasa_valor" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_5bb4634178300acf33974f4946f" FOREIGN KEY ("tipo_vivienda_id") REFERENCES "tipos_vivienda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_c4074ee52838a05ce2dbf96bb5b" FOREIGN KEY ("tipo_pago_id") REFERENCES "tipos_pago"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_c4074ee52838a05ce2dbf96bb5b"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_5bb4634178300acf33974f4946f"`);
        await queryRunner.query(`ALTER TABLE "tasas_vigentes" ALTER COLUMN "tasa_valor" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ALTER COLUMN "descripcion" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ALTER COLUMN "tipo_pago_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ALTER COLUMN "tipo_vivienda_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_c4074ee52838a05ce2dbf96bb5b" FOREIGN KEY ("tipo_pago_id") REFERENCES "tipos_pago"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_5bb4634178300acf33974f4946f" FOREIGN KEY ("tipo_vivienda_id") REFERENCES "tipos_vivienda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP COLUMN "hora_extraccion"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP COLUMN "fecha_extraccion"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP COLUMN "url_redireccion"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP COLUMN "url_extraccion"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD "url_pagina" text`);
    }

}
