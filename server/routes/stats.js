import express from 'express';
import { Activity } from '../models/Activity.js';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/peers', authMiddleware, async (req, res) => {
  try {
    const userStats = await Activity.aggregate([
      {
        $group: {
          _id: '$userId',
          totalCarbon: { $sum: '$carbonCalculated' },
          activitiesCount: { $sum: 1 }
        }
      }
    ]);

    const totalCarbon = userStats.reduce((sum, stat) => sum + stat.totalCarbon, 0);
    const avgCarbon = totalCarbon / userStats.length;

    const userActivity = await Activity.aggregate([
      {
        $match: { userId: req.userId }
      },
      {
        $group: {
          _id: null,
          totalCarbon: { $sum: '$carbonCalculated' }
        }
      }
    ]);

    const userCarbon = userActivity[0]?.totalCarbon || 0;

    res.json({
      userCarbon,
      averageCarbon: avgCarbon,
      betterThanAverage: userCarbon < avgCarbon,
      percentileDifference: ((userCarbon - avgCarbon) / avgCarbon * 100).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Activity.aggregate([
      {
        $group: {
          _id: '$userId',
          totalCarbon: { $sum: '$carbonCalculated' },
          activitiesCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalCarbon: -1 }
      },
      {
        $limit: 50
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/trends', authMiddleware, async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const dailyTrends = await Activity.aggregate([
      {
        $match: {
          userId: req.userId,
          date: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          dailyCarbon: { $sum: '$carbonCalculated' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json(dailyTrends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
