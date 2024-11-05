// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret') as { userId: number; role: string };
    req.user = decoded; // Add decoded token data (user info) to the request object
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export { authenticateToken, AuthenticatedRequest };