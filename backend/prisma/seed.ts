import { PrismaClient, UserRole } from '@prisma/client';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import https from 'https'; 

const prisma = new PrismaClient();

// Define the types for the SMK API response
interface ArtworkItem {
  titles?: { title: string }[];
  production?: {
    creator: string;
    creator_date_of_birth?: string;
    creator_date_of_death?: string;
    creator_nationality?: string;
    creator_gender?: string;
  }[];
  colors?: string[];
  image_thumbnail?: string;
  production_date?: {
    start?: string;
    end?: string;
    period?: string;
  }[];
}

async function main() {
  // 1. Create an Admin User with a hashed password
  const hashedPassword = await bcrypt.hash('Securepassword12323!', 10);
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword, // Hashed password for security
      role: UserRole.ADMIN,
    },
  });

  // 2. Fetch Artwork Data from SMK API with SSL bypass
  const smkApiUrl = 'https://api.smk.dk/api/v1/art/search/?keys=*&filters=[has_image:true]&offset=0&rows=50';

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Bypass SSL certificate validation
  });

  const response = await axios.get<{ items: ArtworkItem[] }>(smkApiUrl, {
  httpsAgent, // Add the agent
} as any); // Type assertion here to avoid TypeScript error
  const artworks = response.data.items;

  // 3. Insert Artworks and Artists into Database
  for (const item of artworks) {
    const { titles, production, colors, image_thumbnail: imageUrl, production_date: productionDate } = item;

    // Insert Artist(s) if they don't exist, and collect their IDs
    const artistIds: number[] = [];
    for (const artistData of production || []) {
      if (artistData.creator) { // Check if artist data exists
        const artist = await prisma.artist.upsert({
          where: { name: artistData.creator },
          update: {},
          create: {
            name: artistData.creator,
            birthDate: artistData.creator_date_of_birth ? new Date(artistData.creator_date_of_birth) : null,
            deathDate: artistData.creator_date_of_death ? new Date(artistData.creator_date_of_death) : null,
            nationality: artistData.creator_nationality,
            gender: artistData.creator_gender,
          },
        });
        artistIds.push(artist.id);
      }
    }

    // Insert Artwork with associated colors and production period if available
    const createdArtwork = await prisma.artwork.create({
      data: {
        title: titles?.[0]?.title || 'Untitled',
        description: titles?.[0]?.title || null,
        createdAt: new Date(),
        imageUrl,

        // Insert production period if available
        period: productionDate
          ? {
              create: {
                startDate: new Date(productionDate[0]?.start || '1500-01-01'),
                endDate: new Date(productionDate[0]?.end || '1550-01-01'),
                periodName: productionDate[0]?.period || 'Unknown Period',
              },
            }
          : undefined,

        // Insert associated colors
        colors: {
          create: colors?.map((color: string) => ({ color })),
        },
      },
    });

    // Insert Productions (linking Artists to Artwork)
    for (const artistId of artistIds) {
      await prisma.production.create({
        data: {
          artworkId: createdArtwork.id,
          artistId,
        },
      });
    }
  }

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });