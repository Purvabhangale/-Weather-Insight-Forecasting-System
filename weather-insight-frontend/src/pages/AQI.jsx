import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import {
  fetchCurrentWeather,
  fetchWeatherByCoords,
  fetchAQI,
  getAQIInfo,
  reverseGeocode,
} from "../services/weatherService";

// ─── Pollutant info ───────────────────────────────────────────────────────────
const pollutants = [
  { key: "pm2_5", label: "PM2.5", unit: "μg/m³", desc: "Fine particles" },
  { key: "pm10", label: "PM10", unit: "μg/m³", desc: "Coarse particles" },
  { key: "no2", label: "NO₂", unit: "μg/m³", desc: "Nitrogen dioxide" },
  { key: "o3", label: "O₃", unit: "μg/m³", desc: "Ozone" },
  { key: "co", label: "CO", unit: "μg/m³", desc: "Carbon monoxide" },
  { key: "so2", label: "SO₂", unit: "μg/m³", desc: "Sulfur dioxide" },
];

// ─── AQI Level bar widths ─────────────────────────────────────────────────────
const AQI_LEVELS = [
  { label: "Good", color: "#22C55E" },
  { label: "Fair", color: "#84CC16" },
  { label: "Moderate", color: "#F59E0B" },
  { label: "Poor", color: "#F97316" },
  { label: "Hazardous", color: "#EF4444" },
];

