-- DropForeignKey
ALTER TABLE "ArtworkColor" DROP CONSTRAINT "ArtworkColor_artworkId_fkey";

-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_artworkId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionPeriod" DROP CONSTRAINT "ProductionPeriod_artworkId_fkey";

-- AddForeignKey
ALTER TABLE "ProductionPeriod" ADD CONSTRAINT "ProductionPeriod_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkColor" ADD CONSTRAINT "ArtworkColor_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;
