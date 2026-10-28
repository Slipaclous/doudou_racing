import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "career_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Le
  parcours',
  	"since" varchar DEFAULT '→ aujourd''hui',
  	"hint" varchar DEFAULT 'Faites défiler',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "quotes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"context" varchar,
  	"year" numeric
  );
  
  CREATE TABLE "quotes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "races_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Prochaines
  courses',
  	"countdown" varchar DEFAULT 'avant le prochain départ',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "adventure_texts_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar NOT NULL,
  	"stamp" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "adventure_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Bien plus qu''un logo',
  	"title" varchar DEFAULT 'Votre pass
  pour la saison',
  	"pass_pass_season" varchar DEFAULT 'Saison 2027',
  	"pass_pass_role" varchar DEFAULT 'Partenaire',
  	"pass_pass_name" varchar DEFAULT 'Votre entreprise',
  	"pass_pass_foot" varchar DEFAULT 'Accès paddock · All areas',
  	"closing" varchar DEFAULT 'Votre pass vous attend.',
  	"cta" varchar DEFAULT 'Devenir partenaire',
  	"gallery_link" varchar DEFAULT 'Voir la galerie →',
  	"member_link" varchar DEFAULT 'Déjà partenaire ? Les prochains rendez-vous',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "gallery_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Galerie',
  	"title" varchar DEFAULT 'Sur le terrain
  avec nos partenaires',
  	"lead" varchar DEFAULT 'Rallye, journées sur circuit, coulisses du paddock, soirées clients : la saison vécue ensemble.',
  	"empty" varchar DEFAULT 'Les premières photos arrivent bientôt.',
  	"closing" varchar DEFAULT 'Et la prochaine photo,
  c''est avec vous ?',
  	"cta" varchar DEFAULT 'Devenir partenaire',
  	"back" varchar DEFAULT '← Retour au site',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pilot" ADD COLUMN "sheet_birth" varchar DEFAULT '5 janvier 2012';
  ALTER TABLE "pilot" ADD COLUMN "sheet_birthplace" varchar DEFAULT 'Charleroi';
  ALTER TABLE "pilot" ADD COLUMN "sheet_first_kart" varchar DEFAULT '4 ans';
  ALTER TABLE "pilot" ADD COLUMN "sheet_height" varchar DEFAULT '1m53';
  ALTER TABLE "pilot" ADD COLUMN "sheet_weight" varchar DEFAULT '39 kg';
  ALTER TABLE "pilot" ADD COLUMN "sheet_mentor" varchar DEFAULT 'Jonathan Dhaese';
  ALTER TABLE "pilot" ADD COLUMN "texts_title" varchar DEFAULT 'Le pilote';
  ALTER TABLE "pilot" ADD COLUMN "texts_tab_info" varchar DEFAULT 'Infos générales';
  ALTER TABLE "pilot" ADD COLUMN "texts_tab_race" varchar DEFAULT 'En course';
  ALTER TABLE "stats" ADD COLUMN "texts_title" varchar DEFAULT 'En chiffres';
  ALTER TABLE "zones" ADD COLUMN "texts_title" varchar DEFAULT 'Votre logo
  en piste';
  ALTER TABLE "zones" ADD COLUMN "texts_available" varchar DEFAULT 'Emplacement disponible';
  ALTER TABLE "zones" ADD COLUMN "texts_cta" varchar DEFAULT 'Rejoindre l''équipe';
  ALTER TABLE "zones" ADD COLUMN "texts_roster" varchar DEFAULT 'Partenaires actuels';
  ALTER TABLE "future" ADD COLUMN "texts_kicker" varchar DEFAULT 'La suite';
  ALTER TABLE "future" ADD COLUMN "texts_title" varchar DEFAULT 'La route
  est encore longue';
  ALTER TABLE "future" ADD COLUMN "texts_closing" varchar DEFAULT 'Cette suite,
  écrivons-la ensemble.';
  ALTER TABLE "future" ADD COLUMN "texts_cta" varchar DEFAULT 'Rejoindre l''équipe';
  ALTER TABLE "settings" ADD COLUMN "texts_title" varchar DEFAULT 'Prenez
  le départ
  avec nous';
  ALTER TABLE "settings" ADD COLUMN "texts_message" varchar DEFAULT 'Votre projet';
  ALTER TABLE "settings" ADD COLUMN "texts_submit" varchar DEFAULT 'Envoyer';
  ALTER TABLE "settings" ADD COLUMN "texts_success" varchar DEFAULT 'Message reçu. On vous répond sous 48 heures.';
  ALTER TABLE "settings" ADD COLUMN "menu_pilote" varchar DEFAULT 'Le pilote';
  ALTER TABLE "settings" ADD COLUMN "menu_parcours" varchar DEFAULT 'Le parcours';
  ALTER TABLE "settings" ADD COLUMN "menu_suite" varchar DEFAULT 'La suite';
  ALTER TABLE "settings" ADD COLUMN "menu_chiffres" varchar DEFAULT 'En chiffres';
  ALTER TABLE "settings" ADD COLUMN "menu_courses" varchar DEFAULT 'Courses';
  ALTER TABLE "settings" ADD COLUMN "menu_aventure" varchar DEFAULT 'L''aventure';
  ALTER TABLE "settings" ADD COLUMN "menu_galerie" varchar DEFAULT 'Galerie';
  ALTER TABLE "settings" ADD COLUMN "menu_partenaires" varchar DEFAULT 'Partenaires';
  ALTER TABLE "settings" ADD COLUMN "menu_contact" varchar DEFAULT 'Contact';
  ALTER TABLE "settings" ADD COLUMN "menu_cta" varchar DEFAULT 'Devenir partenaire';
  ALTER TABLE "settings" ADD COLUMN "menu_member" varchar DEFAULT 'Espace partenaires';
  ALTER TABLE "settings" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "settings" ADD COLUMN "seo_description" varchar DEFAULT 'Le parcours, les résultats et les prochaines courses d''Edouard, jeune pilote de karting belge.';
  ALTER TABLE "quotes_items" ADD CONSTRAINT "quotes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "adventure_texts_perks" ADD CONSTRAINT "adventure_texts_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."adventure_texts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "quotes_items_order_idx" ON "quotes_items" USING btree ("_order");
  CREATE INDEX "quotes_items_parent_id_idx" ON "quotes_items" USING btree ("_parent_id");
  CREATE INDEX "adventure_texts_perks_order_idx" ON "adventure_texts_perks" USING btree ("_order");
  CREATE INDEX "adventure_texts_perks_parent_id_idx" ON "adventure_texts_perks" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "career_texts" CASCADE;
  DROP TABLE "quotes_items" CASCADE;
  DROP TABLE "quotes" CASCADE;
  DROP TABLE "races_texts" CASCADE;
  DROP TABLE "adventure_texts_perks" CASCADE;
  DROP TABLE "adventure_texts" CASCADE;
  DROP TABLE "gallery_texts" CASCADE;
  ALTER TABLE "pilot" DROP COLUMN "sheet_birth";
  ALTER TABLE "pilot" DROP COLUMN "sheet_birthplace";
  ALTER TABLE "pilot" DROP COLUMN "sheet_first_kart";
  ALTER TABLE "pilot" DROP COLUMN "sheet_height";
  ALTER TABLE "pilot" DROP COLUMN "sheet_weight";
  ALTER TABLE "pilot" DROP COLUMN "sheet_mentor";
  ALTER TABLE "pilot" DROP COLUMN "texts_title";
  ALTER TABLE "pilot" DROP COLUMN "texts_tab_info";
  ALTER TABLE "pilot" DROP COLUMN "texts_tab_race";
  ALTER TABLE "future" DROP COLUMN "texts_kicker";
  ALTER TABLE "future" DROP COLUMN "texts_title";
  ALTER TABLE "future" DROP COLUMN "texts_closing";
  ALTER TABLE "future" DROP COLUMN "texts_cta";
  ALTER TABLE "stats" DROP COLUMN "texts_title";
  ALTER TABLE "zones" DROP COLUMN "texts_title";
  ALTER TABLE "zones" DROP COLUMN "texts_available";
  ALTER TABLE "zones" DROP COLUMN "texts_cta";
  ALTER TABLE "zones" DROP COLUMN "texts_roster";
  ALTER TABLE "settings" DROP COLUMN "texts_title";
  ALTER TABLE "settings" DROP COLUMN "texts_message";
  ALTER TABLE "settings" DROP COLUMN "texts_submit";
  ALTER TABLE "settings" DROP COLUMN "texts_success";
  ALTER TABLE "settings" DROP COLUMN "menu_pilote";
  ALTER TABLE "settings" DROP COLUMN "menu_parcours";
  ALTER TABLE "settings" DROP COLUMN "menu_suite";
  ALTER TABLE "settings" DROP COLUMN "menu_chiffres";
  ALTER TABLE "settings" DROP COLUMN "menu_courses";
  ALTER TABLE "settings" DROP COLUMN "menu_aventure";
  ALTER TABLE "settings" DROP COLUMN "menu_galerie";
  ALTER TABLE "settings" DROP COLUMN "menu_partenaires";
  ALTER TABLE "settings" DROP COLUMN "menu_contact";
  ALTER TABLE "settings" DROP COLUMN "menu_cta";
  ALTER TABLE "settings" DROP COLUMN "menu_member";
  ALTER TABLE "settings" DROP COLUMN "seo_title";
  ALTER TABLE "settings" DROP COLUMN "seo_description";`)
}
