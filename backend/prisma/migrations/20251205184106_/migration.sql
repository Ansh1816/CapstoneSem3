-- AlterTable
ALTER TABLE `Gem` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'Other',
    MODIFY `images` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `SavedGem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `gemId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SavedGem_userId_gemId_key`(`userId`, `gemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SavedGem` ADD CONSTRAINT `SavedGem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedGem` ADD CONSTRAINT `SavedGem_gemId_fkey` FOREIGN KEY (`gemId`) REFERENCES `Gem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
