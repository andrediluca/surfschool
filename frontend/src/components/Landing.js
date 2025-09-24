import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isLoggedIn } = useAuth();   // 👈 state-driven, no localStorage check

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold mb-6">Welcome to Surf School 🏄</h1>
      <p className="mb-8 text-lg text-gray-700">
        Learn surfing, rent boards, and check sea conditions.
      </p>

      {!isLoggedIn ? (
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      )}
    </div>
  );
}
