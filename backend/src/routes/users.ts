import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/authenticate';
import User from '../models/User';

const router = Router();

// GET /api/users/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ userId: req.user?.userId }).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Server error fetching user details.' });
  }
});

export default router;
