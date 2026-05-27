import { Router, Request, Response } from 'express';
import { authenticate, authorizeAdmin, AuthRequest } from '../middleware/authenticate';
import User from '../models/User';

const router = Router();

// GET /api/admin/users — list all users (Admin only)
router.get('/users', authenticate, authorizeAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ totalCount: users.length, users });
  } catch {
    res.status(500).json({ message: 'Server error fetching users.' });
  }
});

// PUT /api/admin/users/:userId — update user role (Admin only)
router.put('/users/:userId', authenticate, authorizeAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role, department, name } = req.body;

    if (role && !['General User', 'Admin'].includes(role)) {
      res.status(400).json({ message: 'Invalid role value.' });
      return;
    }

    const updated = await User.findOneAndUpdate(
      { userId },
      { ...(role && { role }), ...(department && { department }), ...(name && { name }) },
      { new: true }
    ).select('-password');

    if (!updated) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.json({ message: 'User updated successfully.', user: updated });
  } catch {
    res.status(500).json({ message: 'Server error updating user.' });
  }
});

// DELETE /api/admin/users/:userId — delete a user (Admin only)
router.delete('/users/:userId', authenticate, authorizeAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (req.user?.userId === userId) {
      res.status(400).json({ message: 'You cannot delete your own account.' });
      return;
    }

    const deleted = await User.findOneAndDelete({ userId });

    if (!deleted) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.json({ message: 'User deleted successfully.' });
  } catch {
    res.status(500).json({ message: 'Server error deleting user.' });
  }
});

// POST /api/admin/users — create new user (Admin only)
router.post('/users', authenticate, authorizeAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, email, password, role, department } = _req.body;

    if (!userId || !name || !email || !password) {
      res.status(400).json({ message: 'userId, name, email, and password are required.' });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ userId }, { email }] });
    if (existingUser) {
      res.status(409).json({ message: 'User with this ID or email already exists.' });
      return;
    }

    const newUser = new User({ userId, name, email, password, role: role || 'General User', department: department || 'General' });
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully.',
      user: { userId, name, email, role: newUser.role, department: newUser.department },
    });
  } catch {
    res.status(500).json({ message: 'Server error creating user.' });
  }
});

export default router;
