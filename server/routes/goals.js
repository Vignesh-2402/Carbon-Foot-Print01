import express from 'express';
import { Goal } from '../models/Goal.js';
import { Activity } from '../models/Activity.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, targetCarbon, deadline, category } = req.body;

    const goal = new Goal({
      userId: req.userId,
      title,
      targetCarbon,
      deadline,
      category
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ deadline: 1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const activities = await Activity.find({
      userId: req.userId,
      category: goal.category,
      date: { $gte: goal.createdAt }
    });

    const currentCarbon = activities.reduce((sum, act) => sum + act.carbonCalculated, 0);
    const progress = Math.min((currentCarbon / goal.targetCarbon) * 100, 100);

    res.json({
      goal,
      currentCarbon,
      progress,
      targetCarbon: goal.targetCarbon,
      remaining: Math.max(goal.targetCarbon - currentCarbon, 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, targetCarbon, deadline, category, status } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, targetCarbon, deadline, category, status, updatedAt: Date.now() },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
