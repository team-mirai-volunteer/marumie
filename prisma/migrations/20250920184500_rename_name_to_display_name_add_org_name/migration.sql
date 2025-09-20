-- AlterTable
ALTER TABLE "political_organizations" RENAME COLUMN "name" TO "display_name";

-- AlterTable
ALTER TABLE "political_organizations" ADD COLUMN "org_name" VARCHAR(255);