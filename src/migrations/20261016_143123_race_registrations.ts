import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "race_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"race_id" integer NOT NULL,
  	"member_id" integer NOT NULL,
  	"guests" numeric DEFAULT 0 NOT NULL,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "races" ADD COLUMN "partners_welcome" boolean DEFAULT false;
  ALTER TABLE "races" ADD COLUMN "welcome_info" varchar;
  ALTER TABLE "races" ADD COLUMN "capacity" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "race_registrations_id" integer;
  ALTER TABLE "race_registrations" ADD CONSTRAINT "race_registrations_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "race_registrations" ADD CONSTRAINT "race_registrations_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "race_registrations_race_idx" ON "race_registrations" USING btree ("race_id");
  CREATE INDEX "race_registrations_member_idx" ON "race_registrations" USING btree ("member_id");
  CREATE INDEX "race_registrations_updated_at_idx" ON "race_registrations" USING btree ("updated_at");
  CREATE INDEX "race_registrations_created_at_idx" ON "race_registrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "race_member_idx" ON "race_registrations" USING btree ("race_id","member_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_race_registrations_fk" FOREIGN KEY ("race_registrations_id") REFERENCES "public"."race_registrations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_race_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("race_registrations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "race_registrations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "race_registrations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_race_registrations_fk";
  
  DROP INDEX "payload_locked_documents_rels_race_registrations_id_idx";
  ALTER TABLE "races" DROP COLUMN "partners_welcome";
  ALTER TABLE "races" DROP COLUMN "welcome_info";
  ALTER TABLE "races" DROP COLUMN "capacity";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "race_registrations_id";`)
}
