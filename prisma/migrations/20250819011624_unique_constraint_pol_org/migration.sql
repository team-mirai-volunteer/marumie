/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `political_organizations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `political_organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."political_organizations" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "political_organizations_slug_key" ON "public"."political_organizations"("slug");
