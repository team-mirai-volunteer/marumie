-- CreateTable
CREATE TABLE "Politician" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "politicianId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "value" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "method" TEXT,
    "category" TEXT,
    "category1" TEXT,
    "category2" TEXT,
    "counterparty" TEXT,
    "inflowType" TEXT,
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "Politician" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Politician_slug_key" ON "Politician"("slug");

-- CreateIndex
CREATE INDEX "Transaction_politicianId_direction_idx" ON "Transaction"("politicianId", "direction");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");
