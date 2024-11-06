import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const router = Router();

// GET all artworks
router.get('/', async (req: Request, res: Response) => {
  try {
    const artworks = await prisma.artwork.findMany();
    res.json(artworks);
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


export default router;