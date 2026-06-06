import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/forecast",  icon: "📅", label: "Forecast" },
  { to: "/alerts",    icon: "🔔", label: "Alerts" },
  { to: "/trends",    icon: "📊", label: "Trends" },
  { to: "/aqi",       icon: "🌬️", label: "Air Quality" },
  { to: "/favorites", icon: "⭐", label: "Favorites" },
  { to: "/history",   icon: "🕐", label: "History" },
  { to: "/profile",   icon: "👤", label: "Profile" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "admin" ||
    user?.email === "admin@weather.com";

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <aside style={{
        width: 230, background: "rgba(10,18,36,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        padding: "22px 0", position: "fixed",
        height: "100vh", left: 0, top: 0, zIndex: 100, overflowY: "auto",
      }}>

        {/* Logo */}
        <div style={{ padding: "0 20px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 28 }}>🌤️</div>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#F97316", letterSpacing: 0.5, marginTop: 4 }}>
            Weather Insight
          </div>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1.2, textTransform: "uppercase" }}>
            Forecasting System
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {navItems.map((n) => (
            <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px", borderRadius: 10, marginBottom: 2,
              background: isActive
                ? n.to === "/aqi" ? "rgba(34,197,94,0.13)" : "rgba(249,115,22,0.13)"
                : "transparent",
              borderLeft: isActive
                ? n.to === "/aqi" ? "3px solid #22C55E" : "3px solid #F97316"
                : "3px solid transparent",
              color: isActive
                ? n.to === "/aqi" ? "#22C55E" : "#F97316"
                : "#94A3B8",
              fontWeight: isActive ? 700 : 500,
              fontSize: 13, textDecoration: "none", transition: "all 0.2s",
            })}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}

          {/* Admin link */}
          {isAdmin && (
            <>
              <div style={{
                margin: "14px 14px 6px", fontSize: 10, color: "#475569",
                textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700,
                borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14,
              }}>Admin</div>
              <NavLink to="/admin" style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 14px", borderRadius: 10, marginBottom: 2,
                background: isActive ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.06)",
                borderLeft: isActive ? "3px solid #EF4444" : "3px solid rgba(239,68,68,0.3)",
                color: isActive ? "#EF4444" : "#F87171",
                fontWeight: 700, fontSize: 13, textDecoration: "none",
              })}>
                <span style={{ fontSize: 16 }}>🛡️</span>
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>

        {/* User footer */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ padding: "8px 14px", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#E2E8F0" }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: "#475569" }}>{user?.email}</div>
            <span style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 20, marginTop: 4,
              display: "inline-block", fontWeight: 700,
              background: isAdmin ? "rgba(239,68,68,0.15)" : "rgba(249,115,22,0.12)",
              color: isAdmin ? "#F87171" : "#F97316",
            }}>
              {isAdmin ? "🛡️ Admin" : "👤 User"}
            </span>
          </div>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "9px 14px",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, background: "rgba(239,68,68,0.07)",
            color: "#F87171", cursor: "pointer", fontWeight: 600, fontSize: 12,
          }}>🚪 Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: 230, flex: 1,
        padding: "28px 32px", minHeight: "100vh", overflowX: "hidden",
      }}>
        <Outlet />
      </main>
    </div>
  );
}
