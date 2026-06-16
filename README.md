# 🌍 Carbon Footprint Awareness Platform

A comprehensive web application that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## Features

- **User Authentication** - Secure registration and login
- **Activity Logging** - Track daily carbon-generating activities
- **Dashboard Analytics** - Visualize your carbon footprint with charts
- **Goal Setting** - Set and track carbon reduction goals
- **Community Challenges** - Participate in challenges with other users
- **Peer Comparisons** - See how you compare to the average
- **Personalized Insights** - Get tips on how to reduce your carbon footprint
- **Data Export** - Export your activities and reports

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Visualizations**: Recharts

## Setup & Running

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd carbon-footprint
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

3. **Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Development

#### Option 1: Using Docker Compose (Recommended)

```bash
docker-compose up
```

This will:
- Start MongoDB on `localhost:27017`
- Start the backend on `localhost:5000`
- Start the frontend on `localhost:5173`

#### Option 2: Manual Setup

**Terminal 1 - MongoDB:**
```bash
docker run -d -p 27017:27017 \
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

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### Default Test Account

Email: `test@example.com`
Password: `password123`

(Create an account through the registration page)

## Project Structure

```
carbon-footprint/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── store.js     # Zustand stores
│   │   └── App.jsx
│   └── package.json
├── server/              # Express backend
│   ├── routes/          # API endpoints
│   ├── models/          # MongoDB schemas
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Helper functions
│   └── server.js
├── docker-compose.yml   # Docker configuration
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Activities
- `POST /api/activities` - Log new activity (protected)
- `GET /api/activities` - Get user activities (protected)
- `DELETE /api/activities/:id` - Delete activity (protected)
- `GET /api/activities/summary` - Get carbon summary (protected)

### Goals
- `POST /api/goals` - Create goal (protected)
- `GET /api/goals` - Get user goals (protected)
- `GET /api/goals/:id/progress` - Get goal progress (protected)
- `PUT /api/goals/:id` - Update goal (protected)
- `DELETE /api/goals/:id` - Delete goal (protected)

### Challenges
- `GET /api/challenges` - List active challenges
- `POST /api/challenges/:id/join` - Join challenge (protected)
- `GET /api/challenges/:id/leaderboard` - Get challenge leaderboard
- `GET /api/challenges/:id/my-progress` - Get your progress (protected)

### Statistics
- `GET /api/stats/peers` - Compare with peers (protected)
- `GET /api/stats/leaderboard` - Global leaderboard
- `GET /api/stats/trends` - Get trend data (protected)

## Carbon Emission Factors (kg CO2e)

- **Transportation**:
  - Car: 0.192 kg per km
  - Bus: 0.089 kg per km
  - Train: 0.041 kg per km
  - Flight: 0.255 kg per km

- **Energy**:
  - Electricity: 0.4 kg per kWh
  - Natural Gas: 2.04 kg per m³
  - Heating: 0.25 kg per kWh

- **Food**:
  - Meat-based meal: 27 kg CO2e
  - Vegetarian meal: 6.61 kg CO2e
  - Vegan meal: 2.89 kg CO2e

- **Shopping**:
  - Clothing: 24 kg CO2e per unit
  - Electronics: 50 kg CO2e per unit

## Features Status

✅ Authentication & User Profiles
✅ Activity Logging & Carbon Calculation
✅ Dashboard & Analytics
✅ Goals & Tracking
✅ Community Challenges
✅ Peer Comparisons
⏳ Personalized Insights (In Progress)
⏳ Data Export (In Progress)
⏳ Mobile Responsiveness (In Progress)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please create an issue on the GitHub repository.
