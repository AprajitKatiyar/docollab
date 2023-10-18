/*
  Warnings:

  - You are about to drop the `Doc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Doc" DROP CONSTRAINT "Doc_authorId_fkey";

-- DropTable
DROP TABLE "Doc";
