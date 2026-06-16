import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Ensure this matches the route defined in your Express app
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error('No email found in Google profile'), null);
        }

        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (user) {
          // Update existing user
          if (user.authProvider === 'local') {
            user.authProvider = 'both';
          }
          if (!user.googleId) {
            user.googleId = profile.id;
            user.googleProfile = {
              displayName: profile.displayName,
              picture: profile.photos?.[0]?.value || null,
              locale: profile._json?.locale
            };
          }
          await user.save();
        } else {
          // Create new user
          user = new User({
            email,
            name: profile.displayName,
            googleId: profile.id,
            authProvider: 'google',
            googleProfile: {
              displayName: profile.displayName,
              picture: profile.photos?.[0]?.value || null,
              locale: profile._json?.locale
            }
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;