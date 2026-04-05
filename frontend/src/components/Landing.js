import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');

  .dn-root { font-family: 'Nunito', sans-serif; background: #06101f; color: #e8f0f7; overflow-x: hidden; }
  .dn-root * { box-sizing: border-box; }

  /* ── Hero ── */
  .dn-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse 90% 70% at 50% 20%, #0d3456 0%, #06101f 70%);
    text-align: center;
    padding: 6rem 2rem 10rem;
    overflow: hidden;
  }

  .dn-hero-logo {
    height: 72px;
    margin-bottom: 2rem;
    opacity: 0;
    animation: dnFadeUp 0.8s ease 0.1s forwards;
  }

  .dn-hero-eyebrow {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 0.3em;
    color: #1de9d8;
    margin-bottom: 1.5rem;
    opacity: 0;
    animation: dnFadeUp 0.8s ease 0.2s forwards;
  }

  .dn-hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(7rem, 23vw, 23rem);
    line-height: 0.82;
    letter-spacing: 0.01em;
    margin: 0;
    opacity: 0;
    animation: dnFadeUp 0.9s ease 0.35s forwards;
  }
  .dn-hero-title .outline {
    -webkit-text-stroke: 2px #1de9d8;
    color: transparent;
  }
  .dn-hero-title .filled { color: #1de9d8; }

  .dn-hero-sub {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(0.9rem, 2.5vw, 1.6rem);
    letter-spacing: 0.22em;
    color: rgba(255,255,255,0.38);
    margin-top: 1.2rem;
    opacity: 0;
    animation: dnFadeUp 0.8s ease 0.55s forwards;
  }

  .dn-hero-tagline {
    font-size: 1.05rem;
    font-weight: 300;
    font-style: italic;
    color: rgba(232,240,247,0.6);
    margin-top: 1.5rem;
    max-width: 460px;
    line-height: 1.7;
    opacity: 0;
    animation: dnFadeUp 0.8s ease 0.7s forwards;
  }

  .dn-hero-ctas {
    display: flex;
    gap: 1rem;
    margin-top: 2.5rem;
    flex-wrap: wrap;
    justify-content: center;
    opacity: 0;
    animation: dnFadeUp 0.8s ease 0.9s forwards;
  }

  /* ── Buttons ── */
  .dn-btn-primary {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.14em;
    background: #1de9d8;
    color: #06101f;
    padding: 14px 42px;
    border-radius: 3px;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s;
    display: inline-block;
  }
  .dn-btn-primary:hover { background: #55f5eb; transform: translateY(-2px); }

  .dn-btn-secondary {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.14em;
    border: 1.5px solid rgba(29,233,216,0.38);
    color: #1de9d8;
    padding: 13px 42px;
    border-radius: 3px;
    text-decoration: none;
    transition: border-color 0.2s, transform 0.2s;
    display: inline-block;
  }
  .dn-btn-secondary:hover { border-color: #1de9d8; transform: translateY(-2px); }

  /* ── Animated wave ── */
  .dn-wave-wrap {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 140px;
    pointer-events: none;
    overflow: hidden;
  }
  .dn-wave-svg { width: 200%; height: 100%; }
  .dn-wave1 { animation: dnWave 9s linear infinite; }
  .dn-wave2 { animation: dnWave 13s linear infinite reverse; opacity: 0.45; }
  @keyframes dnWave {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* ── Layout ── */
  .dn-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(29,233,216,0.2), transparent);
  }
  .dn-section {
    padding: 6rem 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }
  .dn-section-tag {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.32em;
    color: #1de9d8;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 1.2rem;
  }
  .dn-section-tag::before {
    content: '';
    display: inline-block;
    width: 28px;
    height: 1.5px;
    background: #1de9d8;
    flex-shrink: 0;
  }
  .dn-section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.4rem, 5.5vw, 5rem);
    line-height: 1;
    letter-spacing: 0.02em;
    margin: 0 0 1.5rem;
  }

  /* ── Stats ── */
  .dn-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 2rem;
    margin-top: 3.5rem;
    padding-top: 3rem;
    border-top: 1px solid rgba(29,233,216,0.1);
  }
  .dn-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3.5rem;
    color: #1de9d8;
    line-height: 1;
    display: block;
  }
  .dn-stat-label {
    font-size: 0.75rem;
    color: rgba(232,240,247,0.42);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 0.3rem;
  }

  /* ── Instructor cards ── */
  .dn-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 3rem;
  }
  .dn-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008));
    border: 1px solid rgba(29,233,216,0.1);
    border-radius: 14px;
    padding: 2rem 1.75rem;
    transition: border-color 0.3s, transform 0.3s;
  }
  .dn-card:hover { border-color: rgba(29,233,216,0.38); transform: translateY(-5px); }
  .dn-card-badge {
    display: inline-block;
    background: rgba(29,233,216,0.07);
    border: 1px solid rgba(29,233,216,0.22);
    color: #1de9d8;
    font-size: 0.68rem;
    letter-spacing: 0.07em;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 100px;
    text-transform: uppercase;
    margin-bottom: 1.1rem;
  }
  .dn-card-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.9rem;
    letter-spacing: 0.02em;
    margin: 0 0 0.15rem;
    line-height: 1.05;
  }
  .dn-card-role {
    font-size: 0.76rem;
    color: rgba(232,240,247,0.38);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }
  .dn-card-text {
    font-size: 0.88rem;
    line-height: 1.7;
    color: rgba(232,240,247,0.58);
    margin: 0;
  }

  /* ── Services ── */
  .dn-services {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 1.25rem;
    margin-top: 3rem;
  }
  .dn-service {
    background: rgba(255,255,255,0.022);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 2rem 1.5rem;
    transition: border-color 0.3s, transform 0.3s;
  }
  .dn-service:hover { border-color: rgba(29,233,216,0.28); transform: translateY(-3px); }
  .dn-service-icon { font-size: 2rem; margin-bottom: 1rem; display: block; }
  .dn-service-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem;
    letter-spacing: 0.04em;
    margin: 0 0 0.5rem;
  }
  .dn-service-desc {
    font-size: 0.85rem;
    color: rgba(232,240,247,0.5);
    line-height: 1.65;
    margin: 0;
  }

  /* ── CTA banner ── */
  .dn-cta-wrap { padding: 0 2rem; }
  .dn-cta {
    background: linear-gradient(135deg, #0d3456 0%, #082040 100%);
    border: 1px solid rgba(29,233,216,0.18);
    border-radius: 18px;
    text-align: center;
    padding: 5rem 2rem;
    margin: 0 auto 6rem;
    max-width: 1100px;
    position: relative;
    overflow: hidden;
  }
  .dn-cta::before {
    content: 'DELTA9';
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(8rem, 22vw, 22rem);
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    -webkit-text-stroke: 1px rgba(29,233,216,0.045);
    color: transparent;
    pointer-events: none;
    white-space: nowrap;
    line-height: 1;
  }
  .dn-cta-content { position: relative; z-index: 1; }
  .dn-cta-text {
    color: rgba(232,240,247,0.52);
    max-width: 380px;
    margin: 0 auto 2.5rem;
    font-size: 0.95rem;
    line-height: 1.75;
  }
  .dn-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

  /* ── Footer ── */
  .dn-footer {
    border-top: 1px solid rgba(255,255,255,0.05);
    text-align: center;
    padding: 2rem;
    font-size: 0.78rem;
    color: rgba(232,240,247,0.25);
    letter-spacing: 0.06em;
  }

  /* ── Animations ── */
  @keyframes dnFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const instructors = [
  {
    name: "Giovanni Evangelisti",
    badge: "Livello 2 · FISSW",
    role: "Fondatore & Head Coach",
    bio: "Uno dei surfisti di spicco del panorama nazionale. Inizia a surfare a 5 anni, nella nazionale italiana junior, quinto agli ultimi campionati a cui ha partecipato. Esperto di Big Wave surfing con esperienze significative tra le leggendarie onde di Nazaré.",
  },
  {
    name: "Enrico Campoli",
    badge: "Livello 1 · FISSW",
    role: '"Chicco" · Coach',
    bio: "Il più giovane del team. Inizia ad aiutare Giovanni a soli 16 anni, diventando istruttore esperto in brevissimo tempo. Ottimo surfista, completo e tecnicamente maturo — pilastro fondamentale della scuola.",
  },
  {
    name: "Andrea Marcori",
    badge: "Livello 1 · FISSW",
    role: "Coach · We Love Surf",
    bio: "Il più esperto in anni di surf. Scrupoloso e attento ai dettagli, si occupa principalmente di principianti e intermedi. Anche cantante del gruppo We Love Surf — la passione per le onde non si ferma sulla spiaggia.",
  },
];

const services = [
  {
    icon: "🏄",
    name: "Lezioni di Surf",
    desc: "Corsi per tutti i livelli: dal primo contatto con l'onda fino alle tecniche avanzate. Istruttori federali FISSW.",
  },
  {
    icon: "🛹",
    name: "Noleggio Tavole",
    desc: "Shortboard, longboard o soft-top. Scegli la tavola giusta e prenota il tuo slot direttamente online.",
  },
  {
    icon: "🌊",
    name: "Kids Camp",
    desc: "Un programma dedicato ai più piccoli. Delta9 segue i giovani surfisti dai primi passi, alcuni già ai campionati italiani.",
  },
  {
    icon: "📡",
    name: "Condizioni del Mare",
    desc: "Controlla le condizioni della spiaggia ogni giorno — altezza delle onde, temperatura dell'acqua e livello consigliato.",
  },
];

const stats = [
  { num: "2017", label: "Anno di fondazione" },
  { num: "3", label: "Istruttori federali" },
  { num: "5+", label: "Agonisti junior" },
  { num: "TOP", label: "Scuola in Toscana" },
];

export default function Landing() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <style>{css}</style>
      <div className="dn-root">

        {/* ── Hero ── */}
        <section className="dn-hero">
          <img
            src="/images/logobianco.png"
            alt="Delta9 Surf School"
            className="dn-hero-logo"
            onError={(e) => (e.target.style.display = "none")}
          />
          <div className="dn-hero-eyebrow">
            Surf School · ASC Riconosciuta FISSW / CONI
          </div>
          <h1 className="dn-hero-title">
            <span className="outline">DELTA</span>
            <span className="filled">9</span>
          </h1>
          <div className="dn-hero-sub">Marina di Carrara · Toscana · Dal 2017</div>
          <p className="dn-hero-tagline">
            La magia di scivolare sulle onde, condivisa con una comunità di amici e appassionati di mare.
          </p>
          <div className="dn-hero-ctas">
            {!isLoggedIn ? (
              <>
                <Link to="/signup" className="dn-btn-primary">Unisciti al Club</Link>
                <Link to="/login" className="dn-btn-secondary">Accedi</Link>
              </>
            ) : (
              <Link to="/dashboard" className="dn-btn-primary">Vai alla Dashboard</Link>
            )}
          </div>

          <div className="dn-wave-wrap" aria-hidden="true">
            <svg className="dn-wave-svg" viewBox="0 0 1440 140" preserveAspectRatio="none">
              <path
                className="dn-wave1"
                d="M0,70 C200,130 400,10 600,70 C800,130 1000,10 1200,70 C1400,130 1440,50 1440,70
                   L2880,70 C2880,70 2680,130 2480,70 C2280,10 2080,130 1880,70
                   C1680,10 1480,130 1440,70 Z"
                fill="#0a1d35"
              />
              <path
                className="dn-wave2"
                d="M0,80 C240,20 480,140 720,80 C960,20 1200,140 1440,80
                   L2880,80 C2880,80 2640,20 2400,80 C2160,140 1920,20 1680,80
                   C1440,140 1200,20 1440,80 Z"
                fill="rgba(13,52,86,0.55)"
              />
            </svg>
          </div>
        </section>

        <div className="dn-divider" />

        {/* ── About ── */}
        <section className="dn-section">
          <div className="dn-section-tag">La Scuola</div>
          <h2 className="dn-section-title">Prima di tutto,<br />un club di amici.</h2>
          <p style={{ maxWidth: 620, color: "rgba(232,240,247,0.62)", lineHeight: 1.85, fontSize: "1rem", margin: 0 }}>
            Nel 2017 Giovanni Evangelisti ha trasformato la passione condivisa sulla spiaggia di Marina di Carrara in
            una vera Associazione Sportiva Dilettantistica, riconosciuta dalla Federazione Italiana Surf (FISSW) e dal
            CONI. Oggi Delta9 è una delle scuole di surf più attive della Toscana — con allievi di tutte le età,
            molti locali e tanti che arrivano da ogni regione d'Italia quando le onde rendono la nostra spiaggia
            un piccolo paradiso.
          </p>
          <div className="dn-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <span className="dn-stat-num">{s.num}</span>
                <div className="dn-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="dn-divider" />

        {/* ── Instructors ── */}
        <section className="dn-section">
          <div className="dn-section-tag">Il Team</div>
          <h2 className="dn-section-title">I Nostri Istruttori</h2>
          <div className="dn-cards">
            {instructors.map((i) => (
              <div key={i.name} className="dn-card">
                <div className="dn-card-badge">{i.badge}</div>
                <div className="dn-card-name">{i.name}</div>
                <div className="dn-card-role">{i.role}</div>
                <p className="dn-card-text">{i.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="dn-divider" />

        {/* ── Services ── */}
        <section className="dn-section">
          <div className="dn-section-tag">Cosa Offriamo</div>
          <h2 className="dn-section-title">Lezioni, Noleggio<br />e molto altro.</h2>
          <div className="dn-services">
            {services.map((s) => (
              <div key={s.name} className="dn-service">
                <span className="dn-service-icon">{s.icon}</span>
                <div className="dn-service-name">{s.name}</div>
                <p className="dn-service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA banner ── */}
        <div className="dn-cta-wrap">
          <div className="dn-cta">
            <div className="dn-cta-content">
              <div className="dn-section-tag" style={{ justifyContent: "center", marginBottom: "1rem" }}>
                Entra nel club
              </div>
              <h2 className="dn-section-title" style={{ marginBottom: "1rem" }}>
                Pronto a prendere<br />la tua prima onda?
              </h2>
              <p className="dn-cta-text">
                Unisciti alla comunità Delta9. Prenota le tue lezioni, noleggia una tavola e controlla le condizioni del mare ogni giorno.
              </p>
              <div className="dn-cta-btns">
                {!isLoggedIn ? (
                  <>
                    <Link to="/signup" className="dn-btn-primary">Registrati Ora</Link>
                    <Link to="/conditions" className="dn-btn-secondary">Condizioni del Mare</Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="dn-btn-primary">Vai alla Dashboard</Link>
                    <Link to="/conditions" className="dn-btn-secondary">Condizioni del Mare</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="dn-footer">
          © {new Date().getFullYear()} Delta9 Surf School · Associazione Sportiva Dilettantistica
          · Marina di Carrara, Toscana · FISSW / CONI
        </footer>
      </div>
    </>
  );
}
