/*
  Warnings:

  - You are about to drop the column `userImageFileName` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `userImageFileName`,
    ADD COLUMN `userProfilePictureFileName` VARCHAR(191) NULL;
