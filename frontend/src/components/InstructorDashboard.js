import { useState, useEffect, useRef, useCallback } from "react";
import jsQR from "jsqr";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@300;400;600;700&display=swap');

  .id-root {
    font-family: 'Nunito', sans-serif;
    background: #06101f;
    color: #e8f0f7;
    min-height: 100vh;
    padding-bottom: 4rem;
  }

  /* ── Header ── */
  .id-header {
    padding: 2rem 1.25rem 0;
    max-width: 700px;
    margin: 0 auto;
  }
  .id-eyebrow {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    color: #1de9d8;
    display: flex; align-items: center; gap: 0.5rem;
    margin-bottom: 0.4rem;
  }
  .id-eyebrow::before { content:''; display:inline-block; width:20px; height:1.5px; background:#1de9d8; }
  .id-page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 7vw, 3.2rem);
    letter-spacing: 0.02em;
    line-height: 1;
    margin: 0 0 1.75rem;
  }

  /* ── Tabs ── */
  .id-tabs {
    display: flex;
    border-bottom: 1px solid rgba(29,233,216,0.12);
    max-width: 700px;
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
  .id-tabs::-webkit-scrollbar { display: none; }
  .id-tab {
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
  .id-tab:hover { color: rgba(232,240,247,0.7); }
  .id-tab.active { color: #1de9d8; border-bottom-color: #1de9d8; }

  /* ── Content ── */
  .id-content {
    max-width: 700px;
    margin: 0 auto;
    padding: 1.5rem 1.25rem;
  }

  /* ── Section card ── */
  .id-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01));
    border: 1px solid rgba(29,233,216,0.12);
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  /* ── Lesson row ── */
  .id-lesson-row {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 1rem 1.1rem;
    margin-bottom: 0.6rem;
    transition: border-color 0.2s;
  }
  .id-lesson-row:hover { border-color: rgba(29,233,216,0.2); }

  .id-lesson-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.6rem;
  }
  .id-lesson-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    flex: 1;
  }
  .id-lesson-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .id-lesson-date {
    font-weight: 700;
    font-size: 0.95rem;
  }
  .id-lesson-time {
    font-size: 0.85rem;
    color: rgba(232,240,247,0.5);
  }

  /* ── Roster ── */
  .id-roster {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: none;
  }
  .id-roster.open { display: block; }
  .id-roster-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.35rem 0;
    font-size: 0.85rem;
    color: rgba(232,240,247,0.65);
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }
  .id-roster-empty { font-size: 0.82rem; color: rgba(232,240,247,0.3); font-style: italic; }

  /* ── Form ── */
  .id-form-toggle {
    width: 100%;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.12em;
    background: rgba(29,233,216,0.08);
    border: 1.5px dashed rgba(29,233,216,0.3);
    color: #1de9d8;
    border-radius: 10px;
    padding: 1rem;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    text-align: center;
    margin-bottom: 1rem;
  }
  .id-form-toggle:hover { background: rgba(29,233,216,0.13); border-color: rgba(29,233,216,0.5); }

  .id-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  @media (max-width: 480px) { .id-form-grid { grid-template-columns: 1fr; } }

  .id-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(232,240,247,0.45);
    margin-bottom: 0.35rem;
  }
  .id-input, .id-select, .id-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    padding: 0.7rem 0.9rem;
    color: #e8f0f7;
    font-family: 'Nunito', sans-serif;
    font-size: 0.92rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    appearance: none;
  }
  .id-textarea { resize: vertical; min-height: 80px; }
  .id-input::placeholder, .id-textarea::placeholder { color: rgba(232,240,247,0.2); }
  .id-input:focus, .id-select:focus, .id-textarea:focus {
    border-color: rgba(29,233,216,0.5);
    box-shadow: 0 0 0 3px rgba(29,233,216,0.07);
  }
  .id-select option { background: #0d1f35; }
  .id-field { margin-bottom: 0.75rem; }
  .id-field-full { grid-column: 1 / -1; }

  /* ── Buttons ── */
  .id-btn {
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.1em;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, opacity 0.2s;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .id-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .id-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .id-btn-sm { font-size: 0.75rem; padding: 0.4rem 0.8rem; }
  .id-btn-md { font-size: 0.88rem; padding: 0.55rem 1.1rem; }
  .id-btn-full { width: 100%; justify-content: center; font-size: 0.95rem; padding: 0.85rem; margin-top: 0.5rem; }

  .id-btn-primary { background: #1de9d8; color: #06101f; }
  .id-btn-primary:hover:not(:disabled) { background: #55f5eb; }
  .id-btn-share { background: rgba(29,233,216,0.1); color: #1de9d8; border: 1px solid rgba(29,233,216,0.25); }
  .id-btn-share:hover:not(:disabled) { background: rgba(29,233,216,0.18); }
  .id-btn-roster { background: rgba(255,255,255,0.05); color: rgba(232,240,247,0.6); border: 1px solid rgba(255,255,255,0.08); }
  .id-btn-roster:hover:not(:disabled) { background: rgba(255,255,255,0.09); color: #e8f0f7; }
  .id-btn-danger { background: rgba(255,80,80,0.1); color: #ff8080; border: 1px solid rgba(255,80,80,0.2); }
  .id-btn-danger:hover:not(:disabled) { background: rgba(255,80,80,0.2); }

  /* ── Badges ── */
  .id-badge {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; padding: 2px 7px; border-radius: 100px; flex-shrink: 0;
  }
  .id-badge-beginner    { background: rgba(29,233,180,0.12); border: 1px solid rgba(29,233,180,0.3); color: #1de9b4; }
  .id-badge-intermediate{ background: rgba(255,193,40,0.12);  border: 1px solid rgba(255,193,40,0.3);  color: #ffc128; }
  .id-badge-advanced    { background: rgba(255,80,80,0.12);   border: 1px solid rgba(255,80,80,0.3);   color: #ff8080; }
  .id-badge-spots       { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(232,240,247,0.5); }
  .id-badge-spots-low   { background: rgba(255,193,40,0.1);   border: 1px solid rgba(255,193,40,0.25); color: #ffc128; }
  .id-badge-spots-none  { background: rgba(255,80,80,0.1);    border: 1px solid rgba(255,80,80,0.2);   color: #ff8080; }

  /* ── Toggle switch (board availability) ── */
  .id-toggle-wrap { display: flex; align-items: center; gap: 0.6rem; }
  .id-toggle {
    position: relative; width: 42px; height: 24px; flex-shrink: 0;
  }
  .id-toggle input { opacity: 0; width: 0; height: 0; }
  .id-toggle-slider {
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.1);
    border-radius: 24px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .id-toggle-slider::after {
    content: '';
    position: absolute;
    left: 3px; top: 3px;
    width: 18px; height: 18px;
    background: rgba(232,240,247,0.5);
    border-radius: 50%;
    transition: transform 0.2s, background 0.2s;
  }
  .id-toggle input:checked + .id-toggle-slider { background: rgba(29,233,216,0.25); }
  .id-toggle input:checked + .id-toggle-slider::after { transform: translateX(18px); background: #1de9d8; }

  /* ── Board row ── */
  .id-board-row {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 1rem 1.1rem;
    margin-bottom: 0.6rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .id-board-name { font-weight: 700; font-size: 0.95rem; flex: 1; }
  .id-board-rentals {
    font-size: 0.78rem;
    color: rgba(232,240,247,0.35);
    margin-top: 0.4rem;
    padding-top: 0.4rem;
    border-top: 1px solid rgba(255,255,255,0.04);
  }

  /* ── Slot within a lesson ── */
  .id-slot {
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 0.75rem 1rem;
    transition: background 0.15s;
  }
  .id-slot.drag-over {
    background: rgba(29,233,216,0.07);
    outline: 1px dashed rgba(29,233,216,0.35);
    border-radius: 6px;
  }
  .id-slot-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.4rem;
  }
  .id-slot-instructor {
    font-size: 0.78rem;
    color: rgba(232,240,247,0.4);
    flex: 1;
  }
  .id-slot-actions { display: flex; gap: 0.4rem; }
  .id-draggable {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    cursor: grab;
    user-select: none;
  }
  .id-draggable:active { cursor: grabbing; opacity: 0.6; }
  .id-drag-handle {
    font-size: 0.65rem;
    color: rgba(232,240,247,0.2);
    flex-shrink: 0;
  }
  .id-slot-form {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px dashed rgba(255,255,255,0.06);
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: flex-end;
  }
  .id-slot-form .id-field { margin-bottom: 0; flex: 1; min-width: 110px; }
  @media (max-width: 520px) {
    .id-slot-form { flex-direction: column; gap: 0.75rem; }
    .id-slot-form .id-field { min-width: unset; max-width: unset !important; flex: unset; width: 100%; }
    .id-slot-form button[type="submit"] { width: 100%; justify-content: center; font-size: 0.95rem; padding: 0.85rem; }
  }

  /* ── Messages ── */
  .id-msg {
    border-radius: 8px; padding: 0.7rem 1rem;
    font-size: 0.85rem; margin-bottom: 1rem;
  }
  .id-msg-ok  { background: rgba(29,233,216,0.08); border: 1px solid rgba(29,233,216,0.25); color: #1de9d8; }
  .id-msg-err { background: rgba(255,80,80,0.08);  border: 1px solid rgba(255,80,80,0.25);  color: #ff8080; }

  .id-empty { color: rgba(232,240,247,0.3); font-style: italic; font-size: 0.88rem; padding: 0.5rem 0; }

  /* ── Condition card (history) ── */
  .id-cond-row {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    padding: 0.85rem 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
  }
  .id-cond-meta { font-size: 0.75rem; color: rgba(232,240,247,0.35); margin-top: 0.3rem; }

  /* ── Student cards ── */
  .id-student-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    margin-bottom: 0.75rem;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .id-student-card:hover { border-color: rgba(29,233,216,0.18); }
  .id-student-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.1rem;
    cursor: pointer;
    user-select: none;
  }
  .id-student-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(29,233,216,0.2), rgba(29,233,216,0.05));
    border: 1px solid rgba(29,233,216,0.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem; color: #1de9d8;
    flex-shrink: 0;
  }
  .id-student-name {
    font-weight: 700; font-size: 0.95rem; flex: 1;
  }
  .id-student-email {
    font-size: 0.75rem; color: rgba(232,240,247,0.35);
  }
  .id-student-pills {
    display: flex; gap: 0.4rem; flex-wrap: wrap; flex-shrink: 0;
  }
  .id-pill {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em;
    padding: 2px 8px; border-radius: 100px;
  }
  .id-pill-teal { background: rgba(29,233,216,0.1); border: 1px solid rgba(29,233,216,0.25); color: #1de9d8; }
  .id-pill-green { background: rgba(29,233,180,0.1); border: 1px solid rgba(29,233,180,0.25); color: #1de9b4; }
  .id-pill-yellow { background: rgba(255,193,40,0.1); border: 1px solid rgba(255,193,40,0.25); color: #ffc128; }
  .id-pill-red { background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.25); color: #ff8080; }
  .id-pill-grey { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(232,240,247,0.4); }

  .id-student-detail {
    padding: 0 1.1rem 1.1rem;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
  .id-stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin: 0.85rem 0 0.75rem;
  }
  .id-stat-box {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    padding: 0.65rem 0.75rem;
    text-align: center;
  }
  .id-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem; color: #1de9d8; line-height: 1; display: block;
  }
  .id-stat-lbl {
    font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.08em;
    color: rgba(232,240,247,0.3); margin-top: 0.2rem;
  }
  .id-progress-bar-wrap {
    background: rgba(255,255,255,0.05);
    border-radius: 100px; height: 6px; overflow: hidden; margin-bottom: 0.3rem;
  }
  .id-progress-bar {
    height: 100%; border-radius: 100px;
    background: linear-gradient(90deg, #1de9d8, #1de9b4);
    transition: width 0.4s;
  }
  .id-level-row {
    display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;
  }
  .id-level-row-label {
    font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em;
    color: rgba(232,240,247,0.35); width: 80px; flex-shrink: 0;
  }
  .id-level-row-count {
    font-size: 0.72rem; color: rgba(232,240,247,0.4); flex-shrink: 0; min-width: 20px; text-align: right;
  }
  .id-chevron {
    font-size: 0.7rem; color: rgba(232,240,247,0.25); margin-left: auto; flex-shrink: 0;
    transition: transform 0.2s;
  }
  .id-chevron.open { transform: rotate(180deg); }

  .id-search {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 0.65rem 1rem;
    color: #e8f0f7;
    font-family: 'Nunito', sans-serif;
    font-size: 0.9rem;
    outline: none;
    box-sizing: border-box;
    margin-bottom: 1rem;
    transition: border-color 0.2s;
  }
  .id-search::placeholder { color: rgba(232,240,247,0.2); }
  .id-search:focus { border-color: rgba(29,233,216,0.4); }

  /* ── Check-in tab ── */
  .id-scanner-wrap {
    background: #000;
    border-radius: 14px;
    overflow: hidden;
    aspect-ratio: 1;
    max-width: 340px;
    margin: 0 auto 1rem;
    position: relative;
  }
  .id-scanner-wrap video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .id-scanner-overlay {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
  }
  .id-scanner-frame {
    width: 60%; aspect-ratio: 1;
    border: 2px solid rgba(29,233,216,0.7);
    border-radius: 12px;
    box-shadow: 0 0 0 9999px rgba(0,0,0,0.45);
  }
  .id-scanner-line {
    position: absolute;
    left: 20%; right: 20%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #1de9d8, transparent);
    animation: scan 2s linear infinite;
  }
  @keyframes scan {
    0%   { top: 20%; }
    100% { top: 80%; }
  }

  .id-checkin-result {
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }
  .id-checkin-ok  { background: rgba(29,233,216,0.07); border: 1px solid rgba(29,233,216,0.25); }
  .id-checkin-err { background: rgba(255,80,80,0.07);  border: 1px solid rgba(255,80,80,0.25); }
  .id-checkin-result-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem; letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }
  .id-checkin-result-detail {
    font-size: 0.82rem; color: rgba(232,240,247,0.5); margin-bottom: 0.75rem;
  }

  .id-checkin-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 3px 9px; border-radius: 100px;
  }
  .id-checkin-badge-in  { background: rgba(29,233,216,0.12); border: 1px solid rgba(29,233,216,0.3); color: #1de9d8; }
  .id-checkin-badge-out { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(232,240,247,0.4); }

  .id-checkin-count {
    font-size: 0.72rem; color: rgba(232,240,247,0.35);
    margin-left: auto; flex-shrink: 0;
  }

  /* ── Check-in list view ── */
  .id-ci-subtabs {
    display: flex; gap: 0.4rem; margin-bottom: 1.25rem;
  }
  .id-ci-subtab {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.85rem; letter-spacing: 0.1em;
    padding: 0.5rem 1rem; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: rgba(232,240,247,0.4);
    cursor: pointer; transition: all 0.15s;
  }
  .id-ci-subtab.active {
    background: rgba(29,233,216,0.1);
    border-color: rgba(29,233,216,0.3);
    color: #1de9d8;
  }

  .id-ci-group {
    margin-bottom: 1.25rem;
  }
  .id-ci-group-header {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.9rem; letter-spacing: 0.1em;
    color: rgba(232,240,247,0.5);
    padding: 0.4rem 0; margin-bottom: 0.4rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 0.6rem;
  }
  .id-ci-row {
    display: flex; align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.85rem;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    margin-bottom: 0.45rem;
    transition: border-color 0.15s;
  }
  .id-ci-row.done {
    opacity: 0.55;
    border-color: rgba(29,233,216,0.15);
  }
  .id-ci-name {
    font-weight: 700; font-size: 0.95rem; flex: 1;
  }
  .id-ci-detail {
    font-size: 0.75rem; color: rgba(232,240,247,0.35); flex-shrink: 0;
  }
  .id-ci-btn {
    width: 44px; height: 44px;
    border-radius: 10px; border: none;
    font-size: 1.1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.15s;
  }
  .id-ci-btn-pending {
    background: rgba(29,233,216,0.1);
    border: 1.5px solid rgba(29,233,216,0.3);
    color: #1de9d8;
  }
  .id-ci-btn-pending:hover { background: rgba(29,233,216,0.22); transform: scale(1.05); }
  .id-ci-btn-done {
    background: rgba(29,233,216,0.08);
    border: 1.5px solid rgba(29,233,216,0.2);
    color: rgba(29,233,216,0.5);
    cursor: default;
  }
  .id-ci-progress {
    font-size: 0.68rem; color: rgba(232,240,247,0.3);
    margin-left: auto;
  }

  .id-username-link {
    background: none; border: none; padding: 0; cursor: pointer;
    color: #1de9d8; font-family: inherit; font-size: inherit;
    text-decoration: underline; text-decoration-color: rgba(29,233,216,0.3);
    text-underline-offset: 2px;
    transition: color 0.15s;
  }
  .id-username-link:hover { color: #55f5eb; }

  .id-student-card.highlighted {
    border-color: rgba(29,233,216,0.45);
    box-shadow: 0 0 0 3px rgba(29,233,216,0.08);
  }
`;

const levelLabel = { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzato" };
const levelBadge = { beginner: "id-badge id-badge-beginner", intermediate: "id-badge id-badge-intermediate", advanced: "id-badge id-badge-advanced" };

const today = () => new Date().toISOString().split("T")[0];

// ── Share a session ──
async function shareSession(lesson) {
  const slotLines = (lesson.slots || [])
    .map((s) => `  • ${levelLabel[s.level] || s.level} (${s.instructor}) — ${s.spots_left} posti`)
    .join("\n");
  const text =
    `🏄 Delta9 Surf School\n` +
    `📅 ${lesson.date} alle ${lesson.time?.slice(0, 5)}\n` +
    (slotLines ? `\nGruppi:\n${slotLines}\n` : "") +
    `\nIscriviti su: ${window.location.origin}/signup`;

  if (navigator.share) {
    try { await navigator.share({ title: "Delta9 – Sessione di Surf", text }); return; }
    catch { return; }
  }
  try { await navigator.clipboard.writeText(text); alert("Testo copiato!"); }
  catch { prompt("Copia:", text); }
}

// ── SlotRoster: shows bookings for one slot, handles drag-drop ──
function SlotRoster({ slot, lessonSlots, onStudentClick, onMoved, refreshKey, onDelete }) {
  const [bookings, setBookings] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    API.get(`instructor/bookings/?slot=${slot.id}`)
      .then((r) => setBookings(r.data))
      .catch(() => setBookings([]));
  }, [slot.id, refreshKey]);

  const handleDragStart = (e, booking) => {
    e.dataTransfer.setData("bookingId", String(booking.id));
    e.dataTransfer.setData("fromSlotId", String(slot.id));
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const bookingId = e.dataTransfer.getData("bookingId");
    const fromSlotId = e.dataTransfer.getData("fromSlotId");
    if (!bookingId || fromSlotId === String(slot.id)) return;
    try {
      await API.patch(`instructor/bookings/${bookingId}/`, { slot: slot.id });
      onMoved(); // reload whole lesson
    } catch { /* noop */ }
  };

  const spotsClass = slot.spots_left === 0
    ? "id-badge id-badge-spots-none"
    : slot.spots_left <= 3 ? "id-badge id-badge-spots-low"
    : "id-badge id-badge-spots";

  const booked = bookings?.filter((b) => b.status !== 'cancelled').length ?? 0;
  const checkedIn = bookings?.filter((b) => b.checked_in).length ?? 0;

  const confirmBooking = async (bookingId) => {
    await API.post("instructor/checkin/", { booking_id: bookingId });
    // re-fetch this slot's roster
    const r = await API.get(`instructor/bookings/?slot=${slot.id}`);
    setBookings(r.data);
  };

  return (
    <div
      className={`id-slot${dragOver ? " drag-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="id-slot-header">
        <span className={levelBadge[slot.level] || "id-badge"}>
          {levelLabel[slot.level] || slot.level}
        </span>
        <span className="id-slot-instructor">{slot.instructor}</span>
        <span className={spotsClass}>
          {slot.spots_left === 0 ? "Pieno" : `${slot.spots_left} posti`}
        </span>
        {bookings !== null && (
          <span className="id-checkin-count">
            {booked} prenotati · {checkedIn} presenti
          </span>
        )}
        {onDelete && (
          <button className="id-btn id-btn-danger id-btn-sm"
            style={{ marginLeft: "auto", flexShrink: 0 }}
            onClick={onDelete} title="Rimuovi gruppo">✕</button>
        )}
      </div>

      {bookings === null && <p className="id-roster-empty">…</p>}
      {bookings?.length === 0 && (
        <p className="id-roster-empty" style={{ fontSize: "0.75rem" }}>
          Nessuno ancora · trascina qui per spostare
        </p>
      )}
      {bookings?.map((b) => (
        <div
          key={b.id}
          className="id-draggable"
          draggable
          onDragStart={(e) => handleDragStart(e, b)}
        >
          <span className="id-drag-handle">⠿</span>
          <button className="id-username-link" onClick={() => onStudentClick(b.username)}>
            {b.username}
          </button>
          <span className={`id-checkin-badge ${b.checked_in ? "id-checkin-badge-in" : "id-checkin-badge-out"}`}
            style={{ marginLeft: "auto" }}>
            {b.checked_in ? "✓ presente" : "assente"}
          </span>
          {!b.checked_in && b.status === "booked" && (
            <button className="id-btn id-btn-share id-btn-sm"
              onClick={() => confirmBooking(b.id)}
              title="Conferma presenza">
              ✓
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── AddSlotForm: inline form to add a slot to a lesson ──
function AddSlotForm({ lessonId, onAdded }) {
  const [form, setForm] = useState({ level: "beginner", instructor: "", max_participants: 10 });
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    API.get("instructor/instructors/")
      .then((r) => setInstructors(r.data))
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("instructor/slots/", { ...form, lesson: lessonId });
      setForm({ level: "beginner", instructor: "", max_participants: 10 });
      onAdded();
    } catch { /* noop */ }
    finally { setLoading(false); }
  };

  return (
    <form className="id-slot-form" onSubmit={submit}>
      <div className="id-field">
        <label className="id-label">Livello</label>
        <select className="id-select" value={form.level}
          onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}>
          <option value="beginner">Principiante</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzato</option>
        </select>
      </div>
      <div className="id-field">
        <label className="id-label">Istruttore</label>
        <input className="id-input" type="text" placeholder="Nome" value={form.instructor}
          list="instructor-suggestions"
          onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))} required />
        <datalist id="instructor-suggestions">
          {instructors.map((name) => <option key={name} value={name} />)}
        </datalist>
      </div>
      <div className="id-field" style={{ maxWidth: 80 }}>
        <label className="id-label">Max</label>
        <input className="id-input" type="number" min="1" max="30" value={form.max_participants}
          onChange={(e) => setForm((f) => ({ ...f, max_participants: Number(e.target.value) }))} required />
      </div>
      <button className="id-btn id-btn-primary id-btn-md" type="submit" disabled={loading}
        style={{ alignSelf: "flex-end", marginBottom: 0 }}>
        {loading ? "…" : "+ Gruppo"}
      </button>
    </form>
  );
}

// ══════════════════════════════════════════════
//  Tab: Lezioni
// ══════════════════════════════════════════════
function LessonsTab({ onStudentClick }) {
  const [lessons, setLessons] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [openLesson, setOpenLesson] = useState(null); // lesson id expanded
  const [showSlotForm, setShowSlotForm] = useState(null); // lesson id showing add-slot form
  const [rosterKeys, setRosterKeys] = useState({}); // lessonId → counter to force roster re-fetch
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ date: today(), time: "10:00" });

  useEffect(() => { loadLessons(); }, []);

  const loadLessons = () =>
    API.get("instructor/lessons/").then((r) => setLessons(r.data)).catch(() => {});

  const createLesson = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const r = await API.post("instructor/lessons/", form);
      setMsg({ type: "ok", text: "Sessione creata! Aggiungi i gruppi." });
      setShowNewForm(false);
      setForm({ date: today(), time: "10:00" });
      setOpenLesson(r.data.id);
      setShowSlotForm(r.data.id);
      loadLessons();
    } catch (err) {
      setMsg({ type: "err", text: err.response?.data?.detail || "Errore." });
    }
  };

  const deleteLesson = async (id) => {
    if (!window.confirm("Eliminare questa sessione e tutti i suoi gruppi?")) return;
    try {
      await API.delete(`instructor/lessons/${id}/`);
      setLessons((prev) => prev.filter((l) => l.id !== id));
    } catch { setMsg({ type: "err", text: "Errore nell'eliminazione." }); }
  };

  const deleteSlot = async (slotId, lessonId) => {
    if (!window.confirm("Eliminare questo gruppo?")) return;
    try {
      await API.delete(`instructor/slots/${slotId}/`);
      setLessons((prev) => prev.map((l) =>
        l.id === lessonId ? { ...l, slots: l.slots.filter((s) => s.id !== slotId) } : l
      ));
    } catch { setMsg({ type: "err", text: "Errore." }); }
  };

  const reloadLesson = async (lessonId) => {
    try {
      const r = await API.get(`instructor/lessons/${lessonId}/`);
      setLessons((prev) => prev.map((l) => l.id === lessonId ? r.data : l));
      setRosterKeys((prev) => ({ ...prev, [lessonId]: (prev[lessonId] || 0) + 1 }));
    } catch { /* noop */ }
  };

  return (
    <>
      {msg && <div className={`id-msg id-msg-${msg.type}`}>{msg.text}</div>}

      <button className="id-form-toggle" onClick={() => setShowNewForm((s) => !s)}>
        {showNewForm ? "✕  Chiudi" : "+ Nuova Sessione"}
      </button>

      {showNewForm && (
        <div className="id-card" style={{ marginBottom: "1rem" }}>
          <form onSubmit={createLesson}>
            <div className="id-form-grid">
              <div className="id-field">
                <label className="id-label">Data</label>
                <input className="id-input" type="date" name="date"
                  value={form.date} min={today()}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="id-field">
                <label className="id-label">Orario</label>
                <input className="id-input" type="time" name="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} required />
              </div>
            </div>
            <button className="id-btn id-btn-primary id-btn-full" type="submit">
              Crea Sessione
            </button>
          </form>
        </div>
      )}

      {lessons.length === 0
        ? <p className="id-empty">Nessuna sessione programmata.</p>
        : lessons.map((l) => {
          const expanded = openLesson === l.id;
          const totalSlots = l.slots?.length || 0;
          const totalSpots = (l.slots || []).reduce((s, sl) => s + sl.spots_left, 0);
          return (
            <div key={l.id} className="id-lesson-row">
              {/* Session header */}
              <div className="id-lesson-top">
                <div className="id-lesson-info" style={{ cursor: "pointer" }}
                  onClick={() => setOpenLesson(expanded ? null : l.id)}>
                  <span className="id-lesson-date">{l.date}</span>
                  <span className="id-lesson-time">{l.time?.slice(0, 5)}</span>
                  <span className="id-badge id-badge-spots">
                    {totalSlots} {totalSlots === 1 ? "gruppo" : "gruppi"}
                  </span>
                  {totalSlots > 0 && (
                    <span className={totalSpots === 0 ? "id-badge id-badge-spots-none" : "id-badge id-badge-spots"}>
                      {totalSpots} posti
                    </span>
                  )}
                </div>
                <div className="id-lesson-actions">
                  <button className="id-btn id-btn-share id-btn-sm"
                    onClick={() => shareSession(l)}>↗</button>
                  <button className="id-btn id-btn-roster id-btn-sm"
                    onClick={() => setOpenLesson(expanded ? null : l.id)}>
                    {expanded ? "▲" : "▼"}
                  </button>
                  <button className="id-btn id-btn-danger id-btn-sm"
                    onClick={() => deleteLesson(l.id)}>✕</button>
                </div>
              </div>

              {/* Expanded: slots with rosters + add slot */}
              {expanded && (
                <div style={{ marginTop: "0.25rem" }}>
                  {l.slots?.length === 0 && (
                    <p className="id-roster-empty" style={{ padding: "0.5rem 1rem" }}>
                      Nessun gruppo — aggiungine uno qui sotto.
                    </p>
                  )}
                  {l.slots?.map((slot) => (
                    <SlotRoster
                      key={slot.id}
                      slot={slot}
                      lessonSlots={l.slots}
                      onStudentClick={onStudentClick}
                      onMoved={() => reloadLesson(l.id)}
                      refreshKey={rosterKeys[l.id] || 0}
                      onDelete={() => deleteSlot(slot.id, l.id)}
                    />
                  ))}

                  {/* Add slot toggle */}
                  <div style={{ padding: "0.5rem 1rem 0.75rem" }}>
                    {showSlotForm === l.id ? (
                      <>
                        <AddSlotForm
                          lessonId={l.id}
                          onAdded={() => { reloadLesson(l.id); setShowSlotForm(null); }}
                        />
                        <button className="id-btn id-btn-roster id-btn-sm"
                          style={{ marginTop: "0.5rem" }}
                          onClick={() => setShowSlotForm(null)}>
                          Annulla
                        </button>
                      </>
                    ) : (
                      <button className="id-btn id-btn-share id-btn-sm"
                        onClick={() => setShowSlotForm(l.id)}>
                        + Aggiungi Gruppo
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      }
    </>
  );
}

// ══════════════════════════════════════════════
//  Surf Call manager (inside Conditions tab)
// ══════════════════════════════════════════════
const statusLabel = { waiting: "In attesa", on: "SESSION ON", off: "Chiusa" };
const statusColor = { waiting: "#1de9d8", on: "#ff4050", off: "rgba(232,240,247,0.3)" };

function SurfCallManager() {
  const [calls, setCalls] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "Delta9 Surf School", start_date: today(), end_date: today(), note: "" });
  const [saving, setSaving] = useState(false);

  const load = () =>
    API.get("instructor/surfcall/").then((r) => setCalls(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post("instructor/surfcall/", { ...form, status: "waiting" });
      setShowForm(false);
      setForm({ title: "Delta9 Surf School", start_date: today(), end_date: today(), note: "" });
      load();
    } catch { /* noop */ }
    finally { setSaving(false); }
  };

  const setStatus = async (call, status) => {
    await API.patch(`instructor/surfcall/${call.id}/`, { status });
    setCalls((prev) => prev.map((c) => c.id === call.id ? { ...c, status } : c));
  };

  const remove = async (id) => {
    if (!window.confirm("Eliminare questa call?")) return;
    await API.delete(`instructor/surfcall/${id}/`);
    setCalls((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(232,240,247,0.3)", marginBottom: "0.75rem" }}>
        🏆 Surf Call
      </p>

      {calls.length === 0 && !showForm && (
        <p className="id-empty" style={{ marginBottom: "0.75rem" }}>Nessuna call attiva.</p>
      )}

      {calls.map((c) => (
        <div key={c.id} style={{
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${c.status === "on" ? "rgba(255,40,60,0.3)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 10, padding: "0.85rem 1rem",
          marginBottom: "0.5rem",
          display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{c.title}</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(232,240,247,0.35)", marginTop: "0.15rem" }}>
              {c.start_date} → {c.end_date}
              {c.note && ` · ${c.note}`}
            </div>
          </div>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "0.75rem", letterSpacing: "0.12em",
            color: statusColor[c.status], flexShrink: 0,
          }}>
            {statusLabel[c.status]}
          </span>
          {c.status !== "on" && (
            <button className="id-btn id-btn-sm"
              style={{ background: "rgba(255,40,60,0.12)", color: "#ff4050", border: "1px solid rgba(255,40,60,0.3)" }}
              onClick={() => setStatus(c, "on")}>
              🔴 SESSION ON
            </button>
          )}
          {c.status === "on" && (
            <button className="id-btn id-btn-share id-btn-sm"
              onClick={() => setStatus(c, "waiting")}>
              ⏸ In attesa
            </button>
          )}
          {c.status !== "off" && (
            <button className="id-btn id-btn-roster id-btn-sm"
              onClick={() => setStatus(c, "off")}>
              Chiudi
            </button>
          )}
          <button className="id-btn id-btn-danger id-btn-sm" onClick={() => remove(c.id)}>✕</button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={create} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1rem", marginBottom: "0.5rem" }}>
          <div className="id-form-grid">
            <div className="id-field id-field-full">
              <label className="id-label">Titolo</label>
              <input className="id-input" value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="id-field">
              <label className="id-label">Inizio finestra</label>
              <input className="id-input" type="date" value={form.start_date}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} required />
            </div>
            <div className="id-field">
              <label className="id-label">Fine finestra</label>
              <input className="id-input" type="date" value={form.end_date}
                onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} required />
            </div>
            <div className="id-field id-field-full">
              <label className="id-label">Nota (opzionale)</label>
              <input className="id-input" placeholder="es. Onde 1–2m previste" value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            <button className="id-btn id-btn-primary id-btn-md" type="submit" disabled={saving}>
              {saving ? "…" : "Crea Call"}
            </button>
            <button type="button" className="id-btn id-btn-roster id-btn-md" onClick={() => setShowForm(false)}>
              Annulla
            </button>
          </div>
        </form>
      ) : (
        <button className="id-btn id-btn-share id-btn-sm" onClick={() => setShowForm(true)}>
          + Nuova Call
        </button>
      )}

      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "1.25rem 0" }} />
    </div>
  );
}

// ══════════════════════════════════════════════
//  Tab: Condizioni
// ══════════════════════════════════════════════
function ConditionsTab() {
  const [conditions, setConditions] = useState([]);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: today(),
    description: "",
    level_suitability: "all",
    wave_height: "",
    water_temp: "",
  });

  useEffect(() => {
    API.get("instructor/conditions/").then((r) => setConditions(r.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    const payload = { ...form };
    if (!payload.wave_height) delete payload.wave_height;
    if (!payload.water_temp) delete payload.water_temp;
    try {
      const r = await API.post("instructor/conditions/", payload);
      setConditions((prev) => [r.data, ...prev]);
      setMsg({ type: "ok", text: "Condizioni pubblicate!" });
      setForm({ date: today(), description: "", level_suitability: "all", wave_height: "", water_temp: "" });
    } catch (err) {
      const d = err.response?.data;
      const text = d?.date?.[0] || d?.detail || "Errore nella pubblicazione.";
      setMsg({ type: "err", text });
    } finally { setLoading(false); }
  };

  const deleteCondition = async (id) => {
    try {
      await API.delete(`instructor/conditions/${id}/`);
      setConditions((prev) => prev.filter((c) => c.id !== id));
    } catch { setMsg({ type: "err", text: "Errore nell'eliminazione." }); }
  };

  const levelLabel = { beginner: "Principianti", intermediate: "Intermedi", advanced: "Avanzati", all: "Tutti i livelli" };

  return (
    <>
      <SurfCallManager />

      {msg && <div className={`id-msg id-msg-${msg.type}`}>{msg.text}</div>}

      <div className="id-card">
        <form onSubmit={submit}>
          <div className="id-form-grid">
            <div className="id-field">
              <label className="id-label">Data</label>
              <input className="id-input" type="date" name="date"
                value={form.date} onChange={handleChange} required />
            </div>
            <div className="id-field">
              <label className="id-label">Livello consigliato</label>
              <select className="id-select" name="level_suitability"
                value={form.level_suitability} onChange={handleChange}>
                <option value="all">Tutti i livelli</option>
                <option value="beginner">Principianti</option>
                <option value="intermediate">Intermedi</option>
                <option value="advanced">Avanzati</option>
              </select>
            </div>
            <div className="id-field">
              <label className="id-label">Altezza onde</label>
              <input className="id-input" type="text" name="wave_height"
                placeholder="es. 1-1.5m" value={form.wave_height} onChange={handleChange} />
            </div>
            <div className="id-field">
              <label className="id-label">Temp. acqua</label>
              <input className="id-input" type="text" name="water_temp"
                placeholder="es. 22°C" value={form.water_temp} onChange={handleChange} />
            </div>
            <div className="id-field id-field-full">
              <label className="id-label">Descrizione</label>
              <textarea className="id-textarea" name="description"
                placeholder="Descrivi le condizioni di oggi…"
                value={form.description} onChange={handleChange} required />
            </div>
          </div>
          <button className="id-btn id-btn-primary id-btn-full" type="submit" disabled={loading}>
            {loading ? "Pubblicazione…" : "Pubblica Condizioni"}
          </button>
        </form>
      </div>

      {conditions.length > 0 && (
        <>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(232,240,247,0.3)", margin: "1.25rem 0 0.6rem" }}>
            Storico
          </p>
          {conditions.map((c) => (
            <div key={c.id} className="id-cond-row">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>{c.date}</span>
                  {" · "}
                  <span style={{ fontSize: "0.8rem", color: "#1de9d8" }}>{levelLabel[c.level_suitability]}</span>
                  <p className="id-cond-meta">{c.description}</p>
                  {(c.wave_height || c.water_temp) && (
                    <p className="id-cond-meta" style={{ marginTop: "0.2rem" }}>
                      {c.wave_height && `Onde: ${c.wave_height}`}
                      {c.wave_height && c.water_temp && " · "}
                      {c.water_temp && `Acqua: ${c.water_temp}`}
                    </p>
                  )}
                </div>
                <button className="id-btn id-btn-danger id-btn-sm" style={{ marginLeft: "0.75rem", flexShrink: 0 }}
                  onClick={() => deleteCondition(c.id)}>✕</button>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

// ══════════════════════════════════════════════
//  Tab: Tavole
// ══════════════════════════════════════════════
function BoardsTab({ onStudentClick }) {
  const [boards, setBoards] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [msg, setMsg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "shortboard", size: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBoards();
    API.get(`instructor/rentals/?date=${today()}`).then((r) => setRentals(r.data)).catch(() => {});
  }, []);

  const loadBoards = () =>
    API.get("surfboards/").then((r) => setBoards(r.data)).catch(() => {});

  const handleFormChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const addBoard = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      await API.post("surfboards/", { ...form, is_available: true });
      setMsg({ type: "ok", text: "Tavola aggiunta!" });
      setForm({ type: "shortboard", size: "" });
      setShowForm(false);
      loadBoards();
    } catch {
      setMsg({ type: "err", text: "Errore nell'aggiunta della tavola." });
    } finally { setLoading(false); }
  };

  const deleteBoard = async (id) => {
    if (!window.confirm("Eliminare questa tavola?")) return;
    try {
      await API.delete(`surfboards/${id}/`);
      setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch { setMsg({ type: "err", text: "Errore nell'eliminazione." }); }
  };

  const toggleAvailability = async (board) => {
    try {
      const r = await API.patch(`surfboards/${board.id}/`, { is_available: !board.is_available });
      setBoards((prev) => prev.map((b) => b.id === board.id ? r.data : b));
    } catch { setMsg({ type: "err", text: "Errore nell'aggiornamento." }); }
  };

  const boardRentalsToday = (boardId) =>
    rentals.filter((r) => r.board === boardId).sort((a, b) => a.start_time.localeCompare(b.start_time));

  const typeLabel = { shortboard: "Shortboard", longboard: "Longboard", "soft-top": "Soft-top" };

  return (
    <>
      {msg && <div className={`id-msg id-msg-${msg.type}`}>{msg.text}</div>}

      <button className="id-form-toggle" onClick={() => setShowForm((s) => !s)}>
        {showForm ? "✕  Chiudi" : "+ Aggiungi Tavola"}
      </button>

      {showForm && (
        <div className="id-card" style={{ marginBottom: "1rem" }}>
          <form onSubmit={addBoard}>
            <div className="id-form-grid">
              <div className="id-field">
                <label className="id-label">Tipo</label>
                <select className="id-select" name="type"
                  value={form.type} onChange={handleFormChange}>
                  <option value="shortboard">Shortboard</option>
                  <option value="longboard">Longboard</option>
                  <option value="soft-top">Soft-top</option>
                </select>
              </div>
              <div className="id-field">
                <label className="id-label">Misura</label>
                <input className="id-input" type="text" name="size"
                  placeholder="es. 7'6&quot;" value={form.size}
                  onChange={handleFormChange} required />
              </div>
            </div>
            <button className="id-btn id-btn-primary id-btn-full" type="submit" disabled={loading}>
              {loading ? "Aggiunta…" : "Aggiungi Tavola"}
            </button>
          </form>
        </div>
      )}

      <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(232,240,247,0.3)", marginBottom: "0.75rem" }}>
        Inventario · Noleggi di oggi
      </p>
      {boards.length === 0
        ? <p className="id-empty">Nessuna tavola nel sistema.</p>
        : boards.map((b) => {
          const todayRentals = boardRentalsToday(b.id);
          return (
            <div key={b.id} className="id-board-row">
              <div style={{ flex: 1 }}>
                <div className="id-board-name">{b.size} {typeLabel[b.type] || b.type}</div>
                {todayRentals.length > 0 && (
                  <div className="id-board-rentals">
                    {todayRentals.map((r, i) => (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: i > 0 ? "0.25rem" : 0 }}>
                        <button className="id-username-link" style={{ fontSize: "0.78rem" }}
                          onClick={() => onStudentClick(r.username)}>
                          {r.username}
                        </button>
                        <span style={{ fontSize: "0.72rem", color: "rgba(232,240,247,0.3)" }}>
                          {r.start_time?.slice(0,5)}→{r.end_time?.slice(0,5)}
                        </span>
                        <span className={`id-checkin-badge ${r.checked_in ? "id-checkin-badge-in" : "id-checkin-badge-out"}`}
                          style={{ marginLeft: "auto" }}>
                          {r.checked_in ? "✓" : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <label className="id-toggle" title={b.is_available ? "Disponibile" : "Non disponibile"}>
                <input type="checkbox" checked={b.is_available}
                  onChange={() => toggleAvailability(b)} />
                <span className="id-toggle-slider" />
              </label>
              <span style={{
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em",
                color: b.is_available ? "#1de9b4" : "rgba(255,128,128,0.6)",
                minWidth: 72, textAlign: "right",
              }}>
                {b.is_available ? "DISPONIBILE" : "NON DISPON."}
              </span>
              <button className="id-btn id-btn-danger id-btn-sm"
                onClick={() => deleteBoard(b.id)}>✕</button>
            </div>
          );
        })
      }
    </>
  );
}

// ══════════════════════════════════════════════
//  Tab: Studenti
// ══════════════════════════════════════════════
const levelOrder = ['beginner', 'intermediate', 'advanced'];
const levelLabelMap = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzato' };
const levelPill = { beginner: 'id-pill id-pill-green', intermediate: 'id-pill id-pill-yellow', advanced: 'id-pill id-pill-red' };
const boardLabel = { shortboard: 'Shortboard', longboard: 'Longboard', 'soft-top': 'Soft-top' };

function progressionPercent(levels) {
  // 0–33% = beginner only, 34–66% = intermediate reached, 67–100% = advanced reached
  if (!levels) return 0;
  const total = (levels.beginner || 0) + (levels.intermediate || 0) + (levels.advanced || 0);
  if (total === 0) return 0;
  if (levels.advanced > 0) return Math.min(100, 67 + Math.floor((levels.advanced / total) * 33));
  if (levels.intermediate > 0) return Math.min(66, 34 + Math.floor((levels.intermediate / total) * 33));
  return Math.min(33, Math.floor((levels.beginner / total) * 33));
}

function StudentCard({ student, autoOpen }) {
  const [open, setOpen] = useState(autoOpen || false);
  const cardRef = useRef(null);
  const initials = student.username.slice(0, 2).toUpperCase();
  const pct = progressionPercent(student.levels);

  useEffect(() => {
    if (autoOpen) {
      setOpen(true);
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [autoOpen]);

  return (
    <div ref={cardRef} className={`id-student-card${autoOpen ? ' highlighted' : ''}`}>
      <div className="id-student-header" onClick={() => setOpen((o) => !o)}>
        <div className="id-student-avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="id-student-name">{student.username}</div>
          {student.email && <div className="id-student-email">{student.email}</div>}
        </div>
        <div className="id-student-pills">
          {student.current_level && (
            <span className={levelPill[student.current_level] || 'id-pill id-pill-grey'}>
              {levelLabelMap[student.current_level]}
            </span>
          )}
          <span className="id-pill id-pill-teal">{student.total_lessons} lez.</span>
        </div>
        <span className={`id-chevron${open ? ' open' : ''}`}>▼</span>
      </div>

      {open && (
        <div className="id-student-detail">
          {/* Stats row */}
          <div className="id-stat-row">
            <div className="id-stat-box">
              <span className="id-stat-num">{student.total_lessons}</span>
              <div className="id-stat-lbl">Lezioni</div>
            </div>
            <div className="id-stat-box">
              <span className="id-stat-num">{student.total_rentals}</span>
              <div className="id-stat-lbl">Noleggi</div>
            </div>
            <div className="id-stat-box">
              <span className="id-stat-num">{student.cancelled || 0}</span>
              <div className="id-stat-lbl">Cancellate</div>
            </div>
          </div>

          {/* Progression bar */}
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(232,240,247,0.3)' }}>Progressione</span>
              <span style={{ fontSize: '0.68rem', color: '#1de9d8' }}>{pct}%</span>
            </div>
            <div className="id-progress-bar-wrap">
              <div className="id-progress-bar" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Level breakdown */}
          {levelOrder.map((lvl) => {
            const count = student.levels?.[lvl] || 0;
            const total = student.total_lessons || 1;
            return (
              <div key={lvl} className="id-level-row">
                <span className="id-level-row-label">{levelLabelMap[lvl]}</span>
                <div style={{ flex: 1 }}>
                  <div className="id-progress-bar-wrap">
                    <div className="id-progress-bar"
                      style={{
                        width: `${Math.round((count / total) * 100)}%`,
                        background: lvl === 'beginner' ? '#1de9b4'
                          : lvl === 'intermediate' ? '#ffc128' : '#ff8080',
                      }} />
                  </div>
                </div>
                <span className="id-level-row-count">{count}</span>
              </div>
            );
          })}

          {/* Board types */}
          {student.total_rentals > 0 && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(232,240,247,0.3)', marginBottom: '0.4rem' }}>
                Tavole noleggiate
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {Object.entries(student.board_types || {}).map(([type, count]) => (
                  <span key={type} className="id-pill id-pill-grey">
                    {boardLabel[type] || type} ×{count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Last activity */}
          {(student.last_lesson_date || student.last_rental_date) && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.75rem', color: 'rgba(232,240,247,0.3)' }}>
              {student.last_lesson_date && <span>Ultima lezione: {student.last_lesson_date}</span>}
              {student.last_lesson_date && student.last_rental_date && <span style={{ margin: '0 0.5rem' }}>·</span>}
              {student.last_rental_date && <span>Ultimo noleggio: {student.last_rental_date}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StudentsTab({ targetStudent, clearTarget }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('instructor/students/')
      .then((r) => setStudents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // When a target arrives, clear any search filter so the card is visible
  useEffect(() => {
    if (targetStudent) setSearch('');
  }, [targetStudent]);

  const filtered = students.filter((s) =>
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="id-empty">Caricamento…</p>;

  return (
    <>
      <input
        className="id-search"
        placeholder="Cerca per nome o email…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); clearTarget(); }}
      />

      {filtered.length === 0
        ? <p className="id-empty">{search ? 'Nessun risultato.' : 'Nessuno studente ancora.'}</p>
        : filtered.map((s) => (
          <StudentCard
            key={s.id}
            student={s}
            autoOpen={s.username === targetStudent}
          />
        ))
      }
    </>
  );
}

// ── QR Scanner sub-component ──────────────────────────────────────────────────
function QRScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [manualRef, setManualRef] = useState("");

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setScanning(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const tick = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(tick); return;
    }
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(img.data, img.width, img.height);
    if (code?.data) { stopCamera(); lookupRef(code.data); }
    else { rafRef.current = requestAnimationFrame(tick); }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setScanning(true); tick();
    } catch { setResult({ error: "Impossibile accedere alla fotocamera." }); }
  };

  const lookupRef = async (ref) => {
    try {
      const r = await API.get(`instructor/checkin/?ref=${ref}`);
      setResult(r.data);
    } catch (err) {
      setResult({ error: err.response?.data?.error || "QR non riconosciuto." });
    }
  };

  const confirm = async () => {
    setConfirming(true);
    try {
      const payload = result.type === "rental"
        ? { ref: result.data.reference }
        : { ref: result.data.reference };
      const r = await API.post("instructor/checkin/", payload);
      setResult(r.data);
    } catch { setResult((p) => ({ ...p, error: "Errore nella conferma." })); }
    finally { setConfirming(false); }
  };

  const reset = () => { setResult(null); setManualRef(""); };
  const alreadyIn = result?.data?.checked_in;

  return (
    <>
      {!result && (
        <>
          <div className="id-scanner-wrap">
            <video ref={videoRef} playsInline muted />
            {scanning && (
              <div className="id-scanner-overlay">
                <div className="id-scanner-frame" />
                <div className="id-scanner-line" />
              </div>
            )}
            {!scanning && (
              <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"0.75rem",background:"rgba(3,14,26,0.85)" }}>
                <span style={{ fontSize:"2.5rem" }}>📷</span>
                <button className="id-btn id-btn-primary id-btn-md" onClick={startCamera}>Avvia Scanner</button>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} style={{ display:"none" }} />
          {scanning && (
            <button className="id-btn id-btn-danger id-btn-full" onClick={stopCamera} style={{ marginBottom:"1rem" }}>
              Ferma Scanner
            </button>
          )}
          <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1rem" }}>
            <input className="id-input" placeholder="Incolla UUID riferimento…"
              value={manualRef} onChange={(e) => setManualRef(e.target.value)} />
            <button className="id-btn id-btn-primary id-btn-md"
              disabled={!manualRef.trim()} onClick={() => lookupRef(manualRef.trim())}>
              Cerca
            </button>
          </div>
        </>
      )}

      {result?.error && (
        <div className="id-checkin-result id-checkin-err">
          <div className="id-checkin-result-name">Non trovato</div>
          <div className="id-checkin-result-detail">{result.error}</div>
          <button className="id-btn id-btn-roster id-btn-md" onClick={reset}>Riprova</button>
        </div>
      )}

      {result?.data && (
        <div className="id-checkin-result id-checkin-ok">
          <div className="id-checkin-result-name">{result.data.username}</div>
          <div className="id-checkin-result-detail">
            {result.type === "rental"
              ? `Noleggio · ${result.data.date} · ${result.data.start_time?.slice(0,5)}→${result.data.end_time?.slice(0,5)}`
              : `Lezione · ${result.data.lesson_date} ${result.data.lesson_time?.slice(0,5)} · ${result.data.slot_level}`}
          </div>
          <span className={`id-checkin-badge ${alreadyIn ? "id-checkin-badge-in" : "id-checkin-badge-out"}`}
            style={{ marginBottom:"0.75rem", display:"inline-flex" }}>
            {alreadyIn ? "✓ Già confermato" : "Non ancora confermato"}
          </span>
          <div style={{ display:"flex", gap:"0.6rem", marginTop:"0.5rem" }}>
            {!alreadyIn && (
              <button className="id-btn id-btn-primary id-btn-md" disabled={confirming} onClick={confirm}>
                {confirming ? "…" : "✓ Conferma"}
              </button>
            )}
            <button className="id-btn id-btn-roster id-btn-md" onClick={reset}>Scansiona altro</button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Lessons check-in list ─────────────────────────────────────────────────────
function LessonsCheckin() {
  const [bookings, setBookings] = useState(null);

  const load = useCallback(() => {
    API.get(`instructor/bookings/?date=${today()}`)
      .then((r) => setBookings(r.data))
      .catch(() => setBookings([]));
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirm = async (b) => {
    await API.post("instructor/checkin/", { ref: String(b.reference) });
    setBookings((prev) => prev.map((x) => x.id === b.id ? { ...x, checked_in: true } : x));
  };

  if (!bookings) return <p className="id-empty">Caricamento…</p>;

  // Group by lesson (date+time), then by slot level
  const grouped = {};
  bookings.filter((b) => b.status !== "cancelled").forEach((b) => {
    const key = `${b.lesson_date} ${b.lesson_time?.slice(0,5)}`;
    if (!grouped[key]) grouped[key] = {};
    const slotKey = `${b.slot_level} · ${b.slot_instructor}`;
    if (!grouped[key][slotKey]) grouped[key][slotKey] = [];
    grouped[key][slotKey].push(b);
  });

  const keys = Object.keys(grouped);
  if (keys.length === 0) return <p className="id-empty">Nessuna lezione oggi.</p>;

  return (
    <>
      {keys.map((sessionKey) => (
        <div key={sessionKey} className="id-ci-group">
          <div className="id-ci-group-header">
            🏄 {sessionKey}
          </div>
          {Object.entries(grouped[sessionKey]).map(([slotKey, members]) => {
            const checkedCount = members.filter((m) => m.checked_in).length;
            return (
              <div key={slotKey} style={{ marginBottom:"0.75rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.3rem" }}>
                  <span className={`id-badge ${levelBadge[members[0]?.slot_level]?.replace("id-badge ","") || ""}`}
                    style={{ fontSize:"0.6rem" }}>
                    {levelLabel[members[0]?.slot_level] || slotKey.split(" · ")[0]}
                  </span>
                  <span style={{ fontSize:"0.72rem", color:"rgba(232,240,247,0.35)" }}>
                    {members[0]?.slot_instructor}
                  </span>
                  <span className="id-ci-progress">{checkedCount}/{members.length} presenti</span>
                </div>
                {members.map((b) => (
                  <div key={b.id} className={`id-ci-row${b.checked_in ? " done" : ""}`}>
                    <span className="id-ci-name">{b.username}</span>
                    <button
                      className={`id-ci-btn ${b.checked_in ? "id-ci-btn-done" : "id-ci-btn-pending"}`}
                      onClick={() => !b.checked_in && confirm(b)}
                      title={b.checked_in ? "Già presente" : "Conferma presenza"}
                    >
                      {b.checked_in ? "✓" : "○"}
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}

// ── Rentals check-in list ─────────────────────────────────────────────────────
function RentalsCheckin() {
  const [rentals, setRentals] = useState(null);

  const load = useCallback(() => {
    API.get(`instructor/rentals/?date=${today()}`)
      .then((r) => setRentals(r.data))
      .catch(() => setRentals([]));
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirm = async (r) => {
    await API.post("instructor/checkin/", { ref: String(r.reference) });
    setRentals((prev) => prev.map((x) => x.id === r.id ? { ...x, checked_in: true } : x));
  };

  if (!rentals) return <p className="id-empty">Caricamento…</p>;
  if (rentals.length === 0) return <p className="id-empty">Nessun noleggio oggi.</p>;

  // Group by board
  const grouped = {};
  rentals.forEach((r) => {
    const key = `${r.board_size} ${r.board_type}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });

  const checkedTotal = rentals.filter((r) => r.checked_in).length;

  return (
    <>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"0.75rem" }}>
        <span className="id-ci-progress" style={{ marginLeft:0 }}>
          {checkedTotal}/{rentals.length} confermati oggi
        </span>
      </div>
      {Object.entries(grouped).map(([boardKey, items]) => (
        <div key={boardKey} className="id-ci-group">
          <div className="id-ci-group-header">🛹 {boardKey}</div>
          {items.sort((a,b) => a.start_time.localeCompare(b.start_time)).map((r) => (
            <div key={r.id} className={`id-ci-row${r.checked_in ? " done" : ""}`}>
              <span className="id-ci-name">{r.username}</span>
              <span className="id-ci-detail">{r.start_time?.slice(0,5)}→{r.end_time?.slice(0,5)}</span>
              <button
                className={`id-ci-btn ${r.checked_in ? "id-ci-btn-done" : "id-ci-btn-pending"}`}
                onClick={() => !r.checked_in && confirm(r)}
                title={r.checked_in ? "Già confermato" : "Conferma ritiro"}
              >
                {r.checked_in ? "✓" : "○"}
              </button>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

// ══════════════════════════════════════════════
//  Tab: Check-in
// ══════════════════════════════════════════════
function CheckInTab() {
  const [sub, setSub] = useState("lessons");

  return (
    <>
      <div className="id-ci-subtabs">
        <button className={`id-ci-subtab${sub === "lessons" ? " active" : ""}`} onClick={() => setSub("lessons")}>
          🏄 Lezioni
        </button>
        <button className={`id-ci-subtab${sub === "rentals" ? " active" : ""}`} onClick={() => setSub("rentals")}>
          🛹 Noleggi
        </button>
        <button className={`id-ci-subtab${sub === "qr" ? " active" : ""}`} onClick={() => setSub("qr")}>
          📷 QR
        </button>
      </div>

      {sub === "lessons" && <LessonsCheckin />}
      {sub === "rentals" && <RentalsCheckin />}
      {sub === "qr"      && <QRScanner />}
    </>
  );
}

// ══════════════════════════════════════════════
//  Main component
// ══════════════════════════════════════════════
export default function InstructorDashboard() {
  const { isLoggedIn, isStaff } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("lessons");
  const [targetStudent, setTargetStudent] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !isStaff) navigate("/");
  }, [isLoggedIn, isStaff, navigate]);

  if (!isLoggedIn || !isStaff) return null;

  const goToStudent = (username) => {
    setTargetStudent(username);
    setTab("students");
  };

  return (
    <>
      <style>{css}</style>
      <div className="id-root">
        <div className="id-header">
          <div className="id-eyebrow">Area Istruttori</div>
          <h1 className="id-page-title">Dashboard Istruttore</h1>
        </div>

        <div className="id-tabs">
          <button className={`id-tab${tab === "lessons" ? " active" : ""}`}
            onClick={() => setTab("lessons")}>
            📋 Lezioni
          </button>
          <button className={`id-tab${tab === "conditions" ? " active" : ""}`}
            onClick={() => setTab("conditions")}>
            🌊 Condizioni
          </button>
          <button className={`id-tab${tab === "boards" ? " active" : ""}`}
            onClick={() => setTab("boards")}>
            🛹 Tavole
          </button>
          <button className={`id-tab${tab === "students" ? " active" : ""}`}
            onClick={() => setTab("students")}>
            👤 Studenti
          </button>
          <button className={`id-tab${tab === "checkin" ? " active" : ""}`}
            onClick={() => setTab("checkin")}>
            ✓ Check-in
          </button>
        </div>

        <div className="id-content">
          {tab === "lessons"    && <LessonsTab onStudentClick={goToStudent} />}
          {tab === "conditions" && <ConditionsTab />}
          {tab === "boards"     && <BoardsTab onStudentClick={goToStudent} />}
          {tab === "students"   && (
            <StudentsTab
              targetStudent={targetStudent}
              clearTarget={() => setTargetStudent(null)}
            />
          )}
          {tab === "checkin"    && <CheckInTab />}
        </div>
      </div>
    </>
  );
}
