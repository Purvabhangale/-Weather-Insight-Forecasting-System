import React, { useState } from "react";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import { fetchCurrentWeather, fetchWeatherByCoords, generateAlerts, getIconUrl } from "../services/weatherService";

const thresholds = [
  { label: "Heat Alert", threshold: "Temp > 38°C", icon: "🔥", color: "#FF6B35" },
  { label: "Cold Wave Alert", threshold: "Temp < 5°C", icon: "🥶", color: "#60A5FA" },
  { label: "Heavy Rain Alert", threshold: "Weather: heavy rain / extreme rain", icon: "🌧️", color: "#1976D2" },
  { label: "Thunderstorm Alert", threshold: "Weather: storm / thunderstorm", icon: "⛈️", color: "#5C6BC0" },
  { label: "Wind Warning", threshold: "Wind > 25 km/h", icon: "💨", color: "#7B1FA2" },
  { label: "Humidity Warning", threshold: "Humidity > 85%", icon: "💧", color: "#00897B" },
  { label: "Fog / Visibility Alert", threshold: "Visibility < 2 km", icon: "🌫️", color: "#78909C" },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAlerts = async (city, lat, lon) => {
    setLoading(true);
    try {
      const w = lat ? await fetchWeatherByCoords(lat, lon) : await fetchCurrentWeather(city);
      setWeather(w);
      setAlerts(generateAlerts(w));
    } catch { toast.error("Could not fetch weather alerts."); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, color: "#F97316" }}>🔔 Weather Alerts</h2>
      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 20 }}>Real-time alert monitoring based on live weather data</p>

      <SearchBar onSearch={loadAlerts} onGeolocate={() => {}} />

      {loading && <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>⏳ Checking conditions…</div>}

      {!loading && weather && (
        <div style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 16, color: "#94A3B8", fontSize: 13 }}>
            Showing alerts for <strong style={{ color: "#F97316" }}>{weather.name}, {weather.sys.country}</strong>
            {" "}· updated {new Date().toLocaleTimeString()}
          </div>

          {alerts.length === 0 ? (
            <div style={{
              background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
              borderRadius: 20, padding: "50px 30px", textAlign: "center",
            }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#34D399" }}>All Clear!</div>
              <div style={{ color: "#64748B", marginTop: 6 }}>No active weather alerts for {weather.name}</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
              {alerts.map((a, i) => (
                <div key={i} style={{
                  background: a.color + "14", border: `1px solid ${a.color}44`,
                  borderLeft: `5px solid ${a.color}`, borderRadius: 16, padding: "20px 24px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 38 }}>{a.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: a.color }}>{a.type} Warning</div>
                      <div style={{ color: "#CBD5E1", marginTop: 4, fontSize: 14 }}>{a.msg}</div>
                      <div style={{ color: "#475569", fontSize: 12, marginTop: 6 }}>Issued: {new Date().toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Thresholds Reference */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontWeight: 700, marginBottom: 14, color: "#94A3B8", textTransform: "uppercase", fontSize: 12, letterSpacing: 1 }}>Alert Thresholds Reference</div>
            {thresholds.map((t, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: i < thresholds.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span style={{ color: "#94A3B8", fontSize: 13 }}>{t.icon} {t.label}</span>
                <span style={{ color: t.color, fontSize: 13, fontWeight: 600 }}>{t.threshold}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
