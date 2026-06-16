import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="text-white shadow-lg" style={{ backgroundColor: '#198038' }}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          🌍 Carbon Footprint
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-[#d5f3d2]">
            Dashboard
          </Link>
          <Link to="/activities" className="hover:text-[#d5f3d2]">
            Activities
          </Link>
          <Link to="/goals" className="hover:text-[#d5f3d2]">
            Goals
          </Link>
          <Link to="/challenges" className="hover:text-[#d5f3d2]">
            Challenges
          </Link>
          <Link to="/profile" className="hover:text-[#d5f3d2]">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
