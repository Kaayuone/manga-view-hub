/*
  Warnings:

  - Added the required column `cover` to the `LibraryTitle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `LibraryTitle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LibraryTitle" ADD COLUMN     "cover" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
