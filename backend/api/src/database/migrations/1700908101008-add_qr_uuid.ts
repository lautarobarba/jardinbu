import { MigrationInterface, QueryRunner } from "typeorm";

export class addQrUuid1700908101008 implements MigrationInterface {
    name = 'addQrUuid1700908101008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qr_codes" DROP COLUMN "model_class"`);
        await queryRunner.query(`ALTER TABLE "qr_codes" DROP COLUMN "model_id"`);
        await queryRunner.query(`ALTER TABLE "qr_codes" ADD "uuid" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qr_codes" ADD CONSTRAINT "UQ_7f4b04fc1b5d5dc95f893dff67d" UNIQUE ("uuid")`);
        await queryRunner.query(`ALTER TABLE "qr_codes" ADD "link" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "qr_codes" ADD CONSTRAINT "UQ_951ffb4aaa2d4860576cf3b6a5c" UNIQUE ("link")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qr_codes" DROP CONSTRAINT "UQ_951ffb4aaa2d4860576cf3b6a5c"`);
        await queryRunner.query(`ALTER TABLE "qr_codes" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "qr_codes" DROP CONSTRAINT "UQ_7f4b04fc1b5d5dc95f893dff67d"`);
        await queryRunner.query(`ALTER TABLE "qr_codes" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "qr_codes" ADD "model_id" integer`);
        await queryRunner.query(`ALTER TABLE "qr_codes" ADD "model_class" character varying(255)`);
    }

}
