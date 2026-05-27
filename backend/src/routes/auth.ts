import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
      res.status(400).json({ message: 'userId, password, and role are required.' });
      return;
    }

    const user = await User.findOne({ userId });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    if (user.role !== role) {
      res.status(401).json({ message: 'Role mismatch. Please select the correct role.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign(
      { userId: user.userId, role: user.role, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        userId: user.userId,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

export default router;
