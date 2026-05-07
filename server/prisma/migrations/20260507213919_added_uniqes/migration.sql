/*
  Warnings:

  - A unique constraint covering the columns `[user_id,role]` on the table `UserRoles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `batch_id` to the `CoordinatorAssignments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudentAcademicStatus" DROP CONSTRAINT "StudentAcademicStatus_promoted_from_cycle_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRoles" DROP CONSTRAINT "UserRoles_granted_by_fkey";

-- AlterTable
ALTER TABLE "CoordinatorAssignments" ADD COLUMN     "batch_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StudentAcademicStatus" ALTER COLUMN "promoted_from_cycle_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserRoles" ALTER COLUMN "granted_by" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Branch_department_id_idx" ON "Branch"("department_id");

-- CreateIndex
CREATE INDEX "Department_hod_id_idx" ON "Department"("hod_id");

-- CreateIndex
CREATE INDEX "UserRoles_role_idx" ON "UserRoles"("role");

-- CreateIndex
CREATE INDEX "UserRoles_user_id_role_idx" ON "UserRoles"("user_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoles_user_id_role_key" ON "UserRoles"("user_id", "role");

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAcademicStatus" ADD CONSTRAINT "StudentAcademicStatus_promoted_from_cycle_id_fkey" FOREIGN KEY ("promoted_from_cycle_id") REFERENCES "AcademicCycles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorAssignments" ADD CONSTRAINT "CoordinatorAssignments_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "Batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
