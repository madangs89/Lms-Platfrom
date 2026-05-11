/*
  Warnings:

  - Added the required column `branch_id` to the `Batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `Batches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Batches" ADD COLUMN     "branch_id" TEXT NOT NULL,
ADD COLUMN     "department_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Batches" ADD CONSTRAINT "Batches_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batches" ADD CONSTRAINT "Batches_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
