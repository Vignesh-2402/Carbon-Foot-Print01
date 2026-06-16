import { useState } from 'react';
import { activityService } from '../services/api';

const ACTIVITY_TYPES = {
  transportation: ['car', 'bus', 'train', 'flight'],
  energy: ['electricity', 'gas', 'heating'],
  food: ['meat', 'vegetarian', 'vegan'],
  shopping: ['shopping'],
  waste: ['waste']
};

export default function ActivityForm({ onSuccess }) {
  const [category, setCategory] = useState('transportation');
  const [type, setType] = useState('car');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await activityService.create({
        type,
        quantity: parseFloat(quantity),
        date: new Date(date),
        notes
      });
      setQuantity('');
      setNotes('');
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-8 bg-[#eff7f5]">
      <h3 className="text-xl font-bold mb-4 text-[#161616]">Log New Activity</h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setType(ACTIVITY_TYPES[e.target.value][0]);
              }}
              className="input"
            >
              {Object.keys(ACTIVITY_TYPES).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Activity Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="input">
              {ACTIVITY_TYPES[category].map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="input"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional details..."
            className="input"
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Logging...' : 'Log Activity'}
        </button>
      </form>
    </div>
  );
}
