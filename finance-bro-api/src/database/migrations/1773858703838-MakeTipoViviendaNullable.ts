import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeTipoViviendaNullable1773858703838 implements MigrationInterface {
    name = 'MakeTipoViviendaNullable1773858703838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_5bb4634178300acf33974f4946f"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ALTER COLUMN "tipo_vivienda_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_5bb4634178300acf33974f4946f" FOREIGN KEY ("tipo_vivienda_id") REFERENCES "tipos_vivienda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productos_credito" DROP CONSTRAINT "FK_5bb4634178300acf33974f4946f"`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ALTER COLUMN "tipo_vivienda_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_credito" ADD CONSTRAINT "FK_5bb4634178300acf33974f4946f" FOREIGN KEY ("tipo_vivienda_id") REFERENCES "tipos_vivienda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
