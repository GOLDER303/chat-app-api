-- CreateTable
CREATE TABLE `_SeenMessages` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SeenMessages_AB_unique`(`A`, `B`),
    INDEX `_SeenMessages_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_SeenMessages` ADD CONSTRAINT `_SeenMessages_A_fkey` FOREIGN KEY (`A`) REFERENCES `Messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SeenMessages` ADD CONSTRAINT `_SeenMessages_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
