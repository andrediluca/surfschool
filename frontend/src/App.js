import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Conditions from "./components/Conditions";
import Register from "./components/Register";
import BookingDetail from "./components/BookingDetail";
import InstructorDashboard from "./components/InstructorDashboard";
import SurfCallBanner from "./components/SurfCallBanner";


function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Surf call banner — shown on all pages when a call is active */}
        <SurfCallBanner />

        {/* Page content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="/booking/:id" element={<BookingDetail />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
