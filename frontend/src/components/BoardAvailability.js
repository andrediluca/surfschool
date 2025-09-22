import { useState, useEffect } from "react";
import API from "../api";

export default function BoardAvailability({ boardId, date, onSelectSlot }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (boardId && date) {
      API.get(`rentals/availability/?board=${boardId}&date=${date}`)
        .then((res) => setSlots(res.data))
        .catch((err) => console.error(err));
    }
  }, [boardId, date]);

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {slots.map((slot) => (
        <div
          key={slot.hour}
          className={`p-2 text-center rounded cursor-pointer ${
            slot.booked
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          onClick={() => {
            if (!slot.booked) {
              onSelectSlot(slot.hour); // ✅ tell parent which hour was clicked
            }
          }}
        >
          {slot.hour}
        </div>
      ))}
    </div>
  );
}
