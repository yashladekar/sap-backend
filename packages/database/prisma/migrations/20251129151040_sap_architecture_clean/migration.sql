/*
  Warnings:

  - You are about to drop the column `client_file_s3` on the `runs` table. All the data in the column will be lost.
  - You are about to drop the column `notes_file_s3` on the `runs` table. All the data in the column will be lost.
  - You are about to drop the `client_components` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `note_applicability_results` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `note_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sap_batch_notes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[month_key]` on the table `sap_note_batches` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `batch_id` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `system_id` to the `runs` table without a default value. This is not possible if the table is not empty.
  - Made the column `started_at` on table `runs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "note_applicability_results" DROP CONSTRAINT "note_applicability_results_client_component_id_fkey";

-- DropForeignKey
ALTER TABLE "note_applicability_results" DROP CONSTRAINT "note_applicability_results_note_id_fkey";

-- DropForeignKey
ALTER TABLE "note_applicability_results" DROP CONSTRAINT "note_applicability_results_run_id_fkey";

-- DropForeignKey
ALTER TABLE "note_details" DROP CONSTRAINT "note_details_note_id_fkey";

-- DropForeignKey
ALTER TABLE "sap_batch_notes" DROP CONSTRAINT "sap_batch_notes_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "sap_batch_notes" DROP CONSTRAINT "sap_batch_notes_note_id_fkey";

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "batch_id" TEXT NOT NULL,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "priority" TEXT,
ADD COLUMN     "released_on" TIMESTAMP(3),
ALTER COLUMN "raw_content_s3" DROP NOT NULL;

-- AlterTable
ALTER TABLE "runs" DROP COLUMN "client_file_s3",
DROP COLUMN "notes_file_s3",
ADD COLUMN     "system_id" TEXT NOT NULL,
ALTER COLUMN "started_at" SET NOT NULL,
ALTER COLUMN "started_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sap_note_batches" ALTER COLUMN "notes_file_s3" DROP NOT NULL;

-- DropTable
DROP TABLE "client_components";

-- DropTable
DROP TABLE "note_applicability_results";

-- DropTable
DROP TABLE "note_details";

-- DropTable
DROP TABLE "sap_batch_notes";

-- CreateTable
CREATE TABLE "client_systems" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installed_components" (
    "id" TEXT NOT NULL,
    "system_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "support_package" TEXT,
    "spLevel" INTEGER NOT NULL,

    CONSTRAINT "installed_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_validities" (
    "id" TEXT NOT NULL,
    "note_id" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "minSpLevel" INTEGER NOT NULL,
    "maxSpLevel" INTEGER NOT NULL,

    CONSTRAINT "note_validities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicability_results" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "note_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "applicability_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sap_note_batches_month_key_key" ON "sap_note_batches"("month_key");

-- AddForeignKey
ALTER TABLE "client_systems" ADD CONSTRAINT "client_systems_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installed_components" ADD CONSTRAINT "installed_components_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "client_systems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "sap_note_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_validities" ADD CONSTRAINT "note_validities_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("note_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runs" ADD CONSTRAINT "runs_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "client_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicability_results" ADD CONSTRAINT "applicability_results_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicability_results" ADD CONSTRAINT "applicability_results_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("note_id") ON DELETE RESTRICT ON UPDATE CASCADE;
