import { useEffect, useState } from "react";
import API from "../api";
import BoardAvailability from "./BoardAvailability";

export default function BoardRentalForm() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("surfboards/").then((res) => setBoards(res.data));
  }, []);

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
        "❌ Error: " +
          (error.response?.data?.detail || "Could not create rental")
      );
    }
  };

  // ✅ Handle slot click
  const handleSlotSelect = (hour) => {
    const hourOnly = hour.split(":")[0]; // "10:00" -> "10"
    if (!startHour) {
      setStartHour(hourOnly);
    } else if (!endHour) {
      setEndHour(hourOnly);
    } else {
      // reset if both already set
      setStartHour(hourOnly);
      setEndHour("");
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

        {/* ✅ Availability Grid */}
        {selectedBoard && date && (
          <BoardAvailability
            boardId={selectedBoard}
            date={date}
            onSelectSlot={handleSlotSelect}
          />
        )}

        {/* Show selected times */}
        {(startHour || endHour) && (
          <div className="p-2 bg-gray-100 rounded">
            <p>
              <strong>Selected:</strong>{" "}
              {startHour ? `${startHour}:00` : "--"} →{" "}
              {endHour ? `${endHour}:00` : "--"}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!startHour || !endHour}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Confirm Rental
        </button>
      </form>
    </div>
  );
}
