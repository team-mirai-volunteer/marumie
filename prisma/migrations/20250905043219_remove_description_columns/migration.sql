/*
  Warnings:

  - You are about to drop the column `description_1` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `description_2` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `description_3` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `description_detail` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."transactions" DROP COLUMN "description_1",
DROP COLUMN "description_2",
DROP COLUMN "description_3",
DROP COLUMN "description_detail";
