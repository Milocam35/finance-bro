import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsuariosTable1780000000000 implements MigrationInterface {
  name = 'CreateUsuariosTable1780000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilitar extensión uuid — necesario ya que esta es una DB distinta a financebro_db
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "usuarios" (
        "id"            uuid          NOT NULL DEFAULT uuid_generate_v4(),
        "nombre"        varchar(120)  NOT NULL,
        "email"         varchar(255)  NOT NULL,
        "password_hash" varchar       NOT NULL,
        "activo"        boolean       NOT NULL DEFAULT true,
        "created_at"    TIMESTAMP     NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_usuarios_email" UNIQUE ("email"),
        CONSTRAINT "PK_usuarios_id"    PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_usuarios_email" ON "usuarios" ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_usuarios_email"`);
    await queryRunner.query(`DROP TABLE "usuarios"`);
  }
}
