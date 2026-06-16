import express from 'express';
import { Challenge, ChallengeParticipation } from '../models/Challenge.js';
import { Activity } from '../models/Activity.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, startDate, endDate, target, category } = req.body;

    const challenge = new Challenge({
      name,
      description,
      startDate,
      endDate,
      target,
      category
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find({ status: 'active' });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const existingParticipation = await ChallengeParticipation.findOne({
      userId: req.userId,
      challengeId: req.params.id
    });

    if (existingParticipation) {
      return res.status(400).json({ message: 'Already participating in this challenge' });
    }

    const participation = new ChallengeParticipation({
      userId: req.userId,
      challengeId: req.params.id
    });

    await participation.save();
    res.status(201).json(participation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/leaderboard', async (req, res) => {
  try {
    const participations = await ChallengeParticipation.aggregate([
      {
        $match: { challengeId: req.params.id }
      },
      {
        $sort: { currentProgress: -1 }
      },
      {
        $limit: 100
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]);

    res.json(participations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/my-progress', authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    const participation = await ChallengeParticipation.findOne({
      userId: req.userId,
      challengeId: req.params.id
    });

    if (!participation) {
      return res.status(404).json({ message: 'Not participating in this challenge' });
    }

    const activities = await Activity.find({
      userId: req.userId,
      category: challenge.category,
      date: { $gte: challenge.startDate, $lte: challenge.endDate }
    });

    const progress = activities.reduce((sum, act) => sum + act.carbonCalculated, 0);
    const targetMet = progress >= challenge.target;

    res.json({
      challenge,
      participation,
      progress,
      target: challenge.target,
      targetMet
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
