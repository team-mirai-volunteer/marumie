-- CreateEnum
CREATE TYPE "public"."TransactionDirection" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "public"."Politician" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Politician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" SERIAL NOT NULL,
    "politicianId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "value" INTEGER NOT NULL,
    "direction" "public"."TransactionDirection" NOT NULL,
    "method" TEXT,
    "category" TEXT,
    "category1" TEXT,
    "category2" TEXT,
    "counterparty" TEXT,
    "inflowType" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Politician_slug_key" ON "public"."Politician"("slug");

-- CreateIndex
CREATE INDEX "Transaction_politicianId_direction_idx" ON "public"."Transaction"("politicianId", "direction");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "public"."Transaction"("date");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "public"."Politician"("id") ON DELETE CASCADE ON UPDATE CASCADE;
