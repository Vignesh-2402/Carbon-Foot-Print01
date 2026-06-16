import express from 'express';
import { Activity } from '../models/Activity.js';
import { authMiddleware } from '../middleware/auth.js';
import { calculateCarbon } from '../utils/carbonCalculator.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, quantity, date, notes } = req.body;

    const { carbonCalculated, category, unit } = calculateCarbon(type, quantity);

    const activity = new Activity({
      userId: req.userId,
      type,
      category,
      quantity,
      unit,
      carbonCalculated,
      date: date || new Date(),
      notes
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { skip = 0, limit = 50, startDate, endDate, category, type } = req.query;

    const filter = { userId: req.userId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (category) filter.category = category;
    if (type) filter.type = type;

    const activities = await Activity.find(filter)
      .sort({ date: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Activity.countDocuments(filter);

    res.json({ activities, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);
    const allTime = new Date(0);

    const thisMonthCarbon = await Activity.aggregate([
      {
        $match: {
          userId: req.userId,
          date: { $gte: thisMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$carbonCalculated' }
        }
      }
    ]);

    const thisYearCarbon = await Activity.aggregate([
      {
        $match: {
          userId: req.userId,
          date: { $gte: thisYear }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$carbonCalculated' }
        }
      }
    ]);

    const allTimeCarbon = await Activity.aggregate([
      {
        $match: { userId: req.userId }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$carbonCalculated' }
        }
      }
    ]);

    const categoryBreakdown = await Activity.aggregate([
      {
        $match: { userId: req.userId }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$carbonCalculated' }
        }
      }
    ]);

    res.json({
      thisMonth: thisMonthCarbon[0]?.total || 0,
      thisYear: thisYearCarbon[0]?.total || 0,
      allTime: allTimeCarbon[0]?.total || 0,
      byCategory: categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
