import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardCss } from "./dashboardStyles";
import LessonList from "./LessonList";
import BoardRentalForm from "./BoardRentalForm";
import MyBookings from "./MyBookings";
import MyStats from "./MyStats";

export default function Dashboard() {
  const { isLoggedIn } = useAuth();
  const [tab, setTab] = useState("bookings");

  if (!isLoggedIn) {
    return (
      <>
        <style>{dashboardCss}</style>
        <div className="db-root">
          <div className="db-inner" style={{ textAlign: "center", paddingTop: "4rem" }}>
            <p style={{ color: "rgba(232,240,247,0.4)" }}>Devi effettuare il login per accedere alla dashboard.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{dashboardCss}</style>
      <div className="db-root">

        <div className="db-header">
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.28em",
            color: "#1de9d8",
            marginBottom: "0.3rem",
          }}>
            Area Riservata
          </p>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            lineHeight: 1,
            letterSpacing: "0.02em",
            margin: "0 0 1.25rem",
          }}>
            La Tua Dashboard
          </h1>
        </div>

        <div className="db-tabs">
          <button
            className={`db-tab${tab === "bookings" ? " active" : ""}`}
            onClick={() => setTab("bookings")}
          >
            📋 Prenotazioni
          </button>
          <button
            className={`db-tab${tab === "lessons" ? " active" : ""}`}
            onClick={() => setTab("lessons")}
          >
            🏄 Lezioni
          </button>
          <button
            className={`db-tab${tab === "rental" ? " active" : ""}`}
            onClick={() => setTab("rental")}
          >
            🛹 Noleggio
          </button>
          <button
            className={`db-tab${tab === "stats" ? " active" : ""}`}
            onClick={() => setTab("stats")}
          >
            📊 Stats
          </button>
        </div>

        <div className="db-inner db-tab-content">
          {tab === "bookings" && <MyBookings />}
          {tab === "lessons"  && <LessonList />}
          {tab === "rental"   && <BoardRentalForm />}
          {tab === "stats"    && <MyStats />}
        </div>

      </div>
    </>
  );
}
