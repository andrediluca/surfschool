import { useEffect, useState } from "react";
import API from "../api";
import BoardAvailability from "./BoardAvailability";

export default function BoardRentalForm() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // 🔑 force refresh

  useEffect(() => {
    API.get("surfboards/").then((res) => setBoards(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSlots.length === 0) {
      setMessage("❌ Please select at least one slot");
      return;
    }

    const sorted = [...selectedSlots].sort((a, b) => a.localeCompare(b));
    const start_time = `${sorted[0]}:00`;

    let endHour;
    if (selectedSlots.length === 1) {
      // ✅ Single slot → 1 hour booking
      endHour = parseInt(sorted[0].split(":")[0], 10) + 1;
    } else {
      // ✅ Range → end at last selected slot
      endHour = parseInt(sorted[sorted.length - 1].split(":")[0], 10) + 1;
    }

    const end_time = `${endHour.toString().padStart(2, "0")}:00:00`;

    try {
      const response = await API.post("rentals/", {
        board: selectedBoard,
        date,
        start_time,
        end_time,
      });
      console.log("Rental created:", response.data);
      setMessage("✅ Rental confirmed!");
      setSelectedSlots([]);
      setRefreshKey((prev) => prev + 1); // refresh grid
    } catch (error) {
      console.error("Rental error:", error.response?.data || error.message);
      setMessage(
        "❌ Error: " +
          (error.response?.data?.detail || "Could not create rental")
      );
    }
  };

  // ✅ Helper: display selection as a range
  const renderSelection = () => {
    if (selectedSlots.length === 0) return null;

    const sorted = [...selectedSlots].sort((a, b) => a.localeCompare(b));
    const start = sorted[0];
    let endHour;

    if (sorted.length === 1) {
      endHour = parseInt(start.split(":")[0], 10) + 1;
    } else {
      endHour = parseInt(sorted[sorted.length - 1].split(":")[0], 10) + 1;
    }

    const end = `${endHour.toString().padStart(2, "0")}:00`;
    return (
      <div className="p-2 bg-gray-100 rounded">
        <p>
          <strong>Selected:</strong> {start} → {end}
        </p>
      </div>
    );
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

        {/* Availability Grid */}
        {selectedBoard && date && (
          <BoardAvailability
            boardId={selectedBoard}
            date={date}
            selectedSlots={selectedSlots}
            setSelectedSlots={setSelectedSlots}
            refreshKey={refreshKey} // 🔑 pass refresh signal
          />
        )}

        {/* Show selected times */}
        {renderSelection()}

        {/* Submit */}
        <button
          type="submit"
          disabled={selectedSlots.length < 1} // ✅ allow 1 slot too
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Confirm Rental
        </button>
      </form>
    </div>
  );
}
