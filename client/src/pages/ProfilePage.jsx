import { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useAuthStore } from '../store';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    carbonGoal: '',
    location: { country: '', city: '' }
  });
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await authService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        carbonGoal: data.carbonGoal || '',
        location: data.location || { country: '', city: '' }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authService.updateProfile(formData);
      setProfile(data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container max-w-2xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Profile</h1>

      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{profile?.name}</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="btn btn-primary"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <p className="text-gray-600 mb-6">{profile?.email}</p>

        {!editing ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Carbon Goal</p>
              <p className="text-lg font-semibold">
                {profile?.carbonGoal || 'Not set'} kg CO2e
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-lg font-semibold">
                {profile?.location?.city && profile?.location?.country
                  ? `${profile.location.city}, ${profile.location.country}`
                  : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="text-lg font-semibold">
                {new Date(profile?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Carbon Goal (kg CO2e/year)</label>
              <input
                type="number"
                value={formData.carbonGoal}
                onChange={(e) => setFormData({ ...formData, carbonGoal: e.target.value })}
                className="input"
                step="0.1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, city: e.target.value }
                    })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, country: e.target.value }
                    })
                  }
                  className="input"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
