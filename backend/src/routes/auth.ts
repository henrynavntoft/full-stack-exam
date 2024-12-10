import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { generateToken } from '../utils/tokenGenerator';
import { transporter } from '../utils/emailGenerator';


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
  httpOnly: true, // Prevent JavaScript access
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  maxAge: 3600000, // 1 hour
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-origin in production
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

// Logout
router.post('/logout', (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,      // Matches the cookie attributes
      secure: process.env.NODE_ENV === 'production', // Matches the `secure` attribute
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-origin in production
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Logout failed. Please try again.' });
  }
});

// Get user details
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    // Respond as guest for unauthenticated users
    return res.status(200).json(null);
  }

  console.log('Decoded user from token:', req.user);

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      console.error('User not found for ID:', req.user.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User fetched successfully:', user);
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Forgot Password - Generate Token and Send Email
router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate the token
    const token = generateToken();

    // Set token expiration
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiration

    // Store the token in the database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Create a reset password URL with the token
    const resetUrl = `${process.env.CORS_ORIGINS}/resetpassword?token=${token}`;

   // leaving this for you to test it with your own environment variables 
   // console.log('Email User:', process.env.EMAIL_USER);
   // console.log('Email Pass:', process.env.EMAIL_PASSWORD);
   // console.log("email sent to: ", email);

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. The link will expire in 1 hour.</p>`,
    });

    res.json({ message: 'Reset password email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending reset password email' });
  }
});

// Reset Password - Validate Token and Update Password
router.post('/resetpassword', async (req, res) => {
  try {
      const { token, password, confirmPassword } = req.body;

      // Find the reset token
      const passwordResetToken = await prisma.passwordResetToken.findUnique({
          where: { token },
      });

      if (!passwordResetToken) {
          return res.status(404).json({ error: 'Invalid or expired token' });
      }

      // Fetch the user associated with the token
      const user = await prisma.user.findUnique({
          where: { id: passwordResetToken.userId },
      });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      if (password !== confirmPassword) {
          return res.status(400).json({ error: 'Passwords do not match' });
      }

      // Hash and update the password
      const saltRounds = 14;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
      });

      // Delete the token
      await prisma.passwordResetToken.delete({
          where: { token },
      });

      res.json({ message: 'Password reset successful' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error resetting password' });
  }
});



export default router;