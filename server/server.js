import dotenv from 'dotenv';
// Configure dotenv immediately before any other imports that rely on process.env
dotenv.config();



import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import oauthRoutes from './routes/oauth.js';
import activityRoutes from './routes/activities.js';
import goalRoutes from './routes/goals.js';
import challengeRoutes from './routes/challenges.js';
import statsRoutes from './routes/stats.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize Passport after dotenv has loaded the environment variables
app.use(passport.initialize());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth/google', oauthRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});