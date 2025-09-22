import LessonList from "./LessonList";
import BoardRentalForm from "./BoardRentalForm";
import MyBookings from "./MyBookings";


export default function Dashboard() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🏄 My Dashboard</h1>
      <p className="text-gray-600">Welcome back! Here’s what’s happening today:</p>

      {/* Lessons */}
      <div className="border rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-2">📅 Available Lessons</h2>
        <LessonList />
      </div>

      {/* Board rental */}
      <div className="border rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-2">🏄 Rent a Surfboard</h2>
        <BoardRentalForm />
      </div>

        
       {/* Board rental */}
      <div className="border rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-2">🏄 My Bookings</h2>
        <MyBookings />
      </div>
    </div>
  );
}


