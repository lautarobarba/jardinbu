import { MigrationInterface, QueryRunner } from "typeorm";

export class refactorAll1693633748388 implements MigrationInterface {
    name = 'refactorAll1693633748388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pictures" ("id" SERIAL NOT NULL, "file_name" character varying NOT NULL, "path" character varying(255) NOT NULL, "mimetype" character varying, "original_name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "file_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_5aed472d03429506a84f43af95e" UNIQUE ("file_name"), CONSTRAINT "PK_7aa5e10dd31983e9f05b9f1fc85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'EDITOR', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "is_email_confirmed" boolean NOT NULL DEFAULT false, "firstname" character varying(255) NOT NULL, "lastname" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "refresh_token" character varying(255), "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE', "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "profile_picture_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_02ec15de199e79a0c46869895f" UNIQUE ("profile_picture_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "kingdoms" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "user_mod_id" integer, CONSTRAINT "PK_1c579ab8ed833694f47bf0ab293" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "phylums" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "kingdom_id" integer NOT NULL, "user_mod_id" integer, CONSTRAINT "PK_e47c740d6c00636ca9bc122ec86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "specimens" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "coord_lat" character varying, "coord_lon" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "species_id" integer NOT NULL, "user_mod_id" integer, CONSTRAINT "UQ_254f7f7bdaf99de6d41357a974c" UNIQUE ("name"), CONSTRAINT "PK_b08e6d804ef965346d0f4ca1f68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "file_name" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying, "original_name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "file_deleted" boolean NOT NULL DEFAULT false, "user_mod_id" integer, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."species_organism_type_enum" AS ENUM('TREE', 'BUSH', 'SUBSHRUB', 'FUNGUS', 'GRASS', 'LICHEN', 'HEMIPARASITE_SUBSHRUB')`);
        await queryRunner.query(`CREATE TYPE "public"."species_status_enum" AS ENUM('NATIVE', 'ENDEMIC', 'INTRODUCED')`);
        await queryRunner.query(`CREATE TYPE "public"."species_foliage_type_enum" AS ENUM('PERENNIAL', 'DECIDUOUS')`);
        await queryRunner.query(`CREATE TYPE "public"."species_presence_enum" AS ENUM('PRESENT', 'ABSENT')`);
        await queryRunner.query(`CREATE TABLE "species" ("id" SERIAL NOT NULL, "scientific_name" character varying(255), "common_name" character varying(255), "english_name" character varying(255), "description" text, "organism_type" "public"."species_organism_type_enum" DEFAULT 'TREE', "status" "public"."species_status_enum" DEFAULT 'NATIVE', "foliage_type" "public"."species_foliage_type_enum" DEFAULT 'DECIDUOUS', "presence" "public"."species_presence_enum" DEFAULT 'PRESENT', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "genus_id" integer NOT NULL, "example_img_id" integer, "user_mod_id" integer, CONSTRAINT "REL_0c5290b1f9120a5fcb9d8a1dd2" UNIQUE ("example_img_id"), CONSTRAINT "PK_ae6a87f2423ba6c25dc43c32770" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genera" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "family_id" integer NOT NULL, "user_mod_id" integer, CONSTRAINT "PK_50b2676d5cd7908032d9dd61339" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "families" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "order_tax_id" integer NOT NULL, "user_mod_id" integer, CONSTRAINT "PK_70414ac0c8f45664cf71324b9bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders_tax" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "class_tax_id" integer NOT NULL, "user_mod_id" integer, CONSTRAINT "PK_5c0074ff8bd4fb65d856b31e9ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classes_tax" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "phylum_id" integer NOT NULL, "user_mod_id" integer, CONSTRAINT "PK_e0c546ed1c8d3393681b80d53c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "qr_codes" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "model_class" character varying(255), "model_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_b705004a2f6f4e3db30cdc6984f" UNIQUE ("title"), CONSTRAINT "PK_4b7aa338e150a878ce9e2c55c5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "species_galleries" ("species_id" integer NOT NULL, "image_id" integer NOT NULL, CONSTRAINT "PK_55218f93fa6c6931df900d39813" PRIMARY KEY ("species_id", "image_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d7da602f303378825c0d1e2622" ON "species_galleries" ("species_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b652c11ac59bffb4afa1f4166f" ON "species_galleries" ("image_id") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_02ec15de199e79a0c46869895f4" FOREIGN KEY ("profile_picture_id") REFERENCES "pictures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kingdoms" ADD CONSTRAINT "FK_30f7ce51ac968ca8d49d1fdd3d9" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "phylums" ADD CONSTRAINT "FK_76aa1dcaa1e9d9ab9a39186e629" FOREIGN KEY ("kingdom_id") REFERENCES "kingdoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "phylums" ADD CONSTRAINT "FK_83607df426bf5187309d7999d7c" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "specimens" ADD CONSTRAINT "FK_7a4eefc595ca009d4ea5968e821" FOREIGN KEY ("species_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "specimens" ADD CONSTRAINT "FK_cb5db1af176da204e203085fd50" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_2e0e4dfb6508f6d4b6f336616c8" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "species" ADD CONSTRAINT "FK_6a3e0e686d5625250af46a3d2cd" FOREIGN KEY ("genus_id") REFERENCES "genera"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "species" ADD CONSTRAINT "FK_0c5290b1f9120a5fcb9d8a1dd2d" FOREIGN KEY ("example_img_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "species" ADD CONSTRAINT "FK_6416762c60ce04ba160a8f0783e" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "genera" ADD CONSTRAINT "FK_327745e62b7bd9bc475f2ee37e8" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "genera" ADD CONSTRAINT "FK_e4ce727dc4713358fe6f30018d1" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "families" ADD CONSTRAINT "FK_dcb231918958759cf8156209c52" FOREIGN KEY ("order_tax_id") REFERENCES "orders_tax"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "families" ADD CONSTRAINT "FK_5f3632784336b68723fa2637fce" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orders_tax" ADD CONSTRAINT "FK_dc8995050506668818a73394c97" FOREIGN KEY ("class_tax_id") REFERENCES "classes_tax"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orders_tax" ADD CONSTRAINT "FK_1b102ee8019fb9a74a439ee1829" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classes_tax" ADD CONSTRAINT "FK_725dea7ca565504c196c94d290f" FOREIGN KEY ("phylum_id") REFERENCES "phylums"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classes_tax" ADD CONSTRAINT "FK_bda026a5d93d4549919e6614a8f" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "species_galleries" ADD CONSTRAINT "FK_d7da602f303378825c0d1e2622e" FOREIGN KEY ("species_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "species_galleries" ADD CONSTRAINT "FK_b652c11ac59bffb4afa1f4166f1" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "species_galleries" DROP CONSTRAINT "FK_b652c11ac59bffb4afa1f4166f1"`);
        await queryRunner.query(`ALTER TABLE "species_galleries" DROP CONSTRAINT "FK_d7da602f303378825c0d1e2622e"`);
        await queryRunner.query(`ALTER TABLE "classes_tax" DROP CONSTRAINT "FK_bda026a5d93d4549919e6614a8f"`);
        await queryRunner.query(`ALTER TABLE "classes_tax" DROP CONSTRAINT "FK_725dea7ca565504c196c94d290f"`);
        await queryRunner.query(`ALTER TABLE "orders_tax" DROP CONSTRAINT "FK_1b102ee8019fb9a74a439ee1829"`);
        await queryRunner.query(`ALTER TABLE "orders_tax" DROP CONSTRAINT "FK_dc8995050506668818a73394c97"`);
        await queryRunner.query(`ALTER TABLE "families" DROP CONSTRAINT "FK_5f3632784336b68723fa2637fce"`);
        await queryRunner.query(`ALTER TABLE "families" DROP CONSTRAINT "FK_dcb231918958759cf8156209c52"`);
        await queryRunner.query(`ALTER TABLE "genera" DROP CONSTRAINT "FK_e4ce727dc4713358fe6f30018d1"`);
        await queryRunner.query(`ALTER TABLE "genera" DROP CONSTRAINT "FK_327745e62b7bd9bc475f2ee37e8"`);
        await queryRunner.query(`ALTER TABLE "species" DROP CONSTRAINT "FK_6416762c60ce04ba160a8f0783e"`);
        await queryRunner.query(`ALTER TABLE "species" DROP CONSTRAINT "FK_0c5290b1f9120a5fcb9d8a1dd2d"`);
        await queryRunner.query(`ALTER TABLE "species" DROP CONSTRAINT "FK_6a3e0e686d5625250af46a3d2cd"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_2e0e4dfb6508f6d4b6f336616c8"`);
        await queryRunner.query(`ALTER TABLE "specimens" DROP CONSTRAINT "FK_cb5db1af176da204e203085fd50"`);
        await queryRunner.query(`ALTER TABLE "specimens" DROP CONSTRAINT "FK_7a4eefc595ca009d4ea5968e821"`);
        await queryRunner.query(`ALTER TABLE "phylums" DROP CONSTRAINT "FK_83607df426bf5187309d7999d7c"`);
        await queryRunner.query(`ALTER TABLE "phylums" DROP CONSTRAINT "FK_76aa1dcaa1e9d9ab9a39186e629"`);
        await queryRunner.query(`ALTER TABLE "kingdoms" DROP CONSTRAINT "FK_30f7ce51ac968ca8d49d1fdd3d9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_02ec15de199e79a0c46869895f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b652c11ac59bffb4afa1f4166f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d7da602f303378825c0d1e2622"`);
        await queryRunner.query(`DROP TABLE "species_galleries"`);
        await queryRunner.query(`DROP TABLE "qr_codes"`);
        await queryRunner.query(`DROP TABLE "classes_tax"`);
        await queryRunner.query(`DROP TABLE "orders_tax"`);
        await queryRunner.query(`DROP TABLE "families"`);
        await queryRunner.query(`DROP TABLE "genera"`);
        await queryRunner.query(`DROP TABLE "species"`);
        await queryRunner.query(`DROP TYPE "public"."species_presence_enum"`);
        await queryRunner.query(`DROP TYPE "public"."species_foliage_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."species_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."species_organism_type_enum"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "specimens"`);
        await queryRunner.query(`DROP TABLE "phylums"`);
        await queryRunner.query(`DROP TABLE "kingdoms"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "pictures"`);
    }

}
