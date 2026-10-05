import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" ADD COLUMN "role" varchar;
  ALTER TABLE "partners" ADD COLUMN "sector" varchar;
  ALTER TABLE "partners" ADD COLUMN "description" varchar;
  ALTER TABLE "partners" ADD COLUMN "order" numeric DEFAULT 10;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" DROP COLUMN "role";
  ALTER TABLE "partners" DROP COLUMN "sector";
  ALTER TABLE "partners" DROP COLUMN "description";
  ALTER TABLE "partners" DROP COLUMN "order";`)
}
