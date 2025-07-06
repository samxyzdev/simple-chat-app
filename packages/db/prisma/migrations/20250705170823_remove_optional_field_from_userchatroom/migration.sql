/*
  Warnings:

  - Made the column `userId` on table `UserChatRoom` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chatRoomId` on table `UserChatRoom` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserChatRoom" DROP CONSTRAINT "UserChatRoom_chatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "UserChatRoom" DROP CONSTRAINT "UserChatRoom_userId_fkey";

-- AlterTable
ALTER TABLE "UserChatRoom" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "chatRoomId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "UserChatRoom" ADD CONSTRAINT "UserChatRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatRoom" ADD CONSTRAINT "UserChatRoom_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
