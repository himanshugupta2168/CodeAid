/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `forgetPassword` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_ownerId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "forgetPassword";

-- CreateTable
CREATE TABLE "Query" (
    "query_id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "image_url" TEXT,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("query_id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "reply_id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "commentedUserId" INTEGER NOT NULL,
    "queryId" INTEGER,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("reply_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Query_ownerId_key" ON "Query"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Reply_reply_id_key" ON "Reply"("reply_id");

-- CreateIndex
CREATE UNIQUE INDEX "Reply_commentedUserId_key" ON "Reply"("commentedUserId");

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_commentedUserId_fkey" FOREIGN KEY ("commentedUserId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("query_id") ON DELETE SET NULL ON UPDATE CASCADE;
