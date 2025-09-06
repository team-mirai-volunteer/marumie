-- CreateTable
CREATE TABLE "public"."balance_snapshots" (
    "id" BIGSERIAL NOT NULL,
    "political_organization_id" BIGINT NOT NULL,
    "snapshot_date" DATE NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "balance_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "balance_snapshots_political_organization_id_snapshot_date_u_idx" ON "public"."balance_snapshots"("political_organization_id", "snapshot_date" DESC, "updated_at" DESC);

-- AddForeignKey
ALTER TABLE "public"."balance_snapshots" ADD CONSTRAINT "balance_snapshots_political_organization_id_fkey" FOREIGN KEY ("political_organization_id") REFERENCES "public"."political_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
