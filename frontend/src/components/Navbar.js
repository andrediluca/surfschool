import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // ✅ use context

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();        // ✅ from context

  const handleLogout = () => {
    logout();   // updates context + clears localStorage
    navigate("/"); 
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      {/* Left - Brand */}
      <div className="text-lg font-bold">
        <Link to="/">🏄 Surf School</Link>
      </div>

      {/* Right - Links */}
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        <Link to="/conditions" className="hover:underline">
          Sea Conditions
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
