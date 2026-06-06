import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getHistory, clearHistory } from "../services/apiService";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data))
      .catch(() => toast.error("Could not load history"))
      .finally(() => setLoading(false));
  }, []);

  const handleClear = async () => {
    if (!window.confirm("Clear all search history?")) return;
    try {
      await clearHistory();
      setHistory([]);
      toast.success("Search history cleared");
    } catch { toast.error("Failed to clear history"); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>⏳ Loading history…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: "#F97316" }}>🕐 Search History</h2>
        {history.length > 0 && (
          <button onClick={handleClear} style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, padding: "8px 16px", color: "#F87171", cursor: "pointer", fontWeight: 600, fontSize: 13,
          }}>🗑️ Clear All</button>
        )}
      </div>
      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>Your recently searched cities with date & time</p>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 30px", color: "#475569" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🕐</div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>No search history yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Search cities in Dashboard to see history here</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {history.map((h, i) => (
            <div key={i}
              onClick={() => navigate("/dashboard")}
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "14px 20px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(249,115,22,0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 22 }}>📍</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{h.city}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>
                    {new Date(h.searchedAt || h.createdAt || Date.now()).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
              <span style={{ color: "#F97316", fontSize: 13, fontWeight: 600 }}>View →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
