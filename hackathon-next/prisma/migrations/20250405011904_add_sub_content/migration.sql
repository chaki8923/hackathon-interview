/*
  Warnings:

  - Added the required column `subContent` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "subContent" TEXT NOT NULL;
