-- CreateTable
CREATE TABLE "public"."portfolio_assets" (
    "id" BIGSERIAL NOT NULL,
    "political_organization_id" BIGINT NOT NULL,
    "snapshot_date" DATE NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "amount" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "portfolio_assets_political_organization_id_snapshot_date_idx" ON "public"."portfolio_assets"("political_organization_id", "snapshot_date" DESC);

-- AddForeignKey
ALTER TABLE "public"."portfolio_assets" ADD CONSTRAINT "portfolio_assets_political_organization_id_fkey" FOREIGN KEY ("political_organization_id") REFERENCES "public"."political_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
