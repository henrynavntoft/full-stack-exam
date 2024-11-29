import { Router, Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';



const prisma = new PrismaClient();
const router = Router();

// GET all artworks
//router.get('/', async (req: Request, res: Response) => {
//  try {
//    const artworks = await prisma.artwork.findMany();
//    res.json(artworks);
//  } catch (error) {
//    console.error("Error fetching artworks:", error);
//    res.status(500).json({ error: "Failed to fetch artworks." });
//  }
//});

// GET a batch of artworks, filtered if provided
// GET a batch of artworks, filtered if provided
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { page = 1, search, artist, period } = req.query;
  const pageSize = 5;

  try {
    const userId = req.user?.userId || null; // Use userId if authenticated, otherwise null

    const where: Prisma.ArtworkWhereInput = {
      ...(search && {
        title: {
          contains: search as string,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(artist && {
        artistProductions: {
          some: {
            artist: {
              name: {
                contains: artist as string,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
      }),
      ...(period && {
        period: {
          periodName: {
            startsWith: period as string,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      }),
    };

    const totalArtworks = await prisma.artwork.count({ where });

    const artworks = await prisma.artwork.findMany({
      where,
      skip: (Number(page) - 1) * pageSize,
      take: pageSize,
      include: {
        artistProductions: {
          include: { artist: true },
        },
        period: true,
        favoriteBy: userId ? { where: { id: userId } } : false, // Fetch favoriteBy only if userId exists
      },
    });

    const enrichedArtworks = artworks.map((artwork) => ({
      ...artwork,
      likedByUser: userId ? artwork.favoriteBy.length > 0 : false,
    }));

    res.json({ artworks: enrichedArtworks, totalArtworks });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Failed to fetch artworks.' });
  }
});


// GET artwork by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: parseInt(id) },
      include: {
        artistProductions: {
          include: { artist: true },
        },
        period: true,
        colors: true,
      },
    });

    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found." });
    }

    res.json(artwork);
  } catch (error) {
    console.error("Error fetching artwork details:", error);
    res.status(500).json({ error: "Failed to fetch artwork details." });
  }
});


// POST: Like an artwork
router.post('/:id/like', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId; // Extract userId from the token

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        favoriteArtworks: {
          connect: { id: Number(id) },
        },
      },
    });

    res.status(200).json({ message: 'Artwork liked successfully.' });
  } catch (error) {
    console.error('Error liking artwork:', error);
    res.status(500).json({ error: 'Failed to like artwork.' });
  }
});

// DELETE: Unlike an artwork
router.delete('/:id/like', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId; // Extract userId from the token

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        favoriteArtworks: {
          disconnect: { id: Number(id) },
        },
      },
    });

    res.status(200).json({ message: 'Artwork unliked successfully.' });
  } catch (error) {
    console.error('Error unliking artwork:', error);
    res.status(500).json({ error: 'Failed to unlike artwork.' });
  }
});


// ADMIN FUNCTIONS

// DELETE: Delete an artwork
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const isAdmin = req.user?.role === 'ADMIN';
  if (!isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    // Find users who have the artwork in their favorites
    const usersWithFavorite = await prisma.user.findMany({
      where: {
        favoriteArtworks: {
          some: { id: Number(id) },
        },
      },
    });

    // Disconnect the artwork from each user's favorites
    for (const user of usersWithFavorite) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          favoriteArtworks: {
            disconnect: { id: Number(id) },
          },
        },
      });
    }

    // Delete the artwork
    await prisma.artwork.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Artwork and related favorites deleted successfully.' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ error: 'Failed to delete artwork.' });
  }
});


export default router;