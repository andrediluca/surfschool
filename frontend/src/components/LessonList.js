import { useEffect, useState } from "react";
import API from "../api";

const levelLabel = { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzato" };
const levelBadge = {
  beginner: "db-badge db-badge-beginner",
  intermediate: "db-badge db-badge-intermediate",
  advanced: "db-badge db-badge-advanced",
};

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" });
};

export default function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(null); // slotId being booked

  useEffect(() => {
    API.get("lessons/").then((res) => setLessons(res.data));
  }, []);

  const bookSlot = async (slotId) => {
    setLoading(slotId);
    setMessage(null);
    try {
      await API.post("bookings/", { slot: slotId, status: "booked" });
      setMessage({ type: "ok", text: "Prenotazione confermata!" });
      const updated = await API.get("lessons/");
      setLessons(updated.data);
    } catch (err) {
      const detail =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Impossibile prenotare questo gruppo.";
      setMessage({ type: "err", text: detail });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="db-section">
      <div className="db-section-tag">Disponibili</div>
      <h2 className="db-section-title" style={{ marginBottom: "1rem" }}>Sessioni di Surf</h2>

      {message && (
        <div className={message.type === "ok" ? "db-msg-ok" : "db-msg-err"}>
          {message.text}
        </div>
      )}

      {lessons.length === 0 ? (
        <p className="db-empty">Nessuna sessione disponibile al momento.</p>
      ) : (
        lessons.map((lesson) => (
          <div key={lesson.id} style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            marginBottom: "0.75rem",
            overflow: "hidden",
          }}>
            {/* Session header */}
            <div style={{
              padding: "0.75rem 1rem",
              borderBottom: lesson.slots?.length ? "1px solid rgba(255,255,255,0.06)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.1rem",
                letterSpacing: "0.05em",
                color: "#e8f0f7",
              }}>
                {formatDate(lesson.date)}
              </span>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "0.9rem",
                color: "#1de9d8",
                letterSpacing: "0.08em",
              }}>
                {lesson.time?.slice(0, 5)}
              </span>
              <span style={{
                marginLeft: "auto",
                fontSize: "0.68rem",
                color: "rgba(232,240,247,0.25)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                {lesson.slots?.length || 0} {lesson.slots?.length === 1 ? "gruppo" : "gruppi"}
              </span>
            </div>

            {/* Slots */}
            {lesson.slots?.length === 0 && (
              <p style={{ padding: "0.75rem 1rem", fontSize: "0.82rem", color: "rgba(232,240,247,0.25)", fontStyle: "italic" }}>
                Nessun gruppo ancora.
              </p>
            )}
            {lesson.slots?.map((slot, i) => {
              const full = slot.spots_left === 0;
              const low = slot.spots_left > 0 && slot.spots_left <= 3;
              return (
                <div key={slot.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.65rem 1rem",
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  flexWrap: "wrap",
                }}>
                  <span className={levelBadge[slot.level] || "db-badge"}>
                    {levelLabel[slot.level] || slot.level}
                  </span>
                  {slot.instructor && (
                    <span style={{ fontSize: "0.8rem", color: "rgba(232,240,247,0.4)", flex: 1 }}>
                      {slot.instructor}
                    </span>
                  )}
                  <span style={{
                    fontSize: "0.75rem",
                    color: full ? "#ff8080" : low ? "#ffc128" : "rgba(232,240,247,0.35)",
                    flexShrink: 0,
                  }}>
                    {full ? "Completo" : `${slot.spots_left} posti`}
                  </span>
                  <button
                    className="db-btn db-btn-primary"
                    onClick={() => bookSlot(slot.id)}
                    disabled={full || loading === slot.id}
                    style={{ flexShrink: 0 }}
                  >
                    {loading === slot.id ? "…" : full ? "Completo" : "Prenota"}
                  </button>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
