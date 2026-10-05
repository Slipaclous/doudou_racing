import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "stats_items_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  ALTER TABLE "stats_items_details" ADD CONSTRAINT "stats_items_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stats_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "stats_items_details_order_idx" ON "stats_items_details" USING btree ("_order");
  CREATE INDEX "stats_items_details_parent_id_idx" ON "stats_items_details" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "stats_items_details" CASCADE;`)
}
