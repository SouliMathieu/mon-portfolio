-- CreateTable
CREATE TABLE `HeroContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleFr` VARCHAR(191) NOT NULL,
    `roleEn` VARCHAR(191) NOT NULL,
    `taglineFr` VARCHAR(191) NOT NULL,
    `taglineEn` VARCHAR(191) NOT NULL,
    `descriptionFr` TEXT NOT NULL,
    `descriptionEn` TEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
