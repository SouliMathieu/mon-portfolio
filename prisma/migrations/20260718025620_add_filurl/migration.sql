/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `technology` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `certification` ADD COLUMN `fileUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `technology` DROP COLUMN `fileUrl`;
