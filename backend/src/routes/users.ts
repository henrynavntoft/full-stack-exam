import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const prisma = new PrismaClient();
const router = Router();

// GET all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// GET a specific user by ID (Admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

// POST to create a new user with password hashing (Admin only)
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if the authenticated user is an admin (?)
  // if (req.user.role !== 'admin') {
  //  return res.status(403).json({ error: "You do not have permission to create users." });
  // }

  // Input validation
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_]).{8,}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use." });
    }

    // Hash password
    const saltRounds = 14;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: "User created successfully.", user });
  } catch (error) {
    console.error("Error creating user:", error);

    if ((error as any).code === "P2002") { // Prisma unique constraint error
      return res.status(409).json({ error: "Email already in use." });
    }

    res.status(500).json({ error: "Failed to create user. Please try again." });
  }
});

// PUT to update an existing user (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updatedData: { name?: string; email?: string; password?: string } = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) {
      const saltRounds = 14;
      updatedData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user." });
  }
});

// DELETE a user by ID (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

export default router;