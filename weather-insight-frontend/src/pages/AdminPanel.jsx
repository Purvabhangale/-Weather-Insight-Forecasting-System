import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as api from "../services/apiService";

export default function AdminPanel() {
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [popular, setPopular] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, popularRes, statsRes] = await Promise.all([
        api.getAllUsers(),
        api.getPopularCities(),
        api.getSystemStats(),
      ]);
      setUsers(usersRes.data);
      setPopular(popularRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error("Failed to load admin data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.deleteUser(id);
      toast.success(`User "${name}" deleted`);
      await loadData();
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "users", label: "👥 Users" },
    { id: "cities", label: "🏙️ Popular Cities" },
  ];

  const cardStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "20px",
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#64748B" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <div>Loading admin data...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: "#EF4444" }}>
          🛡️ Admin Panel
        </h2>
        <span style={{
          background: "rgba(239,68,68,0.15)", color: "#F87171",
          fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
        }}>ADMIN ONLY</span>
      </div>
      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>
        System monitoring, user management, and analytics
      </p>

      {/* Tab switcher */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 24,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 12, padding: 5, width: "fit-content",
      }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "9px 18px", borderRadius: 9, border: "none", cursor: "pointer",
            background: tab === t.id ? "linear-gradient(90deg,#EF4444,#DC2626)" : "transparent",
            color: tab === t.id ? "#fff" : "#94A3B8",
            fontWeight: tab === t.id ? 700 : 500, fontSize: 13, transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === "overview" && stats && (
        <div>
          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Total Users", value: stats.totalUsers ?? 0, icon: "👥", color: "#F97316" },
              { label: "Total Searches", value: stats.totalSearches ?? 0, icon: "🔍", color: "#38BDF8" },
              { label: "Favorites Saved", value: stats.totalFavorites ?? 0, icon: "⭐", color: "#FCD34D" },
              { label: "API Status", value: stats.apiStatus ?? "Online", icon: "🟢", color: "#22C55E" },
            ].map((s, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* System Info */}
          <div style={cardStyle}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#94A3B8", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>
              System Info
            </div>
            {[
              { label: "Frontend", value: "React.js 18 + Vite" },
              { label: "Backend", value: "Spring Boot 3.x (Java 17)" },
              { label: "Database", value: "MySQL 8.0" },
              { label: "Weather API", value: "OpenWeatherMap API" },
              { label: "Auth", value: "JWT Token-based" },
              { label: "API Port", value: "localhost:8081" },
              { label: "API Status", value: "🟢 Online" },
            ].map((r, i, arr) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <span style={{ color: "#94A3B8", fontSize: 13 }}>{r.label}</span>
                <span style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {tab === "users" && (
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontWeight: 700, fontSize: 14, color: "#94A3B8" }}>
            All Registered Users ({users.length})
          </div>
          {users.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#475569" }}>
              No users found
            </div>
          ) : (
            users.map((u, i) => (
              <div key={u.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 24px",
                borderBottom: i < users.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                {/* Avatar + Info */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: u.role === "ADMIN" ? "rgba(239,68,68,0.2)" : "rgba(249,115,22,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 16,
                    color: u.role === "ADMIN" ? "#F87171" : "#F97316",
                  }}>
                    {(u.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{u.email}</div>
                  </div>
                </div>

                {/* Role + Delete */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                    background: u.role === "ADMIN" ? "rgba(239,68,68,0.15)" : "rgba(100,116,139,0.15)",
                    color: u.role === "ADMIN" ? "#F87171" : "#94A3B8",
                  }}>{u.role}</span>
                  {u.role !== "ADMIN" && (
                    <button onClick={() => handleDelete(u.id, u.name)} style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      borderRadius: 8, padding: "6px 14px",
                      color: "#F87171", cursor: "pointer",
                      fontSize: 12, fontWeight: 600,
                    }}>🗑️ Delete</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── POPULAR CITIES TAB ── */}
      {tab === "cities" && (
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontWeight: 700, fontSize: 14, color: "#94A3B8" }}>
            Most Searched Cities
          </div>
          {popular.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#475569" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>No search data yet</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Users need to search cities first</div>
            </div>
          ) : (
            popular.map((p, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 24px",
                borderBottom: i < popular.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: i === 0 ? "rgba(252,211,77,0.2)" : i === 1 ? "rgba(148,163,184,0.2)" : i === 2 ? "rgba(180,83,9,0.2)" : "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 13,
                    color: i === 0 ? "#FCD34D" : i === 1 ? "#94A3B8" : i === 2 ? "#B45309" : "#64748B",
                  }}>#{i + 1}</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>📍 {p.city}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 100, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      width: `${Math.min((p.count / (popular[0]?.count || 1)) * 100, 100)}%`,
                      height: "100%",
                      background: i === 0 ? "#F97316" : "#38BDF8",
                      borderRadius: 3,
                    }} />
                  </div>
                  <span style={{ color: "#38BDF8", fontWeight: 700, fontSize: 14, minWidth: 30 }}>
                    {p.count}
                  </span>
                  <span style={{ color: "#64748B", fontSize: 12 }}>searches</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}