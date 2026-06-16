import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  targetCarbon: {
    type: Number,
    required: true,
    description: 'Target carbon in kg CO2e'
  },
  currentCarbon: {
    type: Number,
    default: 0,
    description: 'Current carbon tracked towards goal'
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['transportation', 'energy', 'food', 'shopping', 'waste', 'overall'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Goal = mongoose.model('Goal', goalSchema);
