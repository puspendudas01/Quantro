import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/authApi';

const PUBLIC = process.env.PUBLIC_URL;
const qNavyImg = `${PUBLIC}/landing/q-navy.png`;
const qArrowImg = `${PUBLIC}/landing/q-arrow.png`;
const quantroOnlyImg = `${PUBLIC}/landing/quantro-only.png`;
const logoTextImg = `${PUBLIC}/landing/logo-text.png`;
const bgImg = `${PUBLIC}/landing/background.png`;

// Configurable Team & Mentorship
const DEVELOPERS = [
  'Mayukh Ghosh',
  'Puspendu Sekhar Das',
  'Ahana Bandhu',
  'Oheli Das',
  'M. Kalkita',
];
const MENTOR = 'Prof. Pradipta Sarkar';

/**
 * QuantroLandingPage2 Component
 *
 * Sequence:
 *  1. Initial Center State: Big hexagonal Q centered in the middle of the screen.
 *  2. Step 1 (t=350ms): Hexagonal Q fades in from 0 to 100 opacity in center.
 *  3. Step 2 (t=1150ms): Teal arrow draws smoothly along path without blue dot.
 *  4. Step 3 (t=2400ms): Hexagonal Q glides upward to top-center header position.
 *  5. Step 4 (t=3240ms, 60% of travel): QUANTRO wordmark emerges from behind Q, locking side-by-side at the top.
 *  6. Step 5 (t=3800ms): Split layout fades in below (Left: institutional writings, Right: elevated login window).
 */


