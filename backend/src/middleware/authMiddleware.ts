import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  } | null;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    // Allow unauthenticated access for specific routes
    if (req.path === '/me' || req.path === '/') {
      req.user = null; // Indicate unauthenticated user
      return next();
    }
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Decode the token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not defined in the environment variables');
    }

    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as { userId: number; role: string };
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    // Allow unauthenticated access for specific routes if token is invalid
    if (req.path === '/me' || req.path === '/') {
      req.user = null; // Treat as guest
      return next();
    }
    res.status(403).json({ error: 'Invalid token' });
  }
};

export { authenticateToken, AuthenticatedRequest };