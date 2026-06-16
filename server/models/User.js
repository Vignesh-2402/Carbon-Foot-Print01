import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'both'],
    default: 'local'
  },
  googleProfile: {
    displayName: String,
    picture: String,
    locale: String
  },
  location: {
    country: String,
    city: String
  },
  carbonGoal: {
    type: Number,
    default: 0
  },
  preferences: {
    unit: {
      type: String,
      enum: ['kg', 'metric_tons'],
      default: 'kg'
    },
    currency: {
      type: String,
      default: 'USD'
    }
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

userSchema.pre('save', function(next) {
  if (!this.password && !this.googleId) {
    next(new Error('Either password or googleId is required'));
  } else {
    next();
  }
});

export const User = mongoose.model('User', userSchema);
