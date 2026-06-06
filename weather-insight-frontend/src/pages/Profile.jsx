import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/apiService";
import { getFavorites } from "../services/apiService";
import { getHistory } from "../services/apiService";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [favCount, setFavCount] = useState(0);
  const [histCount, setHistCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => null),
      getFavorites().catch(() => ({ data: [] })),
      getHistory().catch(() => ({ data: [] })),
    ]).then(([prof, favs, hist]) => {
      if (prof) { setProfile(prof.data); setForm({ name: prof.data.name, email: prof.data.email }); }
      setFavCount(favs.data.length);
      setHistCount(hist.data.length);
    }).finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      toast.success("Profile updated!");
      setProfile((p) => ({ ...p, ...form }));
      setEditing(false);
    } catch { toast.error("Update failed"); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>⏳ Loading profile…</div>;

  const displayUser = profile || user;

  return (
    <div style={{ maxWidth: 540 }}>
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 24, color: "#F97316" }}>👤 My Profile</h2>

      {/* Avatar + Info */}
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "28px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
          <div style={{
            width: 68, height: 68, borderRadius: "50%",
            background: "linear-gradient(135deg,#F97316,#EF4444)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800, color: "#fff", flexShrink: 0,
          }}>{(displayUser?.name || "U").charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{displayUser?.name}</div>
            <div style={{ color: "#64748B", fontSize: 13 }}>{displayUser?.email}</div>
            <span style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 20, marginTop: 6, display: "inline-block", fontWeight: 600,
              background: displayUser?.role === "ADMIN" ? "rgba(239,68,68,0.15)" : "rgba(249,115,22,0.15)",
              color: displayUser?.role === "ADMIN" ? "#F87171" : "#F97316",
            }}>
              {displayUser?.role === "ADMIN" ? "🛡️ Administrator" : "👤 User"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Saved Cities", value: favCount, icon: "⭐" },
            { label: "Cities Searched", value: histCount, icon: "🔍" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#F97316", marginTop: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Edit form */}
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{
            width: "100%", padding: "12px", background: "rgba(249,115,22,0.1)",
            border: "1px solid rgba(249,115,22,0.3)", borderRadius: 12,
            color: "#F97316", fontWeight: 700, cursor: "pointer", fontSize: 14,
          }}>✏️ Edit Profile</button>
        ) : (
          <form onSubmit={handleUpdate}>
            <label style={labelStyle}>Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" style={{ ...btnStyle, flex: 1 }}>Save Changes</button>
              <button type="button" onClick={() => setEditing(false)} style={{ ...btnStyle, flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      <button onClick={logout} style={{
        width: "100%", padding: "13px", background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14,
        color: "#F87171", fontWeight: 700, fontSize: 14, cursor: "pointer",
      }}>🚪 Sign Out</button>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 };
const inputStyle = {
  width: "100%", padding: "11px 13px", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#F1F5F9",
  fontSize: 14, marginBottom: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
const btnStyle = {
  padding: "12px", background: "linear-gradient(90deg,#F97316,#EF4444)",
  border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
};