const landingStyles = `


/* ==========================================================================
   LandingPage2.css - QUANTRO Top-Centered Animated Logo with Split-Screen & Elevated Login
   ========================================================================== */

.quantro-landing-wrapper {
  --u: clamp(0.6px, 0.1vw, 1px);
  --brand-navy-dark: #001a33;
  --brand-navy: #002244;
  --brand-navy-light: #0a3268;
  --brand-teal: #00c5cd;
  --brand-teal-dark: #0099a0;
  --brand-teal-light: #e0f9fb;
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --text-light: #94a3b8;
  --bg-card: rgba(255, 255, 255, 0.96);
  --border-card: rgba(255, 255, 255, 0.95);
  --border-input: #cbd5e1;
  --border-input-focus: #00c5cd;

  /* Elevated Card Shadow Matrix */
  --elevation-shadow: 
    0 24px 48px -12px rgba(0, 34, 68, 0.22),
    0 12px 24px -6px rgba(0, 34, 68, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.9);
  --elevation-shadow-hover: 
    0 32px 64px -16px rgba(0, 34, 68, 0.28),
    0 16px 32px -8px rgba(0, 34, 68, 0.16),
    0 0 0 1px rgba(255, 255, 255, 1);
}

.quantro-landing-wrapper * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}


/* ==========================================================================
   Full Page Wrapper with Background Image
   ========================================================================== */
.quantro-landing-wrapper {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-image: url('${bgImg}');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow-x: hidden;
}

/* Subtle background overlay for high readability */
.quantro-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(240, 246, 254, 0.38) 50%, rgba(224, 242, 254, 0.28) 100%);
  backdrop-filter: blur(1px);
  pointer-events: none;
  z-index: 1;
}

/* Optional Control Pill (Replay / Skip Animation) */
.landing-controls-pill {
  position: fixed;
  top: 14px;
  right: 16px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(10px);
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
}

.btn-pill-action {
  background: #00c5cd;
  color: #002244;
  border: none;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 11.5px;
  transition: all 0.2s;
}

.btn-pill-action:hover {
  background: #00e5ee;
  transform: scale(1.03);
}

.btn-pill-skip {
  background: transparent;
  color: #cbd5e1;
  border: none;
  font-weight: 600;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 11.5px;
  transition: color 0.2s;
}

.btn-pill-skip:hover {
  color: #ffffff;
}

/* ==========================================================================
   TOP BRANDING ANIMATION STAGE (Centered in Middle, then glides to top)
   ========================================================================== */
.hero-branding-stage {
  position: relative;
  z-index: 20;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 20px 0 20px;
  transition: min-height 1.4s cubic-bezier(0.16, 1, 0.3, 1),
              padding-top 1.4s cubic-bezier(0.16, 1, 0.3, 1),
              margin-bottom 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Initial Center Stage */
.stage-center {
  min-height: 88vh;
}

/* Final Upward Header Stage (At the top of all, centered in middle) */
.stage-upward {
  min-height: 120px;
  padding-top: 14px;
  margin-top: calc(-5 * var(--u));
  margin-bottom: 8px;
}

/* Header Branding Row: Locks Q and QUANTRO side-by-side */
.brand-header-group {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  width: 100%;
}

/* Emblem Container: Starts centered, then glides to the left */
.emblem-wrapper {
  position: relative;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center center;
}

.emblem-center-pos {
  transform: scale(1.18) translate(0px, 0px);
}

/* Header position: Q shifts to the left with scale 0.55 */
.emblem-header-pos {
  transform: translateX(calc(-126 * var(--u))) scale(0.8)
}

.emblem-inner-box {
  position: relative;
  width: calc(224 * var(--u));
  height: calc(192 * var(--u));
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Navy Q Body */
.hex-q-navy {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 1s ease;
  display: block;
  filter: drop-shadow(0 6px 14px rgba(0, 34, 68, 0.16));
}

.q-visible {
  opacity: 1;
}

/* Teal Trend Arrow: Draws smoothly along path without blue dot */
.arrow-layer-clip {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  clip-path: polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%);
  opacity: 0;
}

.arrow-layer-drawing {
  animation: drawArrowMask 1.15s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes drawArrowMask {
  0% {
    clip-path: polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%);
    opacity: 0;
  }
  10% {
    opacity: 1;
    clip-path: polygon(0% 100%, 25% 65%, 25% 65%, 0% 100%);
  }
  50% {
    clip-path: polygon(0% 100%, 45% 35%, 55% 65%, 0% 100%);
  }
  100% {
    clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%);
    opacity: 1;
  }
}

.hex-q-arrow {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* QUANTRO Wordmark: Emerges from behind Q at 60% distance, locks AFTER Q */
.wordmark-behind {
  position: absolute;
  z-index: 15;
  opacity: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  overflow: hidden;
  transform: translateX(calc(-40 * var(--u)));
  clip-path: inset(0 0 0 100%);
  transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
              clip-path 0.85s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
}

.wordmark-revealed {
  opacity: 1;
  clip-path: inset(0 0 0 0%);
  transform: translateX(calc(60 * var(--u)));
}

.wordmark-img {
  height: calc(44 * var(--u));
  width: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 3px 8px rgba(0, 34, 68, 0.12));
}

/* Subtitle below the centered logo */
.brand-subtitle-top {
  font-size: 13.5px;
  letter-spacing: 0.28em;
  font-weight: 700;
  color: var(--brand-navy);
  text-transform: uppercase;
  margin-top: -6px;
  opacity: 0;
  transition: opacity 0.75s ease;
  text-align: center;
}

.subtitle-visible {
  opacity: 1;
}

/* ==========================================================================
   MAIN 2-COLUMN SPLIT CONTENT (Left: Writings, Right: Elevated Login Window)
   Reveals smoothly when Stage >= 5
   ========================================================================== */
.landing-split-body {
  position: relative;
  z-index: 20;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 10px 24px 36px 24px;
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 42px;
  align-items: center;
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.split-body-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* ==========================================================================
   LEFT COLUMN: Existing Writings & Institutional Details
   ========================================================================== */
.left-writings-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 8px;
}

.badge-tag-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  margin-bottom: 12px;
  background: rgba(0, 34, 68, 0.06);
  color: var(--brand-navy);
  border: 1px solid rgba(0, 34, 68, 0.14);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.portal-lead-text {
  font-size: 16.5px;
  line-height: 1.65;
  color: #334155;
  margin-bottom: 24px;
  max-width: 580px;
}

/* Feature Strips / Cards */
.features-strip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.feature-strip-item {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  padding: 14px 12px;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 34, 68, 0.05);
  transition: all 0.25s ease;
}

.feature-strip-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 20px rgba(0, 34, 68, 0.09);
  border-color: rgba(0, 197, 205, 0.4);
}

.feature-icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--brand-teal-light);
  color: var(--brand-navy);
  font-size: 14px;
  margin-bottom: 8px;
}

.feature-strip-item strong {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--brand-navy);
  margin-bottom: 2px;
}

.feature-strip-item span {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.35;
}

/* Team Credits */
.team-credits-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  padding: 14px 18px;
  backdrop-filter: blur(8px);
  max-width: 580px;
}

.team-credits-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.team-tag-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-teal-dark);
}

.team-list-names {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.team-person:not(:last-child)::after {
  content: "•";
  color: var(--brand-teal);
  margin-left: 6px;
  margin-right: 2px;
  font-weight: 900;
}

.mentor-row-block {
  margin-top: 6px;
  padding-top: 6px;
  text-align: center;
  border-top: 1px dashed rgba(100, 116, 139, 0.2);
  font-size: 14px;
  color: var(--text-muted);
}

.mentor-name-highlight {
  font-weight: 700;
  color: var(--brand-navy);
}

/* ==========================================================================
   RIGHT COLUMN: Elevated Login Window
   ========================================================================= */
.right-login-col {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}

.elevated-login-window {
  width: 100%;
  max-width: 430px;
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-card);
  border-radius: 20px;
  padding: 34px 30px 30px 30px;
  box-shadow: var(--elevation-shadow);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
              box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.elevated-login-window:hover {
  transform: translateY(-4px);
  box-shadow: var(--elevation-shadow-hover);
}

/* Top accent bar */
.login-window-top-accent {
  position: absolute;
  top: 0;
  left: 24px;
  right: 24px;
  height: 4px;
  background: linear-gradient(90deg, var(--brand-navy), var(--brand-teal), var(--brand-navy));
  border-radius: 0 0 6px 6px;
}

.login-header-group {
  text-align: center;
  margin-bottom: 24px;
}

.login-brand-icon {
  display: inline-flex;
  justify-content: center;
  margin-bottom: 10px;
}

.login-logo-mini {
  height: 36px;
  width: auto;
  object-fit: contain;
}

.login-title-text {
  font-size: 21px;
  font-weight: 800;
  color: var(--brand-navy);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.login-subtitle-text {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Form Styles */
.login-form-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-field-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-wrapper-relative {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon-left {
  position: absolute;
  left: 12px;
  color: var(--text-light);
  font-size: 16px;
  pointer-events: none;
  transition: color 0.2s;
}

.input-element-styled {
  width: 100%;
  padding: 10.5px 14px 10.5px 38px;
  border: 1.5px solid var(--border-input);
  background-color: #ffffff;
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
  transition: all 0.2s ease;
}

.input-element-styled:focus {
  border-color: var(--border-input-focus);
  box-shadow: 0 0 0 3.5px rgba(0, 197, 205, 0.22);
  background-color: #ffffff;
}

.input-wrapper-relative:focus-within .input-icon-left {
  color: var(--brand-teal-dark);
}

.btn-toggle-eye {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-toggle-eye:hover {
  color: var(--brand-navy);
}

/* Remember me & forgot */
.row-options-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
  margin-top: -3px;
}

.checkbox-remember-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  cursor: pointer;
}

.checkbox-remember-label input[type="checkbox"] {
  accent-color: var(--brand-teal-dark);
  cursor: pointer;
}

.link-forgot-pass {
  color: var(--brand-navy-light);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.link-forgot-pass:hover {
  color: var(--brand-teal-dark);
  text-decoration: underline;
}

/* Error Banner */
.alert-error-banner {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: shakeError 0.4s ease;
}

@keyframes shakeError {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

/* Submit Button */
.btn-elevated-submit {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-navy-light) 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 18px rgba(0, 34, 68, 0.25);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.btn-elevated-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #021a38 0%, #0c3e7f 100%);
  transform: translateY(-1.5px);
  box-shadow: 0 8px 24px rgba(0, 34, 68, 0.32);
}

.btn-elevated-submit:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

/* Spinner */
.spinner-loader-circle {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spinLoader 0.75s linear infinite;
}

@keyframes spinLoader {
  to { transform: rotate(360deg); }
}

/* Card bottom links */
.card-footer-links-row {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.text-register-hint {
  font-size: 13px;
  color: var(--text-muted);
}

.link-register-action {
  color: var(--brand-navy);
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
}

.link-register-action:hover {
  color: var(--brand-teal-dark);
  text-decoration: underline;
}

.portal-switchers-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 11.5px;
  color: var(--text-light);
}

.btn-role-badge {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: var(--text-secondary);
  padding: 3px 10px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-role-badge:hover {
  background: var(--brand-navy);
  color: #ffffff;
  border-color: var(--brand-navy);
}

/* ==========================================================================
   PAGE FOOTER
   ========================================================================== */
.landing-footer-bar {
  position: relative;
  z-index: 20;
  width: 100%;
  padding: 16px 24px;
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(4px);
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  opacity: 0;
  transition: opacity 0.8s ease;
}

.footer-visible {
  opacity: 1;
}

/* ==========================================================================
   RESPONSIVE BREAKPOINTS
   ========================================================================== */
@media (max-width: 1024px) {
  .landing-split-body {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .left-writings-col {
    padding-right: 0;
    align-items: center;
    text-align: center;
  }

  .badge-tag-row {
    align-self: center;
  }

  .features-strip-grid {
    max-width: 600px;
    width: 100%;
  }

  .team-credits-card {
    width: 100%;
  }
}

@media (max-width: 640px) {

  .brand-subtitle-top {
    font-size: 11.5px;
    letter-spacing: 0.18em;
  }

  .landing-split-body {
    padding: 6px 16px 28px 16px;
  }

  .features-strip-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .elevated-login-window {
    padding: 24px 18px 22px 18px;
    border-radius: 16px;
  }
}`;




