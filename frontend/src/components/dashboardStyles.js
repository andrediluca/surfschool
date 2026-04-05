export const dashboardCss = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@300;400;600;700&display=swap');

  .db-root {
    font-family: 'Nunito', sans-serif;
    background: #06101f;
    color: #e8f0f7;
    min-height: 100vh;
    padding-bottom: 4rem;
  }

  /* ── Layout ── */
  .db-inner { max-width: 720px; margin: 0 auto; padding: 0 1.25rem; }

  /* ── Header ── */
  .db-header {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1.25rem 0;
  }

  /* ── Tabs ── */
  .db-tabs {
    display: flex;
    border-bottom: 1px solid rgba(29,233,216,0.12);
    max-width: 720px;
    margin: 0 auto;
    padding: 0 1.25rem;
    gap: 0.25rem;
    position: sticky;
    top: 64px;
    background: #06101f;
    z-index: 10;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .db-tabs::-webkit-scrollbar { display: none; }
  .db-tab {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.95rem;
    letter-spacing: 0.12em;
    padding: 0.85rem 1.1rem;
    border: none;
    background: none;
    color: rgba(232,240,247,0.35);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.2s, border-color 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .db-tab:hover { color: rgba(232,240,247,0.7); }
  .db-tab.active { color: #1de9d8; border-bottom-color: #1de9d8; }
  .db-tab-content { padding: 1.5rem 0; }

  .db-section {
    background: linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01));
    border: 1px solid rgba(29,233,216,0.12);
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  @media (max-width: 480px) {
    .db-section { padding: 1.1rem; border-radius: 10px; }
  }

  .db-section-tag {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    color: #1de9d8;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }
  .db-section-tag::before {
    content: '';
    display: inline-block;
    width: 22px; height: 1.5px;
    background: #1de9d8;
    flex-shrink: 0;
  }

  .db-section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    letter-spacing: 0.03em;
    line-height: 1;
    margin: 0 0 1.5rem;
  }

  /* ── Cards ── */
  .db-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 0.9rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.6rem;
    transition: border-color 0.2s;
  }
  .db-card:hover { border-color: rgba(29,233,216,0.25); }
  .db-card + .db-card { margin-top: 0.6rem; }

  /* card action buttons always stay on the right on mobile */
  .db-card-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
    margin-left: auto;
  }

  /* ── Badges ── */
  .db-badge {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 100px;
    flex-shrink: 0;
  }
  .db-badge-beginner  { background: rgba(29,233,180,0.12); border: 1px solid rgba(29,233,180,0.3); color: #1de9b4; }
  .db-badge-intermediate { background: rgba(255,193,40,0.12); border: 1px solid rgba(255,193,40,0.3); color: #ffc128; }
  .db-badge-advanced  { background: rgba(255,80,80,0.12); border: 1px solid rgba(255,80,80,0.3); color: #ff8080; }
  .db-badge-booked    { background: rgba(29,233,216,0.12); border: 1px solid rgba(29,233,216,0.3); color: #1de9d8; }
  .db-badge-waitlist  { background: rgba(255,193,40,0.12); border: 1px solid rgba(255,193,40,0.3); color: #ffc128; }
  .db-badge-cancelled { background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.25); color: #ff8080; }

  /* ── Buttons ── */
  .db-btn {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.1em;
    border: none;
    border-radius: 5px;
    padding: 0.45rem 1rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, opacity 0.2s;
    white-space: nowrap;
    text-decoration: none;
    display: inline-block;
  }
  .db-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .db-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .db-btn-primary { background: #1de9d8; color: #06101f; }
  .db-btn-primary:hover:not(:disabled) { background: #55f5eb; }

  .db-btn-danger { background: rgba(255,80,80,0.15); color: #ff8080; border: 1px solid rgba(255,80,80,0.25); }
  .db-btn-danger:hover:not(:disabled) { background: rgba(255,80,80,0.25); }

  .db-btn-ghost {
    background: transparent;
    color: #1de9d8;
    border: 1px solid rgba(29,233,216,0.3);
  }
  .db-btn-ghost:hover:not(:disabled) { background: rgba(29,233,216,0.07); }

  /* ── Form inputs ── */
  .db-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(232,240,247,0.5);
    margin-bottom: 0.4rem;
  }
  .db-input, .db-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    padding: 0.7rem 1rem;
    color: #e8f0f7;
    font-family: 'Nunito', sans-serif;
    font-size: 0.92rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    appearance: none;
  }
  .db-input::placeholder { color: rgba(232,240,247,0.25); }
  .db-input:focus, .db-select:focus {
    border-color: rgba(29,233,216,0.5);
    box-shadow: 0 0 0 3px rgba(29,233,216,0.07);
  }
  .db-select option { background: #0d1f35; }

  .db-field { margin-bottom: 1.1rem; }

  /* ── Messages ── */
  .db-msg-ok {
    background: rgba(29,233,216,0.08);
    border: 1px solid rgba(29,233,216,0.25);
    color: #1de9d8;
    border-radius: 6px;
    padding: 0.65rem 1rem;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  .db-msg-err {
    background: rgba(255,80,80,0.08);
    border: 1px solid rgba(255,80,80,0.25);
    color: #ff8080;
    border-radius: 6px;
    padding: 0.65rem 1rem;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .db-empty {
    color: rgba(232,240,247,0.3);
    font-size: 0.9rem;
    font-style: italic;
    padding: 0.5rem 0;
  }

  /* ── Spots indicator ── */
  .db-spots {
    font-size: 0.78rem;
    color: rgba(232,240,247,0.45);
  }
  .db-spots-low { color: #ffc128; }
  .db-spots-none { color: #ff8080; }

  /* ── Slot grid ── */
  .db-slots {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .db-slot {
    padding: 0.5rem 0.25rem;
    text-align: center;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.15s;
    border: 1px solid transparent;
    user-select: none;
  }
  .db-slot:hover:not(.db-slot-booked) { transform: translateY(-2px); }
  .db-slot-free { background: rgba(29,233,180,0.12); border-color: rgba(29,233,180,0.25); color: #1de9b4; }
  .db-slot-selected { background: rgba(29,233,216,0.2); border-color: #1de9d8; color: #1de9d8; }
  .db-slot-booked { background: rgba(255,80,80,0.1); border-color: rgba(255,80,80,0.2); color: rgba(255,128,128,0.5); cursor: not-allowed; }

  /* ── Divider ── */
  .db-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(29,233,216,0.15), transparent);
    margin: 1.5rem 0;
  }
`;
