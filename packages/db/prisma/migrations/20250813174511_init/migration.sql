/*
  Warnings:

  - You are about to drop the column `chatRoomName` on the `ChatRoom` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uniqueRoomId]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueRoomId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ChatRoom_roomName_key";

-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN "chatRoomName",
ADD COLUMN     "uniqueRoomId" TEXT NOT NULL,
ALTER COLUMN "roomName" SET DEFAULT 'system';

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_uniqueRoomId_key" ON "ChatRoom"("uniqueRoomId");
