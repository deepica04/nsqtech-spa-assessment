import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/authenticate';
import Record from '../models/Record';

const router = Router();

// Utility: artificial delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// GET /api/records?delay=2000
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const delayMs = parseInt(req.query['delay'] as string) || 0;

    // Simulate async processing delay (as required by the assessment)
    if (delayMs > 0) {
      await sleep(Math.min(delayMs, 10000)); // cap at 10 seconds
    }

    let records;

    if (req.user?.role === 'Admin') {
      // Admin sees ALL records
      records = await Record.find().sort({ createdAt: -1 });
    } else {
      // General User sees only their assigned records
      records = await Record.find({ assignedTo: req.user?.userId }).sort({ createdAt: -1 });
    }

    res.json({
      role: req.user?.role,
      totalCount: records.length,
      records,
    });
  } catch {
    res.status(500).json({ message: 'Server error fetching records.' });
  }
});

export default router;
