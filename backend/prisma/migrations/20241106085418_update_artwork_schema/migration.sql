/*
  Warnings:

  - You are about to drop the column `artistId` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Artwork` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_createdById_fkey";

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "deathDate" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT;

-- AlterTable
ALTER TABLE "Artwork" DROP COLUMN "artistId",
DROP COLUMN "createdById",
DROP COLUMN "imageUrl";

-- CreateTable
CREATE TABLE "Production" (
    "id" SERIAL NOT NULL,
    "artworkId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,
    "creatorRole" TEXT,

    CONSTRAINT "Production_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionPeriod" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "periodName" TEXT,
    "artworkId" INTEGER,

    CONSTRAINT "ProductionPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtworkColor" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,
    "artworkId" INTEGER NOT NULL,

    CONSTRAINT "ArtworkColor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductionPeriod_artworkId_key" ON "ProductionPeriod"("artworkId");

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionPeriod" ADD CONSTRAINT "ProductionPeriod_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkColor" ADD CONSTRAINT "ArtworkColor_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
