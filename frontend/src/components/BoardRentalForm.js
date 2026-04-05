import { useEffect, useState } from "react";
import API from "../api";
import BoardAvailability from "./BoardAvailability";

export default function BoardRentalForm() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    API.get("surfboards/").then((res) => setBoards(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSlots.length === 0) {
      setMessage({ type: "err", text: "Seleziona almeno uno slot orario." });
      return;
    }
    setLoading(true);
    setMessage(null);

    const sorted = [...selectedSlots].sort((a, b) => a.localeCompare(b));
    const start_time = `${sorted[0]}:00`;
    const endHour =
      selectedSlots.length === 1
        ? parseInt(sorted[0], 10) + 1
        : parseInt(sorted[sorted.length - 1], 10) + 1;
    const end_time = `${String(endHour).padStart(2, "0")}:00:00`;

    try {
      await API.post("rentals/", { board: selectedBoard, date, start_time, end_time });
      setMessage({ type: "ok", text: "Noleggio confermato!" });
      setSelectedSlots([]);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      const detail = err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || "Impossibile completare il noleggio.";
      setMessage({ type: "err", text: detail });
    } finally {
      setLoading(false);
    }
  };

  const selectedSummary = () => {
    if (selectedSlots.length === 0) return null;
    const sorted = [...selectedSlots].sort((a, b) => a.localeCompare(b));
    const start = sorted[0];
    const endHour =
      sorted.length === 1
        ? parseInt(start, 10) + 1
        : parseInt(sorted[sorted.length - 1], 10) + 1;
    return `${start} → ${String(endHour).padStart(2, "0")}:00`;
  };

  return (
    <div className="db-section">
        <div className="db-section-tag">Noleggio</div>
        <h2 className="db-section-title" style={{ marginBottom: "1rem" }}>Noleggia una Tavola</h2>

        {message && (
          <div className={message.type === "ok" ? "db-msg-ok" : "db-msg-err"}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
            <div className="db-field">
              <label className="db-label">Tavola</label>
              <select
                className="db-select"
                value={selectedBoard}
                onChange={(e) => { setSelectedBoard(e.target.value); setSelectedSlots([]); }}
                required
              >
                <option value="">— Scegli una tavola —</option>
                {boards.map((b) => (
                  <option key={b.id} value={b.id} disabled={!b.is_available}>
                    {b.size} {b.type}{!b.is_available ? " (non disponibile)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="db-field">
              <label className="db-label">Data</label>
              <input
                className="db-input"
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); setSelectedSlots([]); }}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {selectedBoard && date && (
            <div className="db-field">
              <BoardAvailability
                boardId={selectedBoard}
                date={date}
                selectedSlots={selectedSlots}
                setSelectedSlots={setSelectedSlots}
                refreshKey={refreshKey}
              />
            </div>
          )}

          {selectedSummary() && (
            <div style={{
              background: "rgba(29,233,216,0.07)",
              border: "1px solid rgba(29,233,216,0.2)",
              borderRadius: 6,
              padding: "0.6rem 1rem",
              fontSize: "0.85rem",
              color: "#1de9d8",
              marginBottom: "1rem",
            }}>
              Orario selezionato: <strong>{selectedSummary()}</strong>
            </div>
          )}

          <button
            className="db-btn db-btn-primary"
            type="submit"
            disabled={loading || selectedSlots.length === 0}
            style={{ width: "100%", padding: "0.8rem", fontSize: "0.95rem" }}
          >
            {loading ? "Conferma in corso…" : "Conferma Noleggio"}
          </button>
        </form>
    </div>
  );
}
