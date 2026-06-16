import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config({ path: new URL('../../.env', import.meta.url).pathname.slice(1) });

async function migrateUserSchema() {
  try {
    console.log('Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Starting user migration...');

    // Using updateMany to avoid triggering the pre('save') middleware
    // and to perform the update efficiently in one database operation.
    const result = await User.updateMany(
      { authProvider: { $exists: false } },
      { 
        $set: { 
          authProvider: 'local',
          googleId: null,
          googleProfile: { 
            displayName: null, 
            picture: null, 
            locale: null 
          }
        } 
      }
    );

    console.log(`✓ Successfully updated ${result.modifiedCount} users`);
    console.log('Migration complete!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUserSchema();