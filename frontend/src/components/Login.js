import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@300;400;600;700&display=swap');

  .login-root {
    font-family: 'Nunito', sans-serif;
    min-height: 100vh;
    background: radial-gradient(ellipse 90% 70% at 40% 80%, #0d3456 0%, #06101f 65%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #e8f0f7;
  }

  .login-card {
    width: 100%;
    max-width: 440px;
    background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
    border: 1px solid rgba(29,233,216,0.15);
    border-radius: 16px;
    padding: 3rem 2.5rem;
    animation: loginFadeUp 0.6s ease forwards;
  }

  @keyframes loginFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-logo {
    height: 44px;
    margin-bottom: 2rem;
    display: block;
  }

  .login-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.8rem;
    letter-spacing: 0.03em;
    line-height: 1;
    margin: 0 0 0.4rem;
  }

  .login-subtitle {
    font-size: 0.88rem;
    color: rgba(232,240,247,0.45);
    margin: 0 0 2.2rem;
    font-weight: 300;
  }

  .login-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(232,240,247,0.5);
    margin-bottom: 0.4rem;
  }

  .login-input {
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
  .login-input::placeholder { color: rgba(232,240,247,0.25); }
  .login-input:focus {
    border-color: rgba(29,233,216,0.5);
    box-shadow: 0 0 0 3px rgba(29,233,216,0.08);
  }
  .login-input.error {
    border-color: rgba(255,80,80,0.5);
  }

  .login-field { margin-bottom: 1.2rem; }

  .login-btn {
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
  .login-btn:hover:not(:disabled) { background: #55f5eb; transform: translateY(-1px); }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .login-msg-err {
    background: rgba(255,80,80,0.08);
    border: 1px solid rgba(255,80,80,0.25);
    color: #ff8080;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-size: 0.88rem;
    margin-bottom: 1.2rem;
  }

  .login-footer {
    text-align: center;
    margin-top: 1.75rem;
    font-size: 0.85rem;
    color: rgba(232,240,247,0.38);
  }
  .login-footer a {
    color: #1de9d8;
    text-decoration: none;
    font-weight: 600;
  }
  .login-footer a:hover { text-decoration: underline; }
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("auth/login/", { username, password });
      if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);
      login(res.data.access);
      navigate("/dashboard");
    } catch (err) {
      setError("Username o password non corretti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="login-root">
        <div className="login-card">
          <img
            src="/images/logobianco.png"
            alt="Delta9"
            className="login-logo"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h1 className="login-title">Accedi</h1>
          <p className="login-subtitle">Bentornato nella comunità Delta9</p>

          {error && <div className="login-msg-err">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Username</label>
              <input
                className={`login-input${error ? " error" : ""}`}
                type="text"
                placeholder="il_tuo_username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                required
                autoFocus
              />
            </div>
            <div className="login-field">
              <label className="login-label">Password</label>
              <input
                className={`login-input${error ? " error" : ""}`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                required
              />
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Accesso in corso…" : "Accedi"}
            </button>
          </form>

          <div className="login-footer">
            Non hai un account?{" "}
            <Link to="/signup">Registrati</Link>
          </div>
        </div>
      </div>
    </>
  );
}
