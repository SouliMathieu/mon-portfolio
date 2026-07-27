/*
  Warnings:

  - A unique constraint covering the columns `[name,skillBlockId]` on the table `Technology` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Technology_name_skillBlockId_key` ON `Technology`(`name`, `skillBlockId`);
