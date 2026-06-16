import { useState, useEffect } from 'react';
import { challengeService } from '../services/api';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [participations, setParticipations] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [leaderboards, setLeaderboards] = useState({});

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data } = await challengeService.getChallenges();
      setChallenges(data);

      for (const challenge of data) {
        const leaderboard = await challengeService.getLeaderboard(challenge._id);
        setLeaderboards((prev) => ({
          ...prev,
          [challenge._id]: leaderboard.data
        }));
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (challengeId) => {
    try {
      await challengeService.join(challengeId);
      setParticipations((prev) => new Set([...prev, challengeId]));
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Challenges</h1>

      <div className="space-y-6">
        {challenges.length === 0 ? (
          <div className="card text-center text-gray-500">
            No active challenges yet.
          </div>
        ) : (
          challenges.map((challenge) => {
            const isJoined = participations.has(challenge._id);
            const leaderboard = leaderboards[challenge._id] || [];

            return (
              <div key={challenge._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{challenge.name}</h3>
                    <p className="text-gray-600 mt-2">{challenge.description}</p>
                  </div>
                  <button
                    onClick={() => handleJoin(challenge._id)}
                    disabled={isJoined}
                    className={`btn ${isJoined ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {isJoined ? '✓ Joined' : 'Join Challenge'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-bold capitalize">{challenge.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Target Reduction</p>
                    <p className="font-bold">{challenge.target} kg CO2e</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Participants</p>
                    <p className="font-bold">{leaderboard.length}</p>
                  </div>
                </div>

                {leaderboard.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-2">Top Participants</h4>
                    <div className="space-y-2">
                      {leaderboard.slice(0, 5).map((entry, index) => (
                        <div key={entry._id} className="flex justify-between text-sm">
                          <span>
                            {index + 1}. {entry.user?.[0]?.name || 'Anonymous'}
                          </span>
                          <span className="font-bold">{entry.currentProgress} kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
