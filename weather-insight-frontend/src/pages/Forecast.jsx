import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import { fetchCurrentWeather, fetchForecast, parseDailyForecast, parseHourlyForecast, getIconUrl } from "../services/weatherService";

export default function Forecast() {
  const [city, setCity] = useState("Pune");
  const [daily, setDaily] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadForecast("Pune"); }, []);

  const loadForecast = async (cityName, lat, lon) => {
    setLoading(true);
    try {
      const f = lat ? await (await import("../services/weatherService")).fetchForecastByCoords(lat, lon)
        : await fetchForecast(cityName);
      setDaily(parseDailyForecast(f));
      setHourly(parseHourlyForecast(f));
      setCity(cityName);
    } catch { toast.error("Could not load forecast."); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, color: "#F97316" }}>📅 Weather Forecast</h2>
      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 20 }}>5-day forecast with hourly breakdown</p>

      <SearchBar onSearch={loadForecast} onGeolocate={() => {}} />

      {loading && <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>⏳ Loading forecast…</div>}

      {!loading && daily.length > 0 && (
        <>
          <h3 style={{ marginTop: 28, marginBottom: 14, fontSize: 15, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
            5-Day Forecast — {city}
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            {daily.map((d, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18, padding: "18px 14px", textAlign: "center",
                minWidth: 110, flex: "1 1 110px",
                transition: "transform 0.2s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                  {i === 0 ? "Today" : new Date(d.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </div>
                <img src={getIconUrl(d.icon)} alt={d.description} style={{ width: 52, height: 52 }} />
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10, textTransform: "capitalize" }}>{d.description}</div>
                <div style={{ fontWeight: 800, color: "#F97316", fontSize: 18 }}>{d.high}°</div>
                <div style={{ color: "#94A3B8", fontSize: 14 }}>{d.low}°</div>
                {d.rain > 0 && <div style={{ fontSize: 11, color: "#38BDF8", marginTop: 8 }}>💧 {d.rain}%</div>}
              </div>
            ))}
          </div>

          <h3 style={{ marginBottom: 14, fontSize: 15, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
            36-Hour Hourly Breakdown
          </h3>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px,1fr))", gap: 10 }}>
              {hourly.map((h, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 14,
                  padding: "12px 8px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6, fontWeight: 600 }}>{h.time}</div>
                  <img src={getIconUrl(h.icon)} alt="" style={{ width: 34, height: 34 }} />
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{h.temp}°</div>
                  <div style={{ fontSize: 10, color: "#64748B" }}>{h.wind}km/h</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
