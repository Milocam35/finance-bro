import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntidadFinancieraFields1769629126027 implements MigrationInterface {
    name = 'UpdateEntidadFinancieraFields1769629126027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entidades_financieras" ADD "logo_url" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "entidades_financieras" ADD "sitio_web" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entidades_financieras" DROP COLUMN "sitio_web"`);
        await queryRunner.query(`ALTER TABLE "entidades_financieras" DROP COLUMN "logo_url"`);
    }

}
