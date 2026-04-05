import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePushNotifications } from "../hooks/usePushNotifications";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700&display=swap');

  .nav-root {
    font-family: 'Nunito', sans-serif;
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(6,16,31,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(29,233,216,0.1);
  }

  .nav-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    flex-shrink: 0;
  }

  .nav-brand-logo {
    height: 32px;
  }

  .nav-brand-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.06em;
    color: #e8f0f7;
    line-height: 1;
  }
  .nav-brand-text span { color: #1de9d8; }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .nav-link {
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: rgba(232,240,247,0.55);
    text-decoration: none;
    padding: 0.4rem 0.75rem;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .nav-link:hover { color: #e8f0f7; background: rgba(255,255,255,0.05); }
  .nav-link.active { color: #1de9d8; }

  .nav-badge {
    font-size: 0.62rem;
    font-weight: 700;
    background: rgba(29,233,216,0.12);
    border: 1px solid rgba(29,233,216,0.3);
    color: #1de9d8;
    padding: 1px 6px;
    border-radius: 100px;
    margin-left: 4px;
    vertical-align: middle;
    letter-spacing: 0.05em;
  }

  .nav-btn-logout {
    font-family: 'Nunito', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    background: transparent;
    border: 1px solid rgba(255,80,80,0.3);
    color: rgba(255,120,120,0.7);
    padding: 0.35rem 0.9rem;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .nav-btn-logout:hover {
    border-color: rgba(255,80,80,0.7);
    color: #ff8080;
    background: rgba(255,80,80,0.06);
  }

  .nav-btn-primary {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    background: #1de9d8;
    color: #06101f;
    border: none;
    padding: 0.45rem 1.1rem;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: inline-block;
    white-space: nowrap;
  }
  .nav-btn-primary:hover { background: #55f5eb; transform: translateY(-1px); }

  /* ── Notification bell ── */
  .nav-bell {
    background: none;
    border: 1px solid rgba(29,233,216,0.2);
    border-radius: 4px;
    color: rgba(232,240,247,0.5);
    cursor: pointer;
    padding: 0.35rem 0.55rem;
    font-size: 1rem;
    line-height: 1;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .nav-bell:hover {
    border-color: rgba(29,233,216,0.5);
    color: #e8f0f7;
    background: rgba(29,233,216,0.06);
  }
  .nav-bell.on {
    border-color: rgba(29,233,216,0.45);
    color: #1de9d8;
  }
  .nav-bell:disabled { opacity: 0.4; cursor: default; }

  /* ── Mobile toggle ── */
  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }
  .nav-hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: #e8f0f7;
    border-radius: 2px;
    transition: transform 0.25s, opacity 0.25s;
  }
  .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .nav-hamburger.open span:nth-child(2) { opacity: 0; }
  .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  @media (max-width: 680px) {
    .nav-hamburger { display: flex; }
    .nav-links {
      display: none;
      position: absolute;
      top: 64px;
      left: 0; right: 0;
      flex-direction: column;
      align-items: stretch;
      background: rgba(6,16,31,0.97);
      border-bottom: 1px solid rgba(29,233,216,0.12);
      padding: 1rem 1.5rem 1.5rem;
      gap: 0.25rem;
    }
    .nav-links.open { display: flex; }
    .nav-link { padding: 0.6rem 0.5rem; }
  }
`;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isStaff, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { supported, subscribed, loading, subscribe, unsubscribe } = usePushNotifications();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";
  const close = () => setMenuOpen(false);

  return (
    <>
      <style>{css}</style>
      <nav className="nav-root">
        <div className="nav-inner">

          {/* Brand */}
          <Link to="/" className="nav-brand" onClick={close}>
            <img
              src="/images/logobianco.png"
              alt="Delta9"
              className="nav-brand-logo"
              onError={(e) => (e.target.style.display = "none")}
            />
            <span className="nav-brand-text">DELTA<span>9</span></span>
          </Link>

          {/* Notification bell — only for logged-in users on supporting browsers */}
          {isLoggedIn && supported && (
            <button
              className={`nav-bell${subscribed ? " on" : ""}`}
              onClick={subscribed ? unsubscribe : subscribe}
              disabled={loading}
              title={subscribed ? "Notifiche attive — clicca per disattivare" : "Attiva notifiche push"}
            >
              {subscribed ? "🔔" : "🔕"}
            </button>
          )}

          {/* Hamburger */}
          <button
            className={`nav-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>

          {/* Links */}
          <div className={`nav-links${menuOpen ? " open" : ""}`}>
            <Link to="/" className={isActive("/")} onClick={close}>Home</Link>
            <Link to="/conditions" className={isActive("/conditions")} onClick={close}>
              Condizioni del Mare
            </Link>

            {isLoggedIn && (
              <Link to="/dashboard" className={isActive("/dashboard")} onClick={close}>
                Dashboard
              </Link>
            )}

            {isLoggedIn && isStaff && (
              <Link to="/instructor" className={isActive("/instructor")} onClick={close}>
                Istruttori <span className="nav-badge">STAFF</span>
              </Link>
            )}

            {isLoggedIn ? (
              <button className="nav-btn-logout" onClick={handleLogout}>
                Esci
              </button>
            ) : (
              <>
                <Link to="/login" className={isActive("/login")} onClick={close}>Accedi</Link>
                <Link to="/signup" className="nav-btn-primary" onClick={close}>Registrati</Link>
              </>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}
