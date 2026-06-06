import React from "react";
import { getIconUrl } from "../services/weatherService";

export default function WeatherCard({ weather, isFav, onToggleFav }) {
  if (!weather) return null;

  const temp = Math.round(weather.main.temp);
  const feels = Math.round(weather.main.feels_like);
  const icon = weather.weather[0].icon;
  const desc = weather.weather[0].description;
  const city = weather.name;
  const country = weather.sys.country;
  const sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(15,23,42,0.9))",
        border: "1px solid rgba(249,115,22,0.3)",
        borderRadius: 24,
        padding: "32px 36px",
        marginBottom: 24,
        marginTop: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background emoji */}
      <div
        style={{
          position: "absolute", top: -20, right: -20,
          opacity: 0.07, fontSize: 180, userSelect: "none", lineHeight: 1,
        }}
      >
        {desc.includes("rain") ? "🌧️" : desc.includes("cloud") ? "☁️" : desc.includes("thunder") ? "⛈️" : "☀️"}
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
        {/* Left — Temp + City */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={getIconUrl(icon)}
              alt={desc}
              style={{ width: 80, height: 80 }}
            />
            <div>
              <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1, color: "#F1F5F9" }}>
                {temp}°C
              </div>
              <div style={{ color: "#94A3B8", fontSize: 15, textTransform: "capitalize" }}>
                {desc}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#F97316", marginTop: 10 }}>
            {city}, {country}
          </div>
          <div style={{ color: "#64748B", fontSize: 13, marginTop: 3 }}>
            Feels like {feels}°C ·{" "}
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </div>
          <div style={{ color: "#94A3B8", fontSize: 13, marginTop: 6 }}>
            🌅 {sunrise} &nbsp;&nbsp; 🌇 {sunset}
          </div>
        </div>

        {/* Right — Save Button + Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
          {/* ── SAVE CITY BUTTON ── */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onToggleFav === "function") {
                onToggleFav();
              }
            }}
            style={{
              background: isFav
                ? "rgba(249,115,22,0.25)"
                : "rgba(255,255,255,0.1)",
              border: isFav
                ? "2px solid #F97316"
                : "2px solid rgba(255,255,255,0.2)",
              borderRadius: 12,
              padding: "10px 20px",
              color: isFav ? "#F97316" : "#E2E8F0",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 8,
              minWidth: 140,
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isFav ? "⭐ Saved!" : "☆ Save City"}
          </button>

          {/* Mini stats */}
          <div
            style={{
              textAlign: "right",
              color: "#64748B",
              fontSize: 13,
              lineHeight: 1.8,
            }}
          >
            <div>💧 Humidity: {weather.main.humidity}%</div>
            <div>💨 Wind: {Math.round(weather.wind.speed * 3.6)} km/h</div>
            <div>🌡️ Pressure: {weather.main.pressure} hPa</div>
          </div>
        </div>
      </div>
    </div>
  );
}
