import { useState, useEffect } from 'react';
import { goalService } from '../services/api';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    targetCarbon: '',
    deadline: '',
    category: 'overall'
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await goalService.getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await goalService.create({
        ...formData,
        targetCarbon: parseFloat(formData.targetCarbon)
      });
      setFormData({ title: '', targetCarbon: '', deadline: '', category: 'overall' });
      setShowForm(false);
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this goal?')) {
      try {
        await goalService.delete(id);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          + New Goal
        </button>
      </div>

      {showForm && (
        <div className="card mb-8 bg-blue-50">
          <h3 className="text-xl font-bold mb-4">Create New Goal</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Goal Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Target Carbon (kg CO2e)</label>
                <input
                  type="number"
                  value={formData.targetCarbon}
                  onChange={(e) => setFormData({ ...formData, targetCarbon: e.target.value })}
                  className="input"
                  step="0.1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input"
                >
                  <option value="overall">Overall</option>
                  <option value="transportation">Transportation</option>
                  <option value="energy">Energy</option>
                  <option value="food">Food</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Create Goal
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 ? (
          <div className="card text-center text-gray-500 col-span-2">
            No goals set yet. Create one to get started!
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-lg font-bold">{goal.title}</p>
                  <p className="text-sm text-gray-600 capitalize">{goal.category}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${goal.status === 'active' ? 'bg-[#d5f3d2] text-primary' : 'bg-gray-100 text-gray-700'}`}>
                  {goal.status}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Target: {goal.targetCarbon} kg CO2e</p>
                <p className="text-sm text-gray-600">
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(goal._id)}
                className="btn btn-danger w-full text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
