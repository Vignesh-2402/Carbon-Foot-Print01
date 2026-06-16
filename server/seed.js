import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tip } from './models/Tip.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  const tips = [
    {
      category: 'transportation',
      title: 'Use Public Transit',
      description: 'Taking the bus or train can reduce your carbon emissions by up to 60% compared to driving alone.',
      co2Savings: 1200,
      difficulty: 'easy',
      implementation: 'Plan your weekly commute using public transportation instead of driving.'
    },
    {
      category: 'energy',
      title: 'Switch to LED Bulbs',
      description: 'LED bulbs use 75% less energy than incandescent bulbs and last much longer.',
      co2Savings: 50,
      difficulty: 'easy',
      implementation: 'Replace all incandescent bulbs in your home with LED alternatives.'
    },
    {
      category: 'energy',
      title: 'Reduce Water Heating',
      description: 'Lowering your water heater temperature by 10°C can save significant energy.',
      co2Savings: 300,
      difficulty: 'easy',
      implementation: 'Set your water heater to 120°F (48°C) instead of higher temperatures.'
    },
    {
      category: 'food',
      title: 'Go Vegetarian One Day a Week',
      description: 'Eating one meatless meal per week saves approximately 25kg CO2e per month.',
      co2Savings: 300,
      difficulty: 'medium',
      implementation: 'Dedicate one day per week to vegetarian meals. Try Plant-Based Mondays!'
    },
    {
      category: 'food',
      title: 'Buy Local and Seasonal',
      description: 'Local produce requires less transportation, reducing carbon emissions significantly.',
      co2Savings: 200,
      difficulty: 'medium',
      implementation: 'Shop at local farmers markets and buy seasonal produce.'
    },
    {
      category: 'shopping',
      title: 'Buy Second-Hand',
      description: 'Purchasing used items instead of new significantly reduces manufacturing emissions.',
      co2Savings: 500,
      difficulty: 'easy',
      implementation: 'Shop at thrift stores or online platforms for used goods before buying new.'
    },
    {
      category: 'waste',
      title: 'Start Composting',
      description: 'Composting organic waste reduces methane emissions from landfills.',
      co2Savings: 200,
      difficulty: 'medium',
      implementation: 'Set up a home compost bin for food scraps and yard waste.'
    },
    {
      category: 'transportation',
      title: 'Carpool or Ride Share',
      description: 'Sharing rides splits emissions among multiple passengers, reducing per-person impact.',
      co2Savings: 800,
      difficulty: 'medium',
      implementation: 'Use carpooling apps or coordinate with coworkers for shared commutes.'
    },
    {
      category: 'energy',
      title: 'Use a Programmable Thermostat',
      description: 'Smart thermostats can reduce heating and cooling by 10-15% annually.',
      co2Savings: 400,
      difficulty: 'hard',
      implementation: 'Install a programmable thermostat and set schedules for your comfort needs.'
    },
    {
      category: 'transportation',
      title: 'Bike or Walk Short Distances',
      description: 'Zero emissions for trips under 2km that could otherwise be driven.',
      co2Savings: 600,
      difficulty: 'medium',
      implementation: 'Walk or bike for trips under 2km from your home.'
    }
  ];

  try {
    await Tip.deleteMany({});
    await Tip.insertMany(tips);
    console.log('✅ Database seeded with tips successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

const main = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('Database connection closed');
};

main().catch(console.error);
