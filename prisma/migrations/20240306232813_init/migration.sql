-- CreateTable
CREATE TABLE `Journey_Flight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `journeyId` INTEGER NOT NULL,
    `flightId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Journey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Origin` VARCHAR(191) NOT NULL,
    `Destination` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `FlightCarrier` VARCHAR(191) NOT NULL,
    `FlightNumber` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Flight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Origin` VARCHAR(191) NOT NULL,
    `Destination` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `transportId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Journey_Flight` ADD CONSTRAINT `Journey_Flight_journeyId_fkey` FOREIGN KEY (`journeyId`) REFERENCES `Journey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Journey_Flight` ADD CONSTRAINT `Journey_Flight_flightId_fkey` FOREIGN KEY (`flightId`) REFERENCES `Flight`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flight` ADD CONSTRAINT `Flight_transportId_fkey` FOREIGN KEY (`transportId`) REFERENCES `Transport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