export default function LandingPage() {
  const [animStage, setAnimStage] = useState(0);
  const timersRef = useRef([]);

  // Login form state
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const startSequence = () => {
    clearTimers();
    setAnimStage(0);

    const push = (fn, ms) => {
      const t = setTimeout(fn, ms);
      timersRef.current.push(t);
    };

    // Stage 1: Hexagonal Q fades in from 0 -> 100 in center
    push(() => setAnimStage(1), 350);
    // Stage 2: Teal arrow draws smoothly along path (no blue dot)
    push(() => setAnimStage(2), 1150);
    // Stage 3: Q moves upward toward top-center header position
    push(() => setAnimStage(3), 2400);
    // Stage 4: After 60% distance, QUANTRO emerges from behind Q
    push(() => setAnimStage(4), 3240);
    // Stage 5: Reveal lower split portal options & elevated login window
    push(() => setAnimStage(5), 3800);
  };

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    const res = await login(form);
    const user = res.data.data;

    localStorage.setItem('examportal_user', JSON.stringify({
      token: user.token,
      sessionToken: user.sessionToken,
      role: user.role,
      userId: user.userId,
      email: user.email,
    }));
    authLogin(user);

    if (user.role === 'ADMIN') navigate('/admin');
    else if (user.role === 'TEACHER') navigate('/teacher');
    else navigate('/student');
  } catch (err) {
    const msg = err.response?.data?.message || '';
    if (msg.toLowerCase().includes('already logged in')) {
      setError('You are already logged in on another device.');
    } else {
      setError('Login failed. Please check your credentials.');
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    startSequence();
    return clearTimers;
  }, []);

  

  return (
    <div className="quantro-landing-wrapper">
      <style>{landingStyles}</style>
      {/* Background Soft Overlay */}
      <div className="quantro-bg-overlay" />

      {/* TOP BRANDING STAGE: Q & QUANTRO centered in middle, then glides to the top */}
      <header className={`hero-branding-stage ${animStage >= 3 ? 'stage-upward' : 'stage-center'}`}>
        <div className="brand-header-group">
          
          {/* Big Hexagonal Q emblem that moves to header position */}
          <div className={`emblem-wrapper ${animStage >= 3 ? 'emblem-header-pos' : 'emblem-center-pos'}`}>
            <div className="emblem-inner-box">
              {/* Navy Q Body */}
              <img
                src={qNavyImg}
                alt="Hexagonal Q"
                className={`hex-q-navy ${animStage >= 1 ? 'q-visible' : ''}`}
              />

              {/* Teal Trend Arrow */}
              <div className={`arrow-layer-clip ${animStage >= 2 ? 'arrow-layer-drawing' : ''}`}>
                <img
                  src={qArrowImg}
                  alt="Teal Trend Arrow"
                  className="hex-q-arrow"
                />
              </div>
            </div>
          </div>

          {/* QUANTRO Wordmark: Emerges from behind Q at 60% distance */}
          <div className={`wordmark-behind ${animStage >= 4 ? 'wordmark-revealed' : ''}`}>
            <img
              src={quantroOnlyImg}
              alt="QUANTRO"
              className="wordmark-img"
            />
          </div>
        </div>

        {/* Subtitle directly below top-centered logo */}
        <p className={`brand-subtitle-top ${animStage >= 4 ? 'subtitle-visible' : ''}`}>
          Online Examination System
        </p>
      </header>

      {/* LOWER SPLIT SECTION (Left: Writings, Right: Elevated Login Window) */}
      <main className={`landing-split-body ${animStage >= 5 ? 'split-body-visible' : ''}`}>
        
        {/* LEFT COLUMN: Existing Writings & Features */}
        <section className="left-writings-col">
          <div className="badge-tag-row">
            <span>Official Examination Infrastructure</span>
          </div>

          <p className="portal-lead-text">
            Official institutional online examination platform featuring automated AI proctoring,
            multi-factor violation detection, and secure test administration.
          </p>

          {/* Feature Matrix Badges */}
          <div className="features-strip-grid">
            <div className="feature-strip-item">
              <div className="feature-icon-box">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <strong>Secure Lockdown</strong>
              <span>Fullscreen Enforcement</span>
            </div>

            <div className="feature-strip-item">
              <div className="feature-icon-box">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <strong>Anti-Cheat Matrix</strong>
              <span>7 Real-time Traps</span>
            </div>

            <div className="feature-strip-item">
              <div className="feature-icon-box">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <strong>Automated Grading</strong>
              <span>Instant Scorecard Sync</span>
            </div>
          </div>

          {/* Team Credits */}
          <div className="team-credits-card">
            <div className="team-credits-header">
              <span className="team-tag-label">Project Team</span>
            </div>
            <div className="team-list-names">
              {DEVELOPERS.map((name) => (
                <span key={name} className="team-person">{name}</span>
              ))}
            </div>
            <div className="mentor-row-block">
              <span>Mentored by </span>
              <span className="mentor-name-highlight">{MENTOR}</span>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Elevated Login Window */}
        <section className="right-login-col">
          <div className="elevated-login-window">
            <div className="login-window-top-accent" />

            <div className="login-header-group">
              <div className="login-brand-icon">
                <img src={logoTextImg} alt="Quantro" className="login-logo-mini" />
              </div>
              <h3 className="login-title-text">Sign in to your account</h3>
              <p className="login-subtitle-text">Enter your institutional credentials to proceed</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="login-form-content">
              {/* Enrollment Number */}
              <div className="input-field-group">
                <label className="input-field-label" htmlFor="enrollmentIdInput">
                  Enrollment No / User ID
                </label>
                <div className="input-wrapper-relative">
                  <span className="input-icon-left">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    id="enrollmentIdInput"
                    type="text"
                    value={form.identifier}
                    onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))}
                    required
                    placeholder="Enter your enrollment ID"
                    className="input-element-styled"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="input-field-group">
                <div className="input-field-label">
                  <label htmlFor="passInput">Password</label>
                </div>
                <div className="input-wrapper-relative">
                  <span className="input-icon-left">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    id="passInput"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    required
                    placeholder="••••••••••••"
                    className="input-element-styled"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn-toggle-eye"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="row-options-flex">
                <label className="checkbox-remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Please contact your institutional examination administrator to reset credentials.');
                  }}
                  className="link-forgot-pass"
                >
                  Forgot password?
                </a>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert-error-banner" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="btn-elevated-submit">
                {loading ? <span className="spinner-loader-circle" /> : null}
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                {!loading && (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                )}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="card-footer-links-row">
              <p className="text-register-hint">
                Don't have an account?{' '}
                {typeof Link !== 'undefined' ? (
                  <Link to="/register" className="link-register-action">Register</Link>
                ) : (
                  <a href="/register" className="link-register-action">Register</a>
                )}
              </p>

              
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className={`landing-footer-bar ${animStage >= 5 ? 'footer-visible' : ''}`}>
        <span>QUANTRO &copy; {new Date().getFullYear()} &bull; Official Institutional Online Examination Infrastructure</span>
      </footer>
    </div>
  );
}
