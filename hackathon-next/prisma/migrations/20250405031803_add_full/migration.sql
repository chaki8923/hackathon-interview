/*
  Warnings:

  - Added the required column `fullContent` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "fullContent" TEXT NOT NULL,
ALTER COLUMN "subContent" DROP NOT NULL;
