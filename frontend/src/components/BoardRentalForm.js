import { useEffect, useState } from "react";
import API from "../api";

export default function BoardRentalForm() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [message, setMessage] = useState("");

  // Load boards
  useEffect(() => {
    API.get("surfboards/").then((res) => setBoards(res.data));
  }, []);

  // Handle rental booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    const start_time = `${startHour}:00:00`;
    const end_time = `${endHour}:00:00`;

    try {
      const response = await API.post("rentals/", {
        board: selectedBoard,
        date,
        start_time,
        end_time,
      });
      console.log("Rental created:", response.data);
      setMessage("✅ Rental confirmed!");
    } catch (error) {
      console.error("Rental error:", error.response?.data || error.message);
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

        {/* Start Hour */}
        <div>
          <label className="block mb-1">Start Hour</label>
          <select
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Select hour --</option>
            {[...Array(24).keys()].map((h) => (
              <option key={h} value={String(h).padStart(2, "0")}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>

        {/* End Hour */}
        <div>
          <label className="block mb-1">End Hour</label>
          <select
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Select hour --</option>
            {[...Array(24).keys()].map((h) => (
              <option key={h} value={String(h).padStart(2, "0")}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>
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
