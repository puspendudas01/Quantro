import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { runLogoutFlow } from '../utils/authSession';
import BrandLogo from './BrandLogo';

export default function Topbar({ badge, extra }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = async () => {
    await runLogoutFlow({ apiClient: api, logout, onError: () => console.warn("Logout failed") });
    navigate("/");
  };
  const btn = {
    padding: "6px 14px",
    border: "1px solid var(--border-input)",
    borderRadius: "var(--radius-md)",
    background: "#fff",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600
  };
  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      height: "var(--topbar-height)",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(10px)",
      borderTop: "3px solid var(--accent)",
      borderBottom: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <BrandLogo variant="text" width={140} />
        {badge}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Welcome, <strong>{user?.fullName}</strong>
        </span>
        {extra}
        <button onClick={signOut} style={btn}>Sign out</button>
      </div>
    </div>
  );
}
