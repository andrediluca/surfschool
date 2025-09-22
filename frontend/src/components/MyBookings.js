import { useEffect, useState } from "react";
import API from "../api";

export default function MyBookings() {
  const [lessonBookings, setLessonBookings] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [message, setMessage] = useState("");

  // Load data
  useEffect(() => {
    API.get("bookings/").then((res) => setLessonBookings(res.data));
    API.get("rentals/").then((res) => setRentals(res.data));
  }, []);

  // Cancel lesson booking
  const cancelLesson = async (id) => {
    try {
      await API.delete(`bookings/${id}/`);
      setLessonBookings(lessonBookings.filter((b) => b.id !== id));
      setMessage("✅ Lesson booking cancelled");
    } catch (err) {
      setMessage("❌ Error cancelling lesson");
    }
  };

  // Cancel rental
  const cancelRental = async (id) => {
    try {
      await API.delete(`rentals/${id}/`);
      setRentals(rentals.filter((r) => r.id !== id));
      setMessage("✅ Rental cancelled");
    } catch (err) {
      setMessage("❌ Error cancelling rental");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">📋 My Active Bookings</h2>
      {message && <div className="mb-2 p-2 bg-yellow-100">{message}</div>}

      {/* Lessons */}
      <h3 className="text-lg font-semibold mb-2">Surf Lessons</h3>
      {lessonBookings.length === 0 ? (
        <p className="text-gray-500">No active lesson bookings</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {lessonBookings.map((b) => (
            <li key={b.id} className="border p-2 rounded flex justify-between">
              <span>
                🗓 {b.lesson.date} ⏰ {b.lesson.time} – Level:{" "}
                {b.lesson.level_required}
              </span>
              <button
                onClick={() => cancelLesson(b.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Rentals */}
      <h3 className="text-lg font-semibold mb-2">Board Rentals</h3>
      {rentals.length === 0 ? (
        <p className="text-gray-500">No active rentals</p>
      ) : (
        <ul className="space-y-2">
          {rentals.map((r) => (
            <li key={r.id} className="border p-2 rounded flex justify-between">
              <span>
                {r.board.size} {r.board.type} – {r.date} ({r.start_time} →{" "}
                {r.end_time})
              </span>
              <button
                onClick={() => cancelRental(r.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
