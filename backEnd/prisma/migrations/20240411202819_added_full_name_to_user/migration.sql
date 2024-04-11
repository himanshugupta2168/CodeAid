/*
  Warnings:

  - Added the required column `fullName` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "fullName" TEXT NOT NULL;
