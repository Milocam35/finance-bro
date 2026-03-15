import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTasaFinalAndUvrVariacion1769806114625 implements MigrationInterface {
    name = 'AddTasaFinalAndUvrVariacion1769806114625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasas_vigentes" ADD "tasa_final" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "tasas_vigentes" ADD "uvr_variacion_anual" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "tasas_historicas" ADD "tasa_final" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "tasas_historicas" ADD "uvr_variacion_anual" numeric(5,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasas_historicas" DROP COLUMN "uvr_variacion_anual"`);
        await queryRunner.query(`ALTER TABLE "tasas_historicas" DROP COLUMN "tasa_final"`);
        await queryRunner.query(`ALTER TABLE "tasas_vigentes" DROP COLUMN "uvr_variacion_anual"`);
        await queryRunner.query(`ALTER TABLE "tasas_vigentes" DROP COLUMN "tasa_final"`);
    }

}
