import { useEffect, useState, useRef } from "react";
import API from "../api";

// Marina di Carrara coordinates
const LAT = 44.03;
const LON = 10.05;

// Webcam image endpoint — refreshed every 60 s with a cache-buster timestamp
const WEBCAM_IMG = "https://bagnoparadiso.com/bagnoparadiso.jpg";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@300;400;600;700&display=swap');

  .cond-root {
    font-family: 'Nunito', sans-serif;
    background: #06101f;
    color: #e8f0f7;
    min-height: 100vh;
    padding: 2.5rem 1.5rem 4rem;
  }
  .cond-inner { max-width: 860px; margin: 0 auto; }

  .cond-eyebrow {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.3em;
    color: #1de9d8;
    display: flex; align-items: center; gap: 0.6rem;
    margin-bottom: 0.5rem;
  }
  .cond-eyebrow::before {
    content: ''; display: inline-block;
    width: 22px; height: 1.5px; background: #1de9d8;
  }
  .cond-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.4rem, 6vw, 4rem);
    letter-spacing: 0.02em; line-height: 1;
    margin: 0 0 2rem;
  }

  /* ── Webcam ── */
  .cond-webcam {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    background: #030e1a;
    border: 1px solid rgba(29,233,216,0.15);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }
.cond-webcam-placeholder {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 0.75rem;
    background: linear-gradient(160deg, #061828 0%, #030e1a 100%);
  }
  .cond-webcam-icon {
    font-size: 3rem; opacity: 0.2; line-height: 1;
  }
  .cond-webcam-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.8rem; letter-spacing: 0.25em;
    color: rgba(232,240,247,0.2);
  }
  .cond-live-badge {
    position: absolute; top: 0.9rem; left: 1rem;
    display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.7rem; letter-spacing: 0.15em;
    color: rgba(232,240,247,0.5);
    background: rgba(0,0,0,0.45);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px; padding: 3px 10px;
  }
  .cond-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,80,80,0.5);
    animation: blink 1.4s infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
  .cond-webcam-location {
    position: absolute; bottom: 0.8rem; left: 1rem;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.75rem; letter-spacing: 0.18em;
    color: rgba(232,240,247,0.3);
  }

  /* ── Forecast strip ── */
  .cond-forecast-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin-bottom: 1.5rem;
  }
  .cond-forecast-wrap::-webkit-scrollbar { display: none; }
  .cond-forecast-strip {
    display: flex;
    gap: 0.5rem;
    min-width: max-content;
    padding: 0.1rem 0.1rem 0.3rem;
  }
  .cond-forecast-cell {
    background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 0.75rem 0.9rem;
    min-width: 80px;
    text-align: center;
    flex-shrink: 0;
    transition: border-color 0.2s;
  }
  .cond-forecast-cell.now {
    border-color: rgba(29,233,216,0.35);
    background: linear-gradient(135deg, rgba(29,233,216,0.07), rgba(29,233,216,0.02));
  }
  .cond-fc-time {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.78rem; letter-spacing: 0.1em;
    color: rgba(232,240,247,0.4); margin-bottom: 0.4rem;
  }
  .cond-fc-icon { font-size: 1.3rem; line-height: 1; margin-bottom: 0.35rem; }
  .cond-fc-wave {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem; color: #1de9d8; line-height: 1;
  }
  .cond-fc-wind {
    font-size: 0.68rem; color: rgba(232,240,247,0.35);
    margin-top: 0.25rem;
  }
  .cond-fc-temp {
    font-size: 0.68rem; color: rgba(232,240,247,0.3);
    margin-top: 0.1rem;
  }
  .cond-fc-sea {
    font-size: 0.65rem; color: rgba(29,233,216,0.55);
    margin-top: 0.1rem;
  }

  /* ── Sea now card ── */
  .cond-sea-now {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
    margin-bottom: 1.5rem;
  }
  @media (min-width: 480px) { .cond-sea-now { grid-template-columns: repeat(4, 1fr); } }
  .cond-sea-box {
    background: linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01));
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 0.9rem 0.75rem;
    text-align: center;
  }
  .cond-sea-icon { font-size: 1.25rem; line-height: 1; margin-bottom: 0.35rem; }
  .cond-sea-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem; color: #1de9d8; line-height: 1; display: block;
  }
  .cond-sea-lbl {
    font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.08em;
    color: rgba(232,240,247,0.3); margin-top: 0.2rem; display: block;
  }
  .cond-sea-sub {
    font-size: 0.65rem; color: rgba(232,240,247,0.25); margin-top: 0.15rem;
  }
  .cond-section-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.72rem; letter-spacing: 0.28em;
    color: rgba(232,240,247,0.3);
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  /* ── Instructor hero ── */
  .cond-hero {
    background: linear-gradient(135deg, #0d3456 0%, #082040 100%);
    border: 1px solid rgba(29,233,216,0.2);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.75rem;
    position: relative; overflow: hidden;
  }
  .cond-hero::before {
    content: '🌊'; position: absolute;
    right: 1.5rem; top: 50%; transform: translateY(-50%);
    font-size: 7rem; opacity: 0.05; pointer-events: none; line-height: 1;
  }
  .cond-hero-date {
    font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(232,240,247,0.4); margin-bottom: 1rem;
  }
  .cond-stats {
    display: flex; gap: 2rem; margin-bottom: 1.5rem; flex-wrap: wrap;
  }
  .cond-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem; color: #1de9d8; line-height: 1; display: block;
  }
  .cond-stat-label {
    font-size: 0.7rem; color: rgba(232,240,247,0.4);
    text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.15rem;
  }
  .cond-description {
    font-size: 1rem; line-height: 1.75;
    color: rgba(232,240,247,0.7); font-weight: 300;
    max-width: 560px; margin-bottom: 1.25rem;
  }
  .cond-no-update {
    font-size: 0.85rem; color: rgba(232,240,247,0.3);
    font-style: italic; margin-bottom: 1rem;
  }

  /* ── Level badge ── */
  .cond-level {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.85rem; letter-spacing: 0.12em;
    padding: 0.35rem 0.9rem; border-radius: 100px;
  }
  .cond-level-beginner  { background: rgba(29,233,180,0.12); border: 1px solid rgba(29,233,180,0.3); color: #1de9b4; }
  .cond-level-intermediate { background: rgba(255,193,40,0.12); border: 1px solid rgba(255,193,40,0.3); color: #ffc128; }
  .cond-level-advanced  { background: rgba(255,80,80,0.12); border: 1px solid rgba(255,80,80,0.3); color: #ff8080; }
  .cond-level-all       { background: rgba(29,233,216,0.12); border: 1px solid rgba(29,233,216,0.3); color: #1de9d8; }

  /* ── History ── */
  .cond-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px; padding: 1rem 1.25rem;
    display: flex; align-items: center; gap: 1rem;
    flex-wrap: wrap; transition: border-color 0.2s; margin-bottom: 0.5rem;
  }
  .cond-card:hover { border-color: rgba(29,233,216,0.18); }
  .cond-card-date { font-size: 0.82rem; font-weight: 700; color: rgba(232,240,247,0.5); min-width: 90px; flex-shrink: 0; }
  .cond-card-desc { flex: 1; font-size: 0.88rem; color: rgba(232,240,247,0.5); font-weight: 300; }
  .cond-card-meta { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; font-size: 0.8rem; color: rgba(232,240,247,0.4); }

  .cond-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(29,233,216,0.15), transparent); margin: 2rem 0; }
  .cond-empty { color: rgba(232,240,247,0.3); font-style: italic; font-size: 0.9rem; }

  .cond-forecast-error { font-size: 0.78rem; color: rgba(232,240,247,0.25); font-style: italic; padding: 0.5rem 0; }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────

const levelLabel = { beginner: "Principianti", intermediate: "Intermedi", advanced: "Avanzati", all: "Tutti i livelli" };

function LevelBadge({ level }) {
  return <span className={`cond-level cond-level-${level || "all"}`}>{levelLabel[level] || level}</span>;
}

const WMO_ICON = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️",
  80: "🌦️", 81: "🌦️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

function windDir(deg) {
  const dirs = ["N","NE","E","SE","S","SO","O","NO"];
  return dirs[Math.round(deg / 45) % 8];
}

function currentHourIndex(times) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const key = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:00`;
  const idx = times.findIndex((t) => t === key);
  return idx >= 0 ? idx : 0;
}

// ── Forecast fetch ────────────────────────────────────────────────────────────

async function fetchForecast() {
  const [marine, weather] = await Promise.all([
    fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}` +
      `&hourly=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,sea_surface_temperature` +
      `&forecast_days=2&timezone=Europe%2FRome`
    ).then((r) => r.json()),
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&forecast_days=2&timezone=Europe%2FRome`
    ).then((r) => r.json()),
  ]);

  const times = weather.hourly.time;
  const startIdx = currentHourIndex(times);
  const hours = [];

  for (let i = startIdx; i < Math.min(startIdx + 12, times.length); i++) {
    hours.push({
      time: times[i].slice(11, 16),
      isNow: i === startIdx,
      waveHeight: marine.hourly.wave_height?.[i],
      waveDir: marine.hourly.wave_direction?.[i],
      wavePeriod: marine.hourly.wave_period?.[i],
      swellHeight: marine.hourly.swell_wave_height?.[i],
      swellDir: marine.hourly.swell_wave_direction?.[i],
      seaTemp: marine.hourly.sea_surface_temperature?.[i],
      windSpeed: weather.hourly.wind_speed_10m?.[i],
      windDeg: weather.hourly.wind_direction_10m?.[i],
      airTemp: weather.hourly.temperature_2m?.[i],
      code: weather.hourly.weather_code?.[i],
    });
  }
  return hours;
}

function SeaNowCard({ h }) {
  if (!h) return null;
  const items = [
    {
      icon: "🌊",
      val: h.waveHeight != null ? `${h.waveHeight.toFixed(1)}m` : "—",
      lbl: "Altezza onde",
      sub: h.wavePeriod != null ? `${h.wavePeriod.toFixed(0)}s periodo` : null,
    },
    {
      icon: "🌡️",
      val: h.seaTemp != null ? `${Math.round(h.seaTemp)}°` : "—",
      lbl: "Temp. acqua",
      sub: h.airTemp != null ? `Aria: ${Math.round(h.airTemp)}°C` : null,
    },
    {
      icon: "🏄",
      val: h.swellHeight != null ? `${h.swellHeight.toFixed(1)}m` : "—",
      lbl: "Swell",
      sub: h.swellDir != null ? `da ${windDir(h.swellDir)}` : null,
    },
    {
      icon: "💨",
      val: h.windSpeed != null ? `${Math.round(h.windSpeed)}` : "—",
      lbl: "Vento km/h",
      sub: h.windDeg != null ? windDir(h.windDeg) : null,
    },
  ];

  return (
    <div className="cond-sea-now">
      {items.map(({ icon, val, lbl, sub }) => (
        <div key={lbl} className="cond-sea-box">
          <div className="cond-sea-icon">{icon}</div>
          <span className="cond-sea-val">{val}</span>
          <span className="cond-sea-lbl">{lbl}</span>
          {sub && <div className="cond-sea-sub">{sub}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Webcam ───────────────────────────────────────────────────────────────────

function WebcamFrame() {
  const [src, setSrc] = useState(`${WEBCAM_IMG}?t=${Date.now()}`);
  const [error, setError] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSrc(`${WEBCAM_IMG}?t=${Date.now()}`);
      setError(false);
    }, 60000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="cond-webcam" style={{ marginBottom: "1.5rem" }}>
      {error ? (
        <div className="cond-webcam-placeholder">
          <div className="cond-webcam-icon">📷</div>
          <div className="cond-webcam-label">Webcam non disponibile</div>
        </div>
      ) : (
        <img
          src={src}
          alt="Webcam Bagno Paradiso"
          onError={() => setError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
      <div className="cond-live-badge">
        <span className="cond-live-dot" />
        LIVE
      </div>
      <div className="cond-webcam-location">Marina di Carrara · Bagno Paradiso</div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Conditions() {
  const [conditions, setConditions] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [forecastErr, setForecastErr] = useState(false);

  useEffect(() => {
    API.get("conditions/").then((res) => setConditions(res.data)).catch(() => {});
    fetchForecast()
      .then(setForecast)
      .catch(() => setForecastErr(true));
  }, []);

  const latest = conditions[0] || null;
  const history = conditions.slice(1);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <>
      <style>{css}</style>
      <div className="cond-root">
        <div className="cond-inner">

          <div className="cond-eyebrow">Marina di Carrara</div>
          <h1 className="cond-title">Condizioni del Mare</h1>

          {/* ── Webcam ── */}
          <WebcamFrame />

          {/* ── Sea conditions now ── */}
          <p className="cond-section-label">Adesso</p>
          {forecastErr ? (
            <p className="cond-forecast-error">Dati meteo non disponibili al momento.</p>
          ) : !forecast ? (
            <p className="cond-forecast-error">Caricamento dati…</p>
          ) : (
            <>
              <SeaNowCard h={forecast[0]} />

              {/* ── Hourly forecast strip ── */}
              <p className="cond-section-label">Prossime 12 ore</p>
              <div className="cond-forecast-wrap">
                <div className="cond-forecast-strip">
                  {forecast.map((h, i) => (
                    <div key={i} className={`cond-forecast-cell${h.isNow ? " now" : ""}`}>
                      <div className="cond-fc-time">{h.isNow ? "ORA" : h.time}</div>
                      <div className="cond-fc-icon">{WMO_ICON[h.code] ?? "🌊"}</div>
                      <div className="cond-fc-wave">
                        {h.waveHeight != null ? `${h.waveHeight.toFixed(1)}m` : "—"}
                      </div>
                      {h.windSpeed != null && (
                        <div className="cond-fc-wind">
                          {Math.round(h.windSpeed)} km/h {windDir(h.windDeg)}
                        </div>
                      )}
                      {h.seaTemp != null && (
                        <div className="cond-fc-sea">🌡️ {Math.round(h.seaTemp)}°C</div>
                      )}
                      {h.airTemp != null && (
                        <div className="cond-fc-temp">☀️ {Math.round(h.airTemp)}°C</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="cond-divider" />

          {/* ── Instructor update ── */}
          <p className="cond-section-label">Aggiornamento istruttore</p>
          <div className="cond-hero">
            {!latest ? (
              <p className="cond-no-update">Nessun aggiornamento dall'istruttore oggi.<br />Controlla le previsioni qui sopra.</p>
            ) : (
              <>
                <div className="cond-hero-date">{formatDate(latest.date)}</div>
                {(latest.wave_height || latest.water_temp) && (
                  <div className="cond-stats">
                    {latest.wave_height && (
                      <div>
                        <span className="cond-stat-num">{latest.wave_height}</span>
                        <div className="cond-stat-label">Onde (istr.)</div>
                      </div>
                    )}
                    {latest.water_temp && (
                      <div>
                        <span className="cond-stat-num">{latest.water_temp}</span>
                        <div className="cond-stat-label">Temp. acqua</div>
                      </div>
                    )}
                  </div>
                )}
                {latest.description && (
                  <p className="cond-description">"{latest.description}"</p>
                )}
                <LevelBadge level={latest.level_suitability} />
              </>
            )}
          </div>

          {/* ── History ── */}
          {history.length > 0 && (
            <>
              <div className="cond-divider" />
              <p className="cond-section-label">Condizioni recenti</p>
              {history.map((c) => (
                <div key={c.id} className="cond-card">
                  <div className="cond-card-date">{c.date}</div>
                  <div className="cond-card-desc">{c.description || "—"}</div>
                  <div className="cond-card-meta">
                    {c.wave_height && <span>{c.wave_height}</span>}
                    {c.water_temp && <span>{c.water_temp}</span>}
                    <LevelBadge level={c.level_suitability} />
                  </div>
                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </>
  );
}
