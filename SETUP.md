# Quick Start Guide

## Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm or yarn

## Installation (5 minutes)

### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend  
cd ../client
npm install
```

### 2. Start with Docker Compose (Recommended)
```bash
docker-compose up
```

The system will automatically:
- Start MongoDB on `localhost:27017`
- Start Backend on `localhost:5000`  
- Start Frontend on `localhost:5173`

### 3. Or Start Manually

**Terminal 1 - MongoDB:**
```bash
docker run -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:7
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd client
npm run dev
```

## Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Features Implemented ✅

### Authentication & Profiles
- User registration and login
- JWT-based authentication
- User profile management
- Location and carbon goal settings

### Activity Logging
- Log transportation, energy, food, shopping, and waste activities
- Automatic carbon calculation based on emission factors
- Activity filtering, pagination, and deletion
- Activity summary with monthly/yearly/all-time totals

### Dashboard
- Real-time carbon footprint statistics
- Category-wise breakdown with pie charts
- Quick tips and recommendations
- Peer comparison indicators

### Goals
- Create and track reduction goals
- Goal progress calculation
- Multiple categories (transportation, energy, food, overall)
- Goal status management (active, completed, failed)

### Community Challenges
- Browse active challenges
- Join challenges
- Real-time leaderboards
- Track individual progress

### Social & Comparison Features
- Compare your footprint vs peer average
- Global leaderboard
- 7-day trend analysis
- Percentile comparison

### UI/UX
- Responsive design with Tailwind CSS
- Clean navigation and forms
- Real-time data visualization with Recharts
- Protected routes for authenticated users

## What's Left (Phases 5 & 9)

### Phase 5: Personalized Insights
- [ ] Generate smart recommendations based on user data
- [ ] Track if user follows suggestions
- [ ] Seasonal insights and patterns

### Phase 9: Data Export
- [ ] CSV export of activities
- [ ] PDF report generation
- [ ] Monthly/annual summary reports

## Test the App

1. **Register** a new account
2. **Log activities** using the "Log Activity" button
3. **View dashboard** to see your footprint
4. **Set goals** to track reduction targets
5. **Join challenges** to compete with others
6. **Check profile** to manage settings

## Key Files Overview

```
server/
  ├── server.js              # Main entry point
  ├── config/database.js     # MongoDB connection
  ├── models/                # Data schemas
  ├── routes/                # API endpoints
  ├── middleware/auth.js     # JWT authentication
  └── utils/carbonCalculator.js # Emission factors

client/
  ├── src/
  │   ├── pages/             # Route pages
  │   ├── components/        # Reusable UI
  │   ├── services/api.js    # HTTP client
  │   ├── store.js           # Zustand state
  │   └── App.jsx            # Main app
```

## Emission Factors Used

- **Car**: 0.192 kg CO2e/km
- **Bus**: 0.089 kg CO2e/km
- **Train**: 0.041 kg CO2e/km
- **Flight**: 0.255 kg CO2e/km
- **Electricity**: 0.4 kg CO2e/kWh
- **Natural Gas**: 2.04 kg CO2e/m³
- **Meat**: 27 kg CO2e
- **Vegetarian**: 6.61 kg CO2e
- **Vegan**: 2.89 kg CO2e

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Issues
- Ensure MongoDB is running: `docker ps`
- Check credentials in `.env` file
- Verify `MONGODB_URI` is correct

### Frontend Doesn't Load
- Check if backend is running: `curl localhost:5000/api/health`
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)

## Next Steps

1. Enhance the UI with more visualizations
2. Add personalized insights engine
3. Implement data export (CSV/PDF)
4. Add mobile app version
5. Deploy to production (Vercel + Railway)

Happy tracking! 🌱
