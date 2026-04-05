import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import API from "../api";
import { dashboardCss } from "./dashboardStyles";

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    API.get(`rentals/${id}/`).then((res) => setBooking(res.data)).catch(() => {});
  }, [id]);

  return (
    <>
      <style>{dashboardCss}</style>
      <div className="db-root">
        <div className="db-inner" style={{ maxWidth: 520 }}>

          <Link
            to="/dashboard"
            className="db-btn db-btn-ghost"
            style={{ marginBottom: "2rem", display: "inline-block", fontSize: "0.78rem" }}
          >
            ← Dashboard
          </Link>

          {!booking ? (
            <p style={{ color: "rgba(232,240,247,0.4)" }}>Caricamento…</p>
          ) : (
            <div className="db-section">
              <div className="db-section-tag">Conferma</div>
              <h2 className="db-section-title">Noleggio Tavola</h2>

              <div style={{ marginBottom: "1.5rem" }}>
                {[
                  ["Tavola",     `${booking.board?.size} ${booking.board?.type}`],
                  ["Data",       booking.date],
                  ["Orario",     `${booking.start_time?.slice(0, 5)} → ${booking.end_time?.slice(0, 5)}`],
                  ["Riferimento", booking.reference],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.65rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    fontSize: "0.9rem",
                  }}>
                    <span style={{ color: "rgba(232,240,247,0.4)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", alignSelf: "center" }}>
                      {label}
                    </span>
                    <span style={{ fontWeight: 600, wordBreak: "break-all", textAlign: "right", maxWidth: "60%" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* QR Code */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem 0 0.5rem" }}>
                <div style={{
                  background: "#fff",
                  padding: "1rem",
                  borderRadius: 10,
                  display: "inline-block",
                }}>
                  <QRCodeCanvas value={booking.reference} size={160} />
                </div>
                <p style={{ fontSize: "0.82rem", color: "rgba(232,240,247,0.35)", textAlign: "center", margin: 0 }}>
                  Mostra questo QR code alla scuola per confermare il noleggio.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
