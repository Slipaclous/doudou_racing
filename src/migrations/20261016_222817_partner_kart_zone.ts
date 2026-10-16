import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_kart_zone" AS ENUM('nose', 'pods', 'plate', 'rear');
  ALTER TABLE "partners" ADD COLUMN "kart_zone" "enum_partners_kart_zone";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" DROP COLUMN "kart_zone";
  DROP TYPE "public"."enum_partners_kart_zone";`)
}
