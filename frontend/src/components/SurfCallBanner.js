import { useEffect, useState } from "react";
import API from "../api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600&display=swap');

  .scb-wrap {
    width: 100%;
    overflow: hidden;
    position: sticky;
    top: 64px;
    z-index: 90;
  }

  /* ── WAITING state ── */
  .scb-waiting {
    background: linear-gradient(90deg, #061828 0%, #0a2a3a 40%, #061828 100%);
    border-bottom: 1px solid rgba(29,233,216,0.2);
    padding: 0.3rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.9rem;
    flex-wrap: nowrap;
    overflow: hidden;
    position: relative;
    animation: scb-fadein 0.6s ease both;
  }
  .scb-waiting::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(29,233,216,0.04) 30%,
      rgba(29,233,216,0.08) 50%,
      rgba(29,233,216,0.04) 70%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: scb-shimmer 3s ease-in-out infinite;
    pointer-events: none;
  }

  /* ── ON state ── */
  .scb-on {
    background: linear-gradient(90deg, #1a0005 0%, #3a000a 30%, #2d0007 70%, #1a0005 100%);
    border-bottom: 1px solid rgba(255,40,60,0.4);
    padding: 0.3rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.9rem;
    flex-wrap: nowrap;
    overflow: hidden;
    position: relative;
    animation: scb-fadein 0.4s ease both;
  }
  .scb-on::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,40,60,0.07) 25%,
      rgba(255,80,40,0.12) 50%,
      rgba(255,40,60,0.07) 75%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: scb-sweep 1.8s ease-in-out infinite;
    pointer-events: none;
  }
  .scb-on::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 60px rgba(255,30,50,0.08);
    pointer-events: none;
  }

  /* ── Shared text ── */
  .scb-label {
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.16em;
    font-size: 0.7rem;
    white-space: nowrap;
    position: relative;
  }
  .scb-waiting .scb-label { color: #1de9d8; }
  .scb-on      .scb-label { color: #ff4050; }

  .scb-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: rgba(232,240,247,0.7);
    white-space: nowrap;
    position: relative;
  }

  .scb-dates {
    font-family: 'Nunito', sans-serif;
    font-size: 0.68rem;
    color: rgba(232,240,247,0.4);
    white-space: nowrap;
    position: relative;
  }

  .scb-note {
    font-family: 'Nunito', sans-serif;
    font-size: 0.65rem;
    color: rgba(232,240,247,0.28);
    font-style: italic;
    position: relative;
  }

  .scb-sep {
    width: 2px; height: 2px;
    border-radius: 50%;
    background: rgba(232,240,247,0.18);
    flex-shrink: 0;
    position: relative;
  }

  /* ── ON badge ── */
  .scb-on-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.18em;
    color: #ff4050;
    background: rgba(255,40,60,0.1);
    border: 1px solid rgba(255,40,60,0.35);
    border-radius: 100px;
    padding: 0.1rem 0.65rem;
    position: relative;
    animation: scb-pulse-border 1.5s ease-in-out infinite;
  }
  .scb-on-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #ff4050;
    box-shadow: 0 0 6px 1px rgba(255,40,60,0.6);
    animation: scb-dot-pulse 1s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* ── Waiting badge ── */
  .scb-wait-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    color: #1de9d8;
    background: rgba(29,233,216,0.07);
    border: 1px solid rgba(29,233,216,0.2);
    border-radius: 100px;
    padding: 0.1rem 0.65rem;
    position: relative;
  }
  .scb-wait-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #1de9d8;
    opacity: 0.7;
    animation: scb-blink 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* ── Keyframes ── */
  @keyframes scb-fadein {
    from { opacity: 0; transform: translateY(-100%); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scb-shimmer {
    0%,100% { background-position: 200% 0; }
    50%     { background-position: -200% 0; }
  }
  @keyframes scb-sweep {
    0%,100% { background-position: 200% 0; }
    50%     { background-position: -200% 0; }
  }
  @keyframes scb-blink {
    0%,100% { opacity: 0.7; }
    50%     { opacity: 0.2; }
  }
  @keyframes scb-dot-pulse {
    0%,100% { transform: scale(1);   box-shadow: 0 0 8px 2px rgba(255,40,60,0.6); }
    50%     { transform: scale(1.35); box-shadow: 0 0 14px 4px rgba(255,40,60,0.85); }
  }
  @keyframes scb-pulse-border {
    0%,100% { border-color: rgba(255,40,60,0.35); box-shadow: none; }
    50%     { border-color: rgba(255,40,60,0.7);  box-shadow: 0 0 12px rgba(255,40,60,0.25); }
  }
`;

function formatDateRange(start, end) {
  const fmt = (d) =>
    new Date(d + "T12:00:00").toLocaleDateString("it-IT", { day: "numeric", month: "long" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function SurfCallBanner() {
  const [call, setCall] = useState(undefined); // undefined = loading, null = none

  useEffect(() => {
    const fetch = () =>
      API.get("surfcall/")
        .then((r) => setCall(r.data || null))
        .catch(() => setCall(null));

    fetch();
    const timer = setInterval(fetch, 10000);
    const onVisible = () => { if (document.visibilityState === "visible") fetch(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, []);

  if (!call) return null;

  const isOn = call.status === "on";

  return (
    <>
      <style>{css}</style>
      <div className="scb-wrap">
        <div className={isOn ? "scb-on" : "scb-waiting"}>
          {isOn ? (
            <>
              <div className="scb-on-badge">
                <span className="scb-on-dot" />
                SESSION ON
              </div>
              <span className="scb-title">{call.title}</span>
              <span className="scb-sep" />
              <span className="scb-dates">{formatDateRange(call.start_date, call.end_date)}</span>
              {call.note && <><span className="scb-sep" /><span className="scb-note">{call.note}</span></>}
            </>
          ) : (
            <>
              <div className="scb-wait-badge">
                <span className="scb-wait-dot" />
                CALL OPEN
              </div>
              <span className="scb-title">{call.title}</span>
              <span className="scb-sep" />
              <span className="scb-label">Finestra</span>
              <span className="scb-dates">{formatDateRange(call.start_date, call.end_date)}</span>
              {call.note && <><span className="scb-sep" /><span className="scb-note">{call.note}</span></>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
