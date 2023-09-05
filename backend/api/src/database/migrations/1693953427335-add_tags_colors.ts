import { MigrationInterface, QueryRunner } from "typeorm";

export class addTagsColors1693953427335 implements MigrationInterface {
    name = 'addTagsColors1693953427335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tags_bg_color_enum" AS ENUM('tagBgGreen', 'tagBgBlue', 'tagBgJade', 'tagBgLima', 'tagBgPink', 'tagBgYellow', 'tagBgRed', 'tagBgGrey', 'tagBgPurple')`);
        await queryRunner.query(`ALTER TABLE "tags" ADD "bg_color" "public"."tags_bg_color_enum" DEFAULT 'tagBgGreen'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "bg_color"`);
        await queryRunner.query(`DROP TYPE "public"."tags_bg_color_enum"`);
    }

}
