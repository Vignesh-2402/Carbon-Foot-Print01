import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['car', 'bus', 'train', 'flight', 'electricity', 'gas', 'heating', 'meat', 'vegetarian', 'vegan', 'shopping', 'waste'],
    required: true
  },
  category: {
    type: String,
    enum: ['transportation', 'energy', 'food', 'shopping', 'waste'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['km', 'hours', 'kWh', 'm3', 'kg', 'units'],
    required: true
  },
  carbonCalculated: {
    type: Number,
    required: true,
    description: 'Carbon in kg CO2e'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Activity = mongoose.model('Activity', activitySchema);
