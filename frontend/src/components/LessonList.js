import { useEffect, useState } from "react";
import API from "../api";

export default function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [message, setMessage] = useState("");

  // Load lessons
  useEffect(() => {
    API.get("lessons/").then((res) => setLessons(res.data));
  }, []);

  // Handle booking
  const bookLesson = async (lessonId) => {
    try {
      // TODO: replace `user: 1` with the logged-in user later
      const response = await API.post("bookings/", {
        user: 1,
        lesson: lessonId,
        status: "booked",
      });

      setMessage("✅ Lesson booked successfully!");
      // Reload lessons to update spots_left
      const updated = await API.get("lessons/");
      setLessons(updated.data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Could not book this lesson: " + error.response?.data?.detail);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Surf Lessons</h2>
      {message && <div className="mb-3 p-2 bg-yellow-100 rounded">{message}</div>}

      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="border p-3 rounded-lg shadow">
            <p>
              🗓 {lesson.date} ⏰ {lesson.time}
            </p>
            <p>Level: {lesson.level_required}</p>
            <p>Spots left: {lesson.spots_left}</p>

            <button
              onClick={() => bookLesson(lesson.id)}
              disabled={lesson.spots_left === 0}
              className={`mt-2 px-3 py-1 rounded text-white ${
                lesson.spots_left === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {lesson.spots_left === 0 ? "Full" : "Book Lesson"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
