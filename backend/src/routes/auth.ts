import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const prisma = new PrismaClient();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {

    // check if body is empty
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // check if password is valid
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!-^&+=_]).{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character',
      });
    }
    
    // check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token 
    // The secret should be stored in an environment variable
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not defined in the environment variables');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, 
      secret, { algorithm: "HS256", expiresIn: '1h' });

    // insert jwt token into a cookie to make it more secure
    res.cookie('token', token, {
      httpOnly: true,      // now javascript cannot access it
      secure: process.env.NODE_ENV === 'production', // rely on https when in production
      maxAge: 3600000,     // 1 hour
      sameSite: 'strict',  // change to lax if we want cross-site cookie usage
    });
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// delete the json web token when the user logs out
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;