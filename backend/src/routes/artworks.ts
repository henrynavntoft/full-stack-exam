import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


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

// GET all artworks
router.get('/', async (req: Request, res: Response) => {
  const { page = 1 } = req.query; // Defaults to page 1 if no page is provided
  const pageSize = 5;

  try {
    const totalArtworks = await prisma.artwork.count();

    const artworks = await prisma.artwork.findMany({
      skip: (Number(page) - 1) * pageSize,
      take: pageSize,
    });

    res.json([ artworks, totalArtworks ]);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    res.status(500).json({ error: "Failed to fetch artworks." });
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
router.post('/:id/like', async (req: Request, res: Response) => {
  const { id } = req.params; 
  const { userId } = req.body; 

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
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
router.delete('/:id/like', async (req: Request, res: Response) => {
  const { id } = req.params; 
  const { userId } = req.body; 

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
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


export default router;