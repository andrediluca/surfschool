import { useState, useEffect } from "react";
import API from "../api";

export default function BoardAvailability({
  boardId,
  date,
  selectedSlots,
  setSelectedSlots,
  refreshKey,
}) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (boardId && date) {
      API.get(`rentals/availability/?board=${boardId}&date=${date}`)
        .then((res) => setSlots(res.data))
        .catch((err) => console.error(err));
    }
  }, [boardId, date, refreshKey]);

  const toggleSlot = (hour) => {
    if (selectedSlots.length === 0) {
      setSelectedSlots([hour]); // first click
    } else if (selectedSlots.length === 1) {
      if (selectedSlots[0] === hour) {
        setSelectedSlots([]); // deselect
      } else {
        setSelectedSlots([...selectedSlots, hour]); // add second slot
      }
    } else {
      setSelectedSlots([hour]); // reset if already 2
    }
  };

  // 🔹 Calculate range if 2 slots are selected
  let selectedRange = [];
  if (selectedSlots.length === 2) {
    const sorted = [...selectedSlots].sort((a, b) => a.localeCompare(b));
    const start = parseInt(sorted[0].split(":")[0], 10);
    const end = parseInt(sorted[1].split(":")[0], 10);
    selectedRange = Array.from({ length: end - start + 1 }, (_, i) =>
      `${String(start + i).padStart(2, "0")}:00`
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {slots.map((slot) => {
        const isSingleSelected = selectedSlots.includes(slot.hour);
        const isInRange = selectedRange.includes(slot.hour);

        return (
          <div
            key={slot.hour}
            className={`p-2 text-center rounded cursor-pointer ${
              slot.booked
                ? "bg-red-500 text-white"
                : isInRange || isSingleSelected
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            onClick={() => {
              if (!slot.booked) toggleSlot(slot.hour);
            }}
          >
            {slot.hour} - {String(parseInt(slot.hour) + 1).padStart(2, "0")}:00
          </div>
        );
      })}
    </div>
  );
}
