import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    let user = await User.findOne({ email });

    if (user) {
      if (user.authProvider === 'local') {
        user.authProvider = 'both';
      }
      if (!user.googleId) {
        user.googleId = googleId;
        user.googleProfile = {
          displayName: name,
          picture: picture,
          locale: payload.locale
        };
      }
      await user.save();
    } else {
      user = new User({
        email,
        name,
        googleId,
        authProvider: 'google',
        googleProfile: {
          displayName: name,
          picture: picture,
          locale: payload.locale
        }
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token: jwtToken,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Google verification error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
