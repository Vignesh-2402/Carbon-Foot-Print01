import { useState, useEffect } from 'react';
import { activityService } from '../services/api';
import ActivityForm from '../components/ActivityForm';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data } = await activityService.getActivities(0, 100);
      setActivities(data.activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await activityService.delete(id);
        fetchActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Activities</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          + New Activity
        </button>
      </div>

      {showForm && (
        <ActivityForm onSuccess={() => {
          setShowForm(false);
          fetchActivities();
        }} />
      )}

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="card text-center text-gray-500">
            No activities logged yet. Start tracking your carbon footprint!
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity._id} className="card flex justify-between items-start">
              <div>
                <p className="font-bold capitalize">{activity.type}</p>
                <p className="text-sm text-gray-600">
                  {activity.quantity} {activity.unit} on{' '}
                  {new Date(activity.date).toLocaleDateString()}
                </p>
                {activity.notes && (
                  <p className="text-sm text-gray-500 mt-2">{activity.notes}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {activity.carbonCalculated.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600">kg CO2e</p>
                <button
                  onClick={() => handleDelete(activity._id)}
                  className="btn btn-danger text-xs mt-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
