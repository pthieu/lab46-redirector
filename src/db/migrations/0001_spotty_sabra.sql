DROP TABLE "knex_migrations";
DROP TABLE "knex_migrations_lock";
ALTER TABLE "urls" ALTER COLUMN "created_at" SET DEFAULT now();
ALTER TABLE "urls" ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "events" ALTER COLUMN "created_at" SET DEFAULT now();
ALTER TABLE "events" ALTER COLUMN "updated_at" SET DEFAULT now();