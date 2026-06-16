import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['transportation', 'energy', 'food', 'shopping', 'waste'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  co2Savings: {
    type: Number,
    description: 'Annual CO2 savings in kg CO2e'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  implementation: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Tip = mongoose.model('Tip', tipSchema);
