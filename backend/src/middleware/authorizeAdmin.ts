// import { Request, Response, NextFunction } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Assuming you have a user ID in `req.userId` after authentication
//     const userId = req.userId; // You might get this from a decoded JWT or session
    
//     if (!userId) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user || user.role !== 'ADMIN') {
//       return res.status(403).json({ error: 'Access denied. Admins only.' });
//     }

//     next(); // User is authorized, proceed to the next middleware
//   } catch (error) {
//     console.error('Authorization error:', error);
//     res.status(500).json({ error: 'Failed to authorize user.' });
//   }
// };