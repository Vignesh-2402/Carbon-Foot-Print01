import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  target: {
    type: Number,
    required: true,
    description: 'Target carbon reduction in kg CO2e'
  },
  category: {
    type: String,
    enum: ['transportation', 'energy', 'food', 'shopping', 'waste', 'overall'],
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const challengeParticipationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  currentProgress: {
    type: Number,
    default: 0,
    description: 'Current carbon reduction for this challenge'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

export const Challenge = mongoose.model('Challenge', challengeSchema);
export const ChallengeParticipation = mongoose.model('ChallengeParticipation', challengeParticipationSchema);
