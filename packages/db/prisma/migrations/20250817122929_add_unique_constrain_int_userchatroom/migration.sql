/*
  Warnings:

  - A unique constraint covering the columns `[userId,chatRoomId]` on the table `UserChatRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserChatRoom_userId_chatRoomId_key" ON "UserChatRoom"("userId", "chatRoomId");
