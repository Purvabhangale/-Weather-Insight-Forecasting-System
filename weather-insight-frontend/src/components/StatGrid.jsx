import React from "react";

function Stat({ label, value, unit, icon, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)", borderRadius: 16,
      padding: "16px 18px", border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
      <div style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 700, marginTop: 4 }}>
        {value}<span style={{ fontSize: 13, color: "#94A3B8", marginLeft: 3 }}>{unit}</span>
      </div>
    </div>
  );
}

export default function StatGrid({ weather }) {
  if (!weather) return null;
  const wind = Math.round(weather.wind.speed * 3.6);
  const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(1) : "N/A";
  const uvIndex = weather.uvi ?? "–";

  const stats = [
    { label: "Humidity", value: weather.main.humidity, unit: "%", icon: "💧", accent: "#38BDF8" },
    { label: "Wind Speed", value: wind, unit: "km/h", icon: "💨", accent: "#A78BFA" },
    { label: "Pressure", value: weather.main.pressure, unit: "hPa", icon: "🌡️", accent: "#34D399" },
    { label: "Visibility", value: visibility, unit: "km", icon: "👁️", accent: "#FCD34D" },
    { label: "Feels Like", value: Math.round(weather.main.feels_like), unit: "°C", icon: "🌡️", accent: "#F97316" },
    { label: "Cloud Cover", value: weather.clouds?.all ?? 0, unit: "%", icon: "☁️", accent: "#CBD5E1" },
    { label: "Min Temp", value: Math.round(weather.main.temp_min), unit: "°C", icon: "❄️", accent: "#60A5FA" },
    { label: "Max Temp", value: Math.round(weather.main.temp_max), unit: "°C", icon: "🔥", accent: "#FB923C" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 12, marginBottom: 24 }}>
      {stats.map((s, i) => <Stat key={i} {...s} />)}
    </div>
  );
}

