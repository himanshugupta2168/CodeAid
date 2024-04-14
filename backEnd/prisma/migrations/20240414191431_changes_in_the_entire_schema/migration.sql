/*
  Warnings:

  - You are about to drop the column `roomId` on the `Query` table. All the data in the column will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Query" DROP CONSTRAINT "Query_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_resolverId_fkey";

-- AlterTable
ALTER TABLE "Query" DROP COLUMN "roomId",
ADD COLUMN     "resolverId" INTEGER,
ADD COLUMN     "room_id" TEXT;

-- DropTable
DROP TABLE "Room";

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_resolverId_fkey" FOREIGN KEY ("resolverId") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
