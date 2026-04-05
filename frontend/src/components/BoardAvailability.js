import { useState, useEffect } from "react";
import API from "../api";

export default function BoardAvailability({ boardId, date, selectedSlots, setSelectedSlots, refreshKey }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (boardId && date) {
      API.get(`rentals/availability/?board=${boardId}&date=${date}`)
        .then((res) => setSlots(res.data))
        .catch(() => {});
    }
  }, [boardId, date, refreshKey]);

  const toggleSlot = (hour) => {
    if (selectedSlots.length === 0) {
      setSelectedSlots([hour]);
    } else if (selectedSlots.length === 1) {
      selectedSlots[0] === hour ? setSelectedSlots([]) : setSelectedSlots([...selectedSlots, hour]);
    } else {
      setSelectedSlots([hour]);
    }
  };

  let selectedRange = [];
  if (selectedSlots.length === 2) {
    const sorted = [...selectedSlots].sort((a, b) => a.localeCompare(b));
    const start = parseInt(sorted[0], 10);
    const end = parseInt(sorted[1], 10);
    selectedRange = Array.from({ length: end - start + 1 }, (_, i) =>
      `${String(start + i).padStart(2, "0")}:00`
    );
  }

  if (slots.length === 0) return null;

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.6rem",
      }}>
        <span style={{ fontSize: "0.75rem", color: "rgba(232,240,247,0.4)", letterSpacing: "0.05em" }}>
          SELEZIONA SLOT ORARI
        </span>
        <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.7rem" }}>
          <span style={{ color: "#1de9b4" }}>■ Libero</span>
          <span style={{ color: "#1de9d8" }}>■ Selezionato</span>
          <span style={{ color: "rgba(255,128,128,0.5)" }}>■ Occupato</span>
        </div>
      </div>
      <div className="db-slots">
        {slots.map((slot) => {
          const isSelected = selectedSlots.includes(slot.hour) || selectedRange.includes(slot.hour);
          const slotClass = slot.booked
            ? "db-slot db-slot-booked"
            : isSelected
            ? "db-slot db-slot-selected"
            : "db-slot db-slot-free";

          return (
            <div
              key={slot.hour}
              className={slotClass}
              onClick={() => !slot.booked && toggleSlot(slot.hour)}
            >
              {slot.hour}
            </div>
          );
        })}
      </div>
    </div>
  );
}
