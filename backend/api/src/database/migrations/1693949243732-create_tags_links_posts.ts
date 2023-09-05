import { MigrationInterface, QueryRunner } from "typeorm";

export class createTagsLinksPosts1693949243732 implements MigrationInterface {
    name = 'createTagsLinksPosts1693949243732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "user_mod_id" integer, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "links" ("id" SERIAL NOT NULL, "url" character varying(255) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "user_mod_id" integer, CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "spanish_title" character varying(255) NOT NULL, "english_title" character varying(255), "spanish_content" text NOT NULL, "english_content" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "cover_img_id" integer, "user_mod_id" integer, CONSTRAINT "REL_62d74ee258a34dab9584344777" UNIQUE ("cover_img_id"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "links_tags" ("link_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_f35e0f06580b7ceeb94f1cde906" PRIMARY KEY ("link_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_960f461913561f543805b26434" ON "links_tags" ("link_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab2f9a0e88920854014130ea53" ON "links_tags" ("tag_id") `);
        await queryRunner.query(`CREATE TABLE "specimens_galleries" ("specimen_id" integer NOT NULL, "image_id" integer NOT NULL, CONSTRAINT "PK_1b5d5cfa3a2377ee040519c0602" PRIMARY KEY ("specimen_id", "image_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_257b436248f5e6d19b81cc8e43" ON "specimens_galleries" ("specimen_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_71ea9b69cc8366a90035fe0b78" ON "specimens_galleries" ("image_id") `);
        await queryRunner.query(`CREATE TABLE "specimens_links" ("specimen_id" integer NOT NULL, "link_id" integer NOT NULL, CONSTRAINT "PK_9a05e39099ca5119c0a0624b9d8" PRIMARY KEY ("specimen_id", "link_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5b7a12564c7eb990b9204ac8cb" ON "specimens_links" ("specimen_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_952899d35a577f87db28fd26c4" ON "specimens_links" ("link_id") `);
        await queryRunner.query(`CREATE TABLE "species_links" ("species_id" integer NOT NULL, "link_id" integer NOT NULL, CONSTRAINT "PK_025343e61b87b763862de3c41ac" PRIMARY KEY ("species_id", "link_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0ca2bbd455cd5c04f46b0cc1d" ON "species_links" ("species_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ec6c6ba23adf869b9a705e839a" ON "species_links" ("link_id") `);
        await queryRunner.query(`CREATE TABLE "posts_tags" ("post_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_ab48f2c0184cd3367465effc5d3" PRIMARY KEY ("post_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a6b232c89aa1c442b7a6ef0211" ON "posts_tags" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a4f5ee04a91077ddb93526a60" ON "posts_tags" ("tag_id") `);
        await queryRunner.query(`CREATE TABLE "posts_galleries" ("post_id" integer NOT NULL, "image_id" integer NOT NULL, CONSTRAINT "PK_fec583229aadc345c6cb3607a67" PRIMARY KEY ("post_id", "image_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_54644e7c16b4a70c0e392c9976" ON "posts_galleries" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ea207025ca1c20cc1897e6fd8c" ON "posts_galleries" ("image_id") `);
        await queryRunner.query(`CREATE TABLE "posts_links" ("post_id" integer NOT NULL, "link_id" integer NOT NULL, CONSTRAINT "PK_044e0d04a9c0f94e49cb6dac8da" PRIMARY KEY ("post_id", "link_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c738d30fec3a071fbae72f520f" ON "posts_links" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0aeceff5f94aba754863701479" ON "posts_links" ("link_id") `);
        await queryRunner.query(`ALTER TABLE "specimens" DROP CONSTRAINT "UQ_254f7f7bdaf99de6d41357a974c"`);
        await queryRunner.query(`ALTER TABLE "specimens" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "specimens" ADD "code" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "specimens" ADD CONSTRAINT "UQ_f5064acf3407097c84d428480ff" UNIQUE ("code")`);
        await queryRunner.query(`ALTER TABLE "specimens" ADD "cover_img_id" integer`);
        await queryRunner.query(`ALTER TABLE "specimens" ADD CONSTRAINT "UQ_54fcbbe6f6d7febd8c697f3e6fc" UNIQUE ("cover_img_id")`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_68334b14bad9e1366082dc77e37" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_dc0d7862ad90fd8a2907adf70e2" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "specimens" ADD CONSTRAINT "FK_54fcbbe6f6d7febd8c697f3e6fc" FOREIGN KEY ("cover_img_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_62d74ee258a34dab95843447776" FOREIGN KEY ("cover_img_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_b75461ac2c441b713ecf141beb5" FOREIGN KEY ("user_mod_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "links_tags" ADD CONSTRAINT "FK_960f461913561f543805b264349" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "links_tags" ADD CONSTRAINT "FK_ab2f9a0e88920854014130ea53d" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "specimens_galleries" ADD CONSTRAINT "FK_257b436248f5e6d19b81cc8e43c" FOREIGN KEY ("specimen_id") REFERENCES "specimens"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "specimens_galleries" ADD CONSTRAINT "FK_71ea9b69cc8366a90035fe0b784" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "specimens_links" ADD CONSTRAINT "FK_5b7a12564c7eb990b9204ac8cb3" FOREIGN KEY ("specimen_id") REFERENCES "specimens"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "specimens_links" ADD CONSTRAINT "FK_952899d35a577f87db28fd26c42" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "species_links" ADD CONSTRAINT "FK_c0ca2bbd455cd5c04f46b0cc1da" FOREIGN KEY ("species_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "species_links" ADD CONSTRAINT "FK_ec6c6ba23adf869b9a705e839a4" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_tags" ADD CONSTRAINT "FK_a6b232c89aa1c442b7a6ef02110" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_tags" ADD CONSTRAINT "FK_0a4f5ee04a91077ddb93526a605" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_galleries" ADD CONSTRAINT "FK_54644e7c16b4a70c0e392c99765" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_galleries" ADD CONSTRAINT "FK_ea207025ca1c20cc1897e6fd8c3" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_links" ADD CONSTRAINT "FK_c738d30fec3a071fbae72f520f0" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_links" ADD CONSTRAINT "FK_0aeceff5f94aba754863701479c" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts_links" DROP CONSTRAINT "FK_0aeceff5f94aba754863701479c"`);
        await queryRunner.query(`ALTER TABLE "posts_links" DROP CONSTRAINT "FK_c738d30fec3a071fbae72f520f0"`);
        await queryRunner.query(`ALTER TABLE "posts_galleries" DROP CONSTRAINT "FK_ea207025ca1c20cc1897e6fd8c3"`);
        await queryRunner.query(`ALTER TABLE "posts_galleries" DROP CONSTRAINT "FK_54644e7c16b4a70c0e392c99765"`);
        await queryRunner.query(`ALTER TABLE "posts_tags" DROP CONSTRAINT "FK_0a4f5ee04a91077ddb93526a605"`);
        await queryRunner.query(`ALTER TABLE "posts_tags" DROP CONSTRAINT "FK_a6b232c89aa1c442b7a6ef02110"`);
        await queryRunner.query(`ALTER TABLE "species_links" DROP CONSTRAINT "FK_ec6c6ba23adf869b9a705e839a4"`);
        await queryRunner.query(`ALTER TABLE "species_links" DROP CONSTRAINT "FK_c0ca2bbd455cd5c04f46b0cc1da"`);
        await queryRunner.query(`ALTER TABLE "specimens_links" DROP CONSTRAINT "FK_952899d35a577f87db28fd26c42"`);
        await queryRunner.query(`ALTER TABLE "specimens_links" DROP CONSTRAINT "FK_5b7a12564c7eb990b9204ac8cb3"`);
        await queryRunner.query(`ALTER TABLE "specimens_galleries" DROP CONSTRAINT "FK_71ea9b69cc8366a90035fe0b784"`);
        await queryRunner.query(`ALTER TABLE "specimens_galleries" DROP CONSTRAINT "FK_257b436248f5e6d19b81cc8e43c"`);
        await queryRunner.query(`ALTER TABLE "links_tags" DROP CONSTRAINT "FK_ab2f9a0e88920854014130ea53d"`);
        await queryRunner.query(`ALTER TABLE "links_tags" DROP CONSTRAINT "FK_960f461913561f543805b264349"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_b75461ac2c441b713ecf141beb5"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_62d74ee258a34dab95843447776"`);
        await queryRunner.query(`ALTER TABLE "specimens" DROP CONSTRAINT "FK_54fcbbe6f6d7febd8c697f3e6fc"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_dc0d7862ad90fd8a2907adf70e2"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_68334b14bad9e1366082dc77e37"`);
        await queryRunner.query(`ALTER TABLE "specimens" DROP CONSTRAINT "UQ_54fcbbe6f6d7febd8c697f3e6fc"`);
        await queryRunner.query(`ALTER TABLE "specimens" DROP COLUMN "cover_img_id"`);
        await queryRunner.query(`ALTER TABLE "specimens" DROP CONSTRAINT "UQ_f5064acf3407097c84d428480ff"`);
        await queryRunner.query(`ALTER TABLE "specimens" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "specimens" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "specimens" ADD CONSTRAINT "UQ_254f7f7bdaf99de6d41357a974c" UNIQUE ("name")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0aeceff5f94aba754863701479"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c738d30fec3a071fbae72f520f"`);
        await queryRunner.query(`DROP TABLE "posts_links"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea207025ca1c20cc1897e6fd8c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54644e7c16b4a70c0e392c9976"`);
        await queryRunner.query(`DROP TABLE "posts_galleries"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a4f5ee04a91077ddb93526a60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a6b232c89aa1c442b7a6ef0211"`);
        await queryRunner.query(`DROP TABLE "posts_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ec6c6ba23adf869b9a705e839a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0ca2bbd455cd5c04f46b0cc1d"`);
        await queryRunner.query(`DROP TABLE "species_links"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_952899d35a577f87db28fd26c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b7a12564c7eb990b9204ac8cb"`);
        await queryRunner.query(`DROP TABLE "specimens_links"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_71ea9b69cc8366a90035fe0b78"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_257b436248f5e6d19b81cc8e43"`);
        await queryRunner.query(`DROP TABLE "specimens_galleries"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab2f9a0e88920854014130ea53"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_960f461913561f543805b26434"`);
        await queryRunner.query(`DROP TABLE "links_tags"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "links"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
