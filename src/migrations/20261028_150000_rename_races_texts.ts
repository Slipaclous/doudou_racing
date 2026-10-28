import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// "races_texts" read as a sub-table of the "races" collection and broke every races query.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "races_texts" RENAME TO "upcoming_texts";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "upcoming_texts" RENAME TO "races_texts";`)
}
