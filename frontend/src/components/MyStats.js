import { useEffect, useState } from "react";
import API from "../api";
import useAutoRefresh from "../hooks/useAutoRefresh";

const levelOrder = ["beginner", "intermediate", "advanced"];
const levelLabel = { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzato" };
const levelColor = { beginner: "#1de9b4", intermediate: "#ffc128", advanced: "#ff8080" };
const boardLabel = { shortboard: "Shortboard", longboard: "Longboard", "soft-top": "Soft-top" };

function progressionPct(levels) {
  const total = levelOrder.reduce((s, l) => s + (levels?.[l] || 0), 0);
  if (total === 0) return 0;
  if (levels?.advanced > 0) return Math.min(100, 67 + Math.floor((levels.advanced / total) * 33));
  if (levels?.intermediate > 0) return Math.min(66, 34 + Math.floor((levels.intermediate / total) * 33));
  return Math.min(33, Math.floor(((levels?.beginner || 0) / total) * 33));
}

export default function MyStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    API.get("auth/stats/")
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useAutoRefresh(fetchStats);

  if (loading) return <p className="db-empty">Caricamento…</p>;
  if (!stats) return <p className="db-empty">Impossibile caricare le statistiche.</p>;

  const pct = progressionPct(stats.levels);
  const totalLessons = stats.total_lessons || 0;

  return (
    <>
      {/* ── Summary numbers ── */}
      <div className="db-section" style={{ marginBottom: "1rem" }}>
        <div className="db-section-tag">Il tuo profilo</div>
        <h2 className="db-section-title" style={{ marginBottom: "1.25rem" }}>
          Le Mie Statistiche
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.6rem",
          marginBottom: "1.5rem",
        }}>
          {[
            { num: totalLessons,          lbl: "Lezioni" },
            { num: stats.upcoming_lessons, lbl: "In arrivo" },
            { num: stats.total_rentals,    lbl: "Noleggi" },
          ].map(({ num, lbl }) => (
            <div key={lbl} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "0.85rem 0.5rem",
              textAlign: "center",
            }}>
              <span style={{
                display: "block",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2rem",
                color: "#1de9d8",
                lineHeight: 1,
              }}>{num}</span>
              <span style={{
                display: "block",
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "rgba(232,240,247,0.3)",
                marginTop: "0.2rem",
              }}>{lbl}</span>
            </div>
          ))}
        </div>

        {/* Current level badge */}
        {stats.current_level && (
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(232,240,247,0.3)", marginBottom: "0.5rem" }}>
              Livello attuale
            </p>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.9rem",
              letterSpacing: "0.12em",
              padding: "0.35rem 1rem",
              borderRadius: 100,
              background: `${levelColor[stats.current_level]}18`,
              border: `1px solid ${levelColor[stats.current_level]}40`,
              color: levelColor[stats.current_level],
            }}>
              ● {levelLabel[stats.current_level]}
            </span>
          </div>
        )}

        {/* Progression bar */}
        {totalLessons > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(232,240,247,0.3)" }}>
                Progressione surf
              </span>
              <span style={{ fontSize: "0.68rem", color: "#1de9d8" }}>{pct}%</span>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 100,
              height: 7,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                borderRadius: 100,
                width: `${pct}%`,
                background: "linear-gradient(90deg, #1de9d8, #1de9b4)",
                transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.35rem" }}>
              {["Principiante", "Intermedio", "Avanzato"].map((l) => (
                <span key={l} style={{ fontSize: "0.6rem", color: "rgba(232,240,247,0.2)", letterSpacing: "0.05em" }}>{l}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Level breakdown ── */}
      {totalLessons > 0 && (
        <div className="db-section" style={{ marginBottom: "1rem" }}>
          <div className="db-section-tag">Dettaglio lezioni</div>

          {levelOrder.map((lvl) => {
            const count = stats.levels?.[lvl] || 0;
            const barPct = totalLessons ? Math.round((count / totalLessons) * 100) : 0;
            return (
              <div key={lvl} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.7rem" }}>
                <span style={{ fontSize: "0.75rem", color: "rgba(232,240,247,0.4)", width: 90, flexShrink: 0 }}>
                  {levelLabel[lvl]}
                </span>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 100, height: 6, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    borderRadius: 100,
                    width: `${barPct}%`,
                    background: levelColor[lvl],
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: "rgba(232,240,247,0.4)", minWidth: 20, textAlign: "right" }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Board rentals ── */}
      {stats.total_rentals > 0 && (
        <div className="db-section" style={{ marginBottom: "1rem" }}>
          <div className="db-section-tag">Noleggi tavole</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
            {Object.entries(stats.board_types || {}).map(([type, count]) => (
              <span key={type} style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                padding: "3px 10px",
                borderRadius: 100,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(232,240,247,0.45)",
              }}>
                {boardLabel[type] || type} ×{count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Last activity ── */}
      {(stats.last_lesson_date || stats.last_rental_date) && (
        <div style={{
          fontSize: "0.75rem",
          color: "rgba(232,240,247,0.25)",
          textAlign: "center",
          paddingTop: "0.5rem",
        }}>
          {stats.last_lesson_date && <span>Ultima lezione: {stats.last_lesson_date}</span>}
          {stats.last_lesson_date && stats.last_rental_date && <span style={{ margin: "0 0.6rem" }}>·</span>}
          {stats.last_rental_date && <span>Ultimo noleggio: {stats.last_rental_date}</span>}
        </div>
      )}

      {/* ── Empty state ── */}
      {totalLessons === 0 && stats.total_rentals === 0 && (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏄</p>
          <p style={{ color: "rgba(232,240,247,0.35)", fontSize: "0.9rem" }}>
            Nessuna attività ancora.<br />Prenota la tua prima lezione!
          </p>
        </div>
      )}
    </>
  );
}
