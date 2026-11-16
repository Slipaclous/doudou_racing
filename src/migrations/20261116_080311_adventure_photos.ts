import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "adventure_texts_perks" ADD COLUMN "photo_id" integer;
  ALTER TABLE "adventure_texts" ADD COLUMN "pass_photo_id" integer;
  ALTER TABLE "adventure_texts_perks" ADD CONSTRAINT "adventure_texts_perks_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "adventure_texts" ADD CONSTRAINT "adventure_texts_pass_photo_id_media_id_fk" FOREIGN KEY ("pass_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "adventure_texts_perks_photo_idx" ON "adventure_texts_perks" USING btree ("photo_id");
  CREATE INDEX "adventure_texts_pass_pass_photo_idx" ON "adventure_texts" USING btree ("pass_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "adventure_texts_perks" DROP CONSTRAINT "adventure_texts_perks_photo_id_media_id_fk";
  
  ALTER TABLE "adventure_texts" DROP CONSTRAINT "adventure_texts_pass_photo_id_media_id_fk";
  
  DROP INDEX "adventure_texts_perks_photo_idx";
  DROP INDEX "adventure_texts_pass_pass_photo_idx";
  ALTER TABLE "adventure_texts_perks" DROP COLUMN "photo_id";
  ALTER TABLE "adventure_texts" DROP COLUMN "pass_photo_id";`)
}
