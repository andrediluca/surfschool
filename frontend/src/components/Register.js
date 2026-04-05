import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@300;400;600;700&display=swap');

  .reg-root {
    font-family: 'Nunito', sans-serif;
    min-height: 100vh;
    background: radial-gradient(ellipse 90% 70% at 60% 20%, #0d3456 0%, #06101f 65%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #e8f0f7;
  }

  .reg-card {
    width: 100%;
    max-width: 440px;
    background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
    border: 1px solid rgba(29,233,216,0.15);
    border-radius: 16px;
    padding: 3rem 2.5rem;
    animation: regFadeUp 0.6s ease forwards;
  }

  @keyframes regFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .reg-logo {
    height: 44px;
    margin-bottom: 2rem;
    display: block;
  }

  .reg-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.8rem;
    letter-spacing: 0.03em;
    line-height: 1;
    margin: 0 0 0.4rem;
  }

  .reg-subtitle {
    font-size: 0.88rem;
    color: rgba(232,240,247,0.45);
    margin: 0 0 2.2rem;
    font-weight: 300;
  }

  .reg-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(232,240,247,0.5);
    margin-bottom: 0.4rem;
  }

  .reg-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    color: #e8f0f7;
    font-family: 'Nunito', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .reg-input::placeholder { color: rgba(232,240,247,0.25); }
  .reg-input:focus {
    border-color: rgba(29,233,216,0.5);
    box-shadow: 0 0 0 3px rgba(29,233,216,0.08);
  }

  .reg-field { margin-bottom: 1.2rem; }

  .reg-btn {
    width: 100%;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.05rem;
    letter-spacing: 0.14em;
    background: #1de9d8;
    color: #06101f;
    border: none;
    border-radius: 6px;
    padding: 0.9rem;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.2s, transform 0.15s;
  }
  .reg-btn:hover:not(:disabled) { background: #55f5eb; transform: translateY(-1px); }
  .reg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .reg-msg-ok {
    background: rgba(29,233,216,0.08);
    border: 1px solid rgba(29,233,216,0.25);
    color: #1de9d8;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-size: 0.88rem;
    margin-bottom: 1.2rem;
  }

  .reg-msg-err {
    background: rgba(255,80,80,0.08);
    border: 1px solid rgba(255,80,80,0.25);
    color: #ff8080;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-size: 0.88rem;
    margin-bottom: 1.2rem;
  }

  .reg-footer {
    text-align: center;
    margin-top: 1.75rem;
    font-size: 0.85rem;
    color: rgba(232,240,247,0.38);
  }
  .reg-footer a {
    color: #1de9d8;
    text-decoration: none;
    font-weight: 600;
  }
  .reg-footer a:hover { text-decoration: underline; }
`;

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await API.post("auth/register/", { username, email, password });
      setMsg({ type: "ok", text: "Account creato! Verrai reindirizzato al login…" });
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      const detail = err.response?.data;
      const text = detail?.username?.[0] || detail?.email?.[0] || detail?.password?.[0] || "Registrazione fallita. Riprova.";
      setMsg({ type: "err", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="reg-root">
        <div className="reg-card">
          <img
            src="/images/logobianco.png"
            alt="Delta9"
            className="reg-logo"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h1 className="reg-title">Crea Account</h1>
          <p className="reg-subtitle">Unisciti alla comunità Delta9 Surf School</p>

          {msg && (
            <div className={msg.type === "ok" ? "reg-msg-ok" : "reg-msg-err"}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="reg-field">
              <label className="reg-label">Username</label>
              <input
                className="reg-input"
                type="text"
                placeholder="il_tuo_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="reg-field">
              <label className="reg-label">Email</label>
              <input
                className="reg-input"
                type="email"
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="reg-field">
              <label className="reg-label">Password</label>
              <input
                className="reg-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="reg-btn" type="submit" disabled={loading}>
              {loading ? "Creazione in corso…" : "Crea Account"}
            </button>
          </form>

          <div className="reg-footer">
            Hai già un account?{" "}
            <Link to="/login">Accedi</Link>
          </div>
        </div>
      </div>
    </>
  );
}
