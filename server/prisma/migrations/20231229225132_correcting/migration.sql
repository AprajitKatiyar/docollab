/*
  Warnings:

  - Made the column `projectId` on table `Doc` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `Flow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Doc" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Flow" ALTER COLUMN "projectId" SET NOT NULL;
