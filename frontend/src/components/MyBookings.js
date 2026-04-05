import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import API from "../api";
import useAutoRefresh from "../hooks/useAutoRefresh";

const statusBadge = {
  booked:    "db-badge db-badge-booked",
  waitlist:  "db-badge db-badge-waitlist",
  cancelled: "db-badge db-badge-cancelled",
};
const statusLabel = { booked: "Prenotato", waitlist: "In attesa", cancelled: "Cancellato" };
const levelLabel  = { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzato" };

function LessonBookingCard({ b, onCancel }) {
  const [qrOpen, setQrOpen] = useState(false);
  const slot = b.slot_detail;
  const lesson = slot?.lesson;

  return (
    <div className="db-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 0 }}>
      {/* Top row: info + action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", flex: 1 }}>
          <span className={statusBadge[b.status] || "db-badge"}>
            {statusLabel[b.status] || b.status}
          </span>
          {slot ? (
            <>
              <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{lesson?.date}</span>
              <span style={{ fontSize: "0.85rem", color: "rgba(232,240,247,0.55)" }}>
                {lesson?.time?.slice(0, 5)}
              </span>
              <span className={`db-badge db-badge-${slot.level}`}>
                {levelLabel[slot.level] || slot.level}
              </span>
              {slot.instructor && (
                <span style={{ fontSize: "0.75rem", color: "rgba(232,240,247,0.35)" }}>
                  {slot.instructor}
                </span>
              )}
            </>
          ) : (
            <span style={{ fontSize: "0.88rem", color: "rgba(232,240,247,0.4)" }}>
              Prenotazione #{b.id}
            </span>
          )}
        </div>
        <div className="db-card-actions">
          {b.checked_in && (
            <span style={{
              fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em",
              padding: "2px 8px", borderRadius: 100,
              background: "rgba(29,233,216,0.1)", border: "1px solid rgba(29,233,216,0.3)",
              color: "#1de9d8",
            }}>✓ presente</span>
          )}
          {b.status !== "cancelled" && b.reference && (
            <button className="db-btn db-btn-ghost" onClick={() => setQrOpen((o) => !o)}
              style={{ fontSize: "0.72rem", padding: "0.35rem 0.75rem" }}>
              {qrOpen ? "Chiudi" : "QR"}
            </button>
          )}
          {b.status !== "cancelled" && (
            <button className="db-btn db-btn-danger" onClick={() => onCancel(b.id)}>
              Cancella
            </button>
          )}
        </div>
      </div>

      {/* QR panel — renders below the row, full width */}
      {qrOpen && b.reference && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "0.5rem", paddingTop: "0.75rem", marginTop: "0.6rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ background: "#fff", padding: "0.75rem", borderRadius: 8 }}>
            <QRCodeCanvas value={String(b.reference)} size={140} />
          </div>
          <p style={{ fontSize: "0.75rem", color: "rgba(232,240,247,0.3)", textAlign: "center", margin: 0 }}>
            Mostra all'istruttore per il check-in
          </p>
        </div>
      )}
    </div>
  );
}

export default function MyBookings() {
  const [lessonBookings, setLessonBookings] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [message, setMessage] = useState(null);

  const fetchAll = () => {
    API.get("bookings/").then((res) => setLessonBookings(res.data)).catch(() => {});
    API.get("rentals/").then((res) => setRentals(res.data)).catch(() => {});
  };

  useAutoRefresh(fetchAll);

  const cancelLesson = async (id) => {
    try {
      await API.delete(`bookings/${id}/`);
      setLessonBookings((prev) => prev.filter((b) => b.id !== id));
      setMessage({ type: "ok", text: "Prenotazione lezione cancellata." });
    } catch {
      setMessage({ type: "err", text: "Errore durante la cancellazione." });
    }
  };

  const cancelRental = async (id) => {
    try {
      await API.delete(`rentals/${id}/`);
      setRentals((prev) => prev.filter((r) => r.id !== id));
      setMessage({ type: "ok", text: "Noleggio cancellato." });
    } catch {
      setMessage({ type: "err", text: "Errore durante la cancellazione." });
    }
  };

  return (
    <>
      {/* ── Lesson bookings ── */}
      <div className="db-section">
        <div className="db-section-tag">Lezioni</div>
        <h2 className="db-section-title" style={{ marginBottom: "1rem" }}>Le Mie Lezioni</h2>

        {message && (
          <div className={message.type === "ok" ? "db-msg-ok" : "db-msg-err"}>
            {message.text}
          </div>
        )}

        {lessonBookings.length === 0 ? (
          <p className="db-empty">Nessuna lezione prenotata.</p>
        ) : (
          lessonBookings.map((b) => (
            <LessonBookingCard key={b.id} b={b} onCancel={cancelLesson} />
          ))
        )}
      </div>

      {/* ── Board rentals ── */}
      <div className="db-section">
        <div className="db-section-tag">Noleggi</div>
        <h2 className="db-section-title" style={{ marginBottom: "1rem" }}>I Miei Noleggi</h2>

        {rentals.length === 0 ? (
          <p className="db-empty">Nessun noleggio attivo.</p>
        ) : (
          rentals.map((r) => (
            <div key={r.id} className="db-card">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {r.board?.size} {r.board?.type}
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(232,240,247,0.4)", marginTop: "0.15rem" }}>
                  {r.date} · {r.start_time?.slice(0, 5)} → {r.end_time?.slice(0, 5)}
                </div>
              </div>
              <div className="db-card-actions">
                <Link
                  to={`/booking/${r.id}`}
                  state={{ rental: r }}
                  className="db-btn db-btn-ghost"
                >
                  QR
                </Link>
                <button className="db-btn db-btn-danger" onClick={() => cancelRental(r.id)}>
                  Cancella
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
