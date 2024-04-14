/*
  Warnings:

  - You are about to drop the column `description` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Room` table. All the data in the column will be lost.
  - Added the required column `description` to the `Query` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `Query` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_resolverId_fkey";

-- AlterTable
ALTER TABLE "Query" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "question" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "description",
DROP COLUMN "image_url",
DROP COLUMN "question",
ALTER COLUMN "resolverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_resolverId_fkey" FOREIGN KEY ("resolverId") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
