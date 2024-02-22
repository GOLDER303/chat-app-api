-- DropForeignKey
ALTER TABLE `Messages` DROP FOREIGN KEY `messages_chatId_fkey`;

-- DropForeignKey
ALTER TABLE `Messages` DROP FOREIGN KEY `messages_senderId_fkey`;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Users` RENAME INDEX `users_email_key` TO `Users_email_key`;