export default function AQI() {
  const [city, setCity] = useState("Pune");
  const [aqiData, setAqiData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAQI("Pune");
  }, []);

  const loadAQI = async (cityName, lat, lon) => {
    setLoading(true);
    setError("");

    try {
      let w, coords;

      if (lat && lon) {
        w = await fetchWeatherByCoords(lat, lon);
        coords = { lat, lon };
      } else {
        w = await fetchCurrentWeather(cityName);
        coords = { lat: w.coord.lat, lon: w.coord.lon };
      }

      const aqi = await fetchAQI(coords.lat, coords.lon);

      setWeather(w);
      setAqiData(aqi);
      setCity(w.name);

      // ✅ Save AQI to backend / database
      const token = localStorage.getItem("token");

      if (token) {
        const aqiIndex = aqi?.list?.[0]?.main?.aqi;
        const components = aqi?.list?.[0]?.components || {};
        const aqiInfo = aqiIndex ? getAQIInfo(aqiIndex) : null;

        try {
          await fetch("http://localhost:8081/api/air-quality/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              city: w.name,
              aqi: aqiIndex,
              category: aqiInfo?.label || "Unknown",
              pm25: components.pm2_5 || 0,
              pm10: components.pm10 || 0,
              co: components.co || 0,
              no2: components.no2 || 0,
              o3: components.o3 || 0,
              so2: components.so2 || 0,
            }),
          });
        } catch (saveErr) {
          console.error("AQI save failed:", saveErr);
        }
      }
    } catch (err) {
      setError("Could not fetch AQI data. Check your API key.");
      toast.error("AQI fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      return toast.warning("Geolocation not supported");
    }

    toast.info("Detecting location…");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const geo = await reverseGeocode(coords.latitude, coords.longitude);
          await loadAQI(geo?.name || "Current", coords.latitude, coords.longitude);
        } catch {
          toast.error("Location error");
        }
      },
      () => toast.error("Location denied")
    );
  };

  const aqiIndex = aqiData?.list?.[0]?.main?.aqi;
  const components = aqiData?.list?.[0]?.components || {};
  const aqiInfo = aqiIndex ? getAQIInfo(aqiIndex) : null;

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, color: "#22C55E" }}>
        Air Quality Index (AQI)
      </h2>

      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 20 }}>
        Real-time air quality data powered by OpenWeatherMap Air Pollution API
      </p>

      <SearchBar onSearch={loadAQI} onGeolocate={handleGeolocate} />

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🌬️</div>
          <div>Fetching air quality data…</div>
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 14,
            padding: "16px 20px",
            marginTop: 20,
            color: "#F87171",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {!loading && aqiData && aqiInfo && (
        <>
          {/* ── MAIN AQI CARD ── */}
          <div
            style={{
              background: aqiInfo.bg,
              border: `2px solid ${aqiInfo.color}55`,
              borderRadius: 24,
              padding: "32px 36px",
              marginTop: 20,
              marginBottom: 24,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* big blurred bg number */}
            <div
              style={{
                position: "absolute",
                right: 20,
                top: -10,
                fontSize: 140,
                fontWeight: 900,
                color: aqiInfo.color,
                opacity: 0.08,
                userSelect: "none",
                lineHeight: 1,
              }}
            >
              {aqiIndex}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#94A3B8",
                    marginBottom: 6,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Air Quality Index
                </div>

                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 900,
                    color: aqiInfo.color,
                    lineHeight: 1,
                  }}
                >
                  {aqiIndex}
                </div>

                <div
                  style={{
                    display: "inline-block",
                    marginTop: 10,
                    background: aqiInfo.color,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 18,
                    padding: "6px 20px",
                    borderRadius: 30,
                  }}
                >
                  {aqiInfo.label}
                </div>

                <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 10 }}>
                  {aqiInfo.desc}
                </div>

                <div style={{ color: "#64748B", fontSize: 13, marginTop: 6 }}>
                  📍 {city}, {weather?.sys?.country} &nbsp;·&nbsp; Updated:{" "}
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* AQI Scale */}
              <div style={{ minWidth: 200 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "#94A3B8",
                    fontWeight: 600,
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  AQI Scale
                </div>

                {AQI_LEVELS.map((level, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: level.color,
                        border: aqiIndex === i + 1 ? `2px solid ${level.color}` : "none",
                        boxShadow: aqiIndex === i + 1 ? `0 0 8px ${level.color}` : "none",
                      }}
                    />
                    <div
                      style={{
                        fontSize: 13,
                        color: aqiIndex === i + 1 ? level.color : "#64748B",
                        fontWeight: aqiIndex === i + 1 ? 800 : 400,
                      }}
                    >
                      {i + 1} — {level.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AQI progress bar */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>
                Scale: 1 (Good) → 5 (Hazardous)
              </div>

              <div style={{ display: "flex", gap: 4, height: 12 }}>
                {AQI_LEVELS.map((level, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      borderRadius: 6,
                      background: level.color,
                      opacity: aqiIndex === i + 1 ? 1 : 0.3,
                      transform: aqiIndex === i + 1 ? "scaleY(1.4)" : "scaleY(1)",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                  fontSize: 11,
                  color: "#475569",
                }}
              >
                <span>Good</span>
                <span>Fair</span>
                <span>Moderate</span>
                <span>Poor</span>
                <span>Hazardous</span>
              </div>
            </div>
          </div>

          {/* ── HEALTH ADVICE ── */}
          <div
            style={{
              background: aqiInfo.bg,
              border: `1px solid ${aqiInfo.color}44`,
              borderRadius: 16,
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ fontSize: 28 }}>
              {aqiIndex === 1 ? "😊" : aqiIndex === 2 ? "🙂" : aqiIndex === 3 ? "😐" : aqiIndex === 4 ? "😷" : "🚨"}
            </div>

            <div>
              <div style={{ fontWeight: 700, color: aqiInfo.color, fontSize: 14 }}>
                Health Advice
              </div>

              <div style={{ color: "#CBD5E1", fontSize: 13, marginTop: 3 }}>
                {aqiIndex === 1 && "Air quality is excellent. Enjoy outdoor activities freely!"}
                {aqiIndex === 2 &&
                  "Air quality is acceptable. Unusually sensitive people should consider limiting outdoor exertion."}
                {aqiIndex === 3 &&
                  "Members of sensitive groups may experience health effects. General public is less likely to be affected."}
                {aqiIndex === 4 &&
                  "Everyone may begin to experience health effects. Sensitive groups should avoid outdoor activity."}
                {aqiIndex === 5 &&
                  "Health alert! Everyone may experience serious health effects. Avoid all outdoor activities."}
              </div>
            </div>
          </div>

          {/* ── POLLUTANTS GRID ── */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#94A3B8",
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              Pollutant Concentrations
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
                gap: 12,
              }}
            >
              {pollutants.map((p) => {
                const val = components[p.key];
                if (val === undefined) return null;

                const isHigh = val > 50;

                return (
                  <div
                    key={p.key}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${isHigh ? "#F9731644" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 14,
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748B",
                        fontWeight: 600,
                        marginBottom: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {p.label}
                    </div>

                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: isHigh ? "#F97316" : "#F1F5F9",
                      }}
                    >
                      {val.toFixed(1)}
                    </div>

                    <div style={{ fontSize: 11, color: "#475569" }}>{p.unit}</div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{p.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── WHO GUIDELINES ── */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 18,
              padding: "20px 24px",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#94A3B8",
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              AQI Reference Guide
            </div>

            {[
              { aqi: "1 — Good", color: "#22C55E", tip: "Safe for all groups" },
              { aqi: "2 — Fair", color: "#84CC16", tip: "Acceptable, very sensitive may be affected" },
              { aqi: "3 — Moderate", color: "#F59E0B", tip: "Sensitive groups: reduce outdoor activity" },
              { aqi: "4 — Poor", color: "#F97316", tip: "Everyone: limit outdoor exertion" },
              { aqi: "5 — Hazardous", color: "#EF4444", tip: "Stay indoors, wear mask if going out" },
            ].map((r, i, arr) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <span style={{ color: r.color, fontWeight: 700, fontSize: 13 }}>{r.aqi}</span>
                <span style={{ color: "#94A3B8", fontSize: 13 }}>{r.tip}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}