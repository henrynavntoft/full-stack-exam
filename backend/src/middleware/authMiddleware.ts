import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // The secret should be stored in an environment variable
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not defined in the environment variables');
    }

    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as { userId: number; role: string };
    req.user = decoded; // Add decoded token data (user info) to the request object
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export { authenticateToken, AuthenticatedRequest };