/*
  Warnings:

  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ChatToUser` DROP FOREIGN KEY `_ChatToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ChatToUser` DROP FOREIGN KEY `_ChatToUser_B_fkey`;

-- DropTable
DROP TABLE `_ChatToUser`;

-- CreateTable
CREATE TABLE `_ChatsAdministrators` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ChatsAdministrators_AB_unique`(`A`, `B`),
    INDEX `_ChatsAdministrators_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ChatsUsers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ChatsUsers_AB_unique`(`A`, `B`),
    INDEX `_ChatsUsers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ChatsAdministrators` ADD CONSTRAINT `_ChatsAdministrators_A_fkey` FOREIGN KEY (`A`) REFERENCES `Chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ChatsAdministrators` ADD CONSTRAINT `_ChatsAdministrators_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ChatsUsers` ADD CONSTRAINT `_ChatsUsers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ChatsUsers` ADD CONSTRAINT `_ChatsUsers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
