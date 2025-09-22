import { useEffect, useState } from "react";
import API from "../api";

export default function BoardRentalForm() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  // Load boards
  useEffect(() => {
    API.get("surfboards/").then((res) => setBoards(res.data));
  }, []);

  // Handle rental booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("rentals/", {
        user: 1, // TODO: replace with logged-in user later
        board: selectedBoard,
        date,
        start_time: startTime,
        end_time: endTime,
      });
      console.log("Rental created:", response.data);
      setMessage("✅ Rental confirmed!");
    } catch (error) {
      console.error(error);
      setMessage(
        "❌ Error: " + (error.response?.data?.detail || "Could not create rental")
      );
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Rent a Surfboard</h2>

      {message && (
        <div className="mb-3 p-2 rounded bg-yellow-100">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Select Board */}
        <div>
          <label className="block mb-1">Select Board</label>
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Choose a board --</option>
            {boards.map((b) => (
              <option key={b.id} value={b.id}>
                {b.size} {b.type}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Confirm Rental
        </button>
      </form>
    </div>
  );
}
