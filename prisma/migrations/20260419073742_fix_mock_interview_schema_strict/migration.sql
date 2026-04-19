/*
  Warnings:

  - The `status` column on the `MockSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `MockSessionQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `primaryTag` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[submissionId]` on the table `MockSessionQuestion` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `company` on the `MockSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `difficulty` on the `MockSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Company" AS ENUM ('GOOGLE', 'AMAZON', 'MICROSOFT');

-- CreateEnum
CREATE TYPE "MockSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'TIMED_OUT');

-- CreateEnum
CREATE TYPE "MockQuestionStatus" AS ENUM ('PENDING', 'SOLVED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "PrimaryTag" AS ENUM ('Array', 'String', 'SlidingWindow', 'TwoPointers', 'BinarySearch', 'Tree', 'Graph', 'DynamicProgramming', 'Stack', 'HashMap', 'LinkedList', 'Recursion');

-- AlterTable
ALTER TABLE "MockSession" DROP COLUMN "company",
ADD COLUMN     "company" "Company" NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "MockSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "MockSessionQuestion" DROP COLUMN "status",
ADD COLUMN     "status" "MockQuestionStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "primaryTag",
ADD COLUMN     "primaryTag" "PrimaryTag" NOT NULL DEFAULT 'Array';

-- CreateIndex
CREATE INDEX "MockSession_status_idx" ON "MockSession"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MockSessionQuestion_submissionId_key" ON "MockSessionQuestion"("submissionId");

-- CreateIndex
CREATE INDEX "MockSessionQuestion_problemId_idx" ON "MockSessionQuestion"("problemId");

-- CreateIndex
CREATE INDEX "Problem_primaryTag_idx" ON "Problem"("primaryTag");

-- AddForeignKey
ALTER TABLE "MockSessionQuestion" ADD CONSTRAINT "MockSessionQuestion_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
