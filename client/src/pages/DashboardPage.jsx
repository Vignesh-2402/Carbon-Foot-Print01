import { useState, useEffect } from 'react';
import { activityService, statsService, goalService } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import ActivityForm from '../components/ActivityForm';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActivityForm, setShowActivityForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, comparisonRes] = await Promise.all([
        activityService.getSummary(),
        statsService.getPeerComparison()
      ]);
      setSummary(summaryRes.data);
      setComparison(comparisonRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  const categoryData = summary?.byCategory || [];
  const COLORS = ['#009d9a', '#1192e8', '#6929c4', '#ff832b', '#ff5a1f'];

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#161616]">Dashboard</h1>
        <button
          onClick={() => setShowActivityForm(!showActivityForm)}
          className="btn btn-primary"
        >
          + Log Activity
        </button>
      </div>

      {showActivityForm && (
        <ActivityForm onSuccess={() => {
          setShowActivityForm(false);
          fetchData();
        }} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="This Month"
          value={summary?.thisMonth?.toFixed(2)}
          unit="kg CO2e"
          icon="📅"
        />
        <StatCard
          title="This Year"
          value={summary?.thisYear?.toFixed(2)}
          unit="kg CO2e"
          icon="📊"
        />
        <StatCard
          title="All Time"
          value={summary?.allTime?.toFixed(2)}
          unit="kg CO2e"
          icon="📈"
        />
        <StatCard
          title="vs Average"
          value={comparison?.betterThanAverage ? '✅ Lower' : '❌ Higher'}
          unit={`${Math.abs(comparison?.percentileDifference)}%`}
          icon="🎯"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Emissions by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No activity data yet. Start logging activities!</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Quick Tips</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-transport pl-4">
              <p className="font-semibold">Use Public Transit</p>
              <p className="text-gray-600 text-sm">Save ~60% emissions by taking the bus</p>
            </div>
            <div className="border-l-4 border-energy pl-4">
              <p className="font-semibold">Energy Efficiency</p>
              <p className="text-gray-600 text-sm">Reduce electricity use by 20%</p>
            </div>
            <div className="border-l-4 border-secondary pl-4">
              <p className="font-semibold">Plant-Based Meals</p>
              <p className="text-gray-600 text-sm">Eating vegetarian saves 25kg CO2e/month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
