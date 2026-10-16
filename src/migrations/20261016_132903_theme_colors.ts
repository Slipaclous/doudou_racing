import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" ADD COLUMN "theme_background" varchar DEFAULT '#0a0a0a';
  ALTER TABLE "settings" ADD COLUMN "theme_surface" varchar DEFAULT '#141414';
  ALTER TABLE "settings" ADD COLUMN "theme_accent" varchar DEFAULT '#e10600';
  ALTER TABLE "settings" ADD COLUMN "theme_accent_deep" varchar DEFAULT '#9e0400';
  ALTER TABLE "settings" ADD COLUMN "theme_text" varchar DEFAULT '#f5f3ef';
  ALTER TABLE "settings" ADD COLUMN "theme_muted" varchar DEFAULT '#a8a29e';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" DROP COLUMN "theme_background";
  ALTER TABLE "settings" DROP COLUMN "theme_surface";
  ALTER TABLE "settings" DROP COLUMN "theme_accent";
  ALTER TABLE "settings" DROP COLUMN "theme_accent_deep";
  ALTER TABLE "settings" DROP COLUMN "theme_text";
  ALTER TABLE "settings" DROP COLUMN "theme_muted";`)
}
