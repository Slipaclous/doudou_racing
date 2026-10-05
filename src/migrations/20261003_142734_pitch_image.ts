import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pitch_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "pitch_items" ADD CONSTRAINT "pitch_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pitch_items_image_idx" ON "pitch_items" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pitch_items" DROP CONSTRAINT "pitch_items_image_id_media_id_fk";
  
  DROP INDEX "pitch_items_image_idx";
  ALTER TABLE "pitch_items" DROP COLUMN "image_id";`)
}
