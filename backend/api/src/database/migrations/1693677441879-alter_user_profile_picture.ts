import { MigrationInterface, QueryRunner } from "typeorm";

export class alterUserProfilePicture1693677441879 implements MigrationInterface {
    name = 'alterUserProfilePicture1693677441879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_02ec15de199e79a0c46869895f4"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_mod_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_02ec15de199e79a0c46869895f4" FOREIGN KEY ("profile_picture_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fb9e8229b7eaef312dbd4941033" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fb9e8229b7eaef312dbd4941033"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_02ec15de199e79a0c46869895f4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_mod_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_02ec15de199e79a0c46869895f4" FOREIGN KEY ("profile_picture_id") REFERENCES "pictures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
