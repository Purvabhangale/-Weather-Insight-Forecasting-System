import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import SearchBar from "../components/SearchBar";
import { fetchForecast, parseTrendData } from "../services/weatherService";

const toastStyle = { background: "#1E293B", color: "#F1F5F9", border: "1px solid rgba(255,255,255,0.1)" };

export default function Trends() {
  const [trendData, setTrendData] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadTrends("Pune"); }, []);

  const loadTrends = async (cityName, lat, lon) => {
    setLoading(true);
    try {
      const f = lat
        ? await (await import("../services/weatherService")).fetchForecastByCoords(lat, lon)
        : await fetchForecast(cityName);
      const parsed = parseTrendData(f);
      const combined = parsed.labels.map((label, i) => ({
        time: label,
        Temperature: parsed.temp[i],
        Humidity: parsed.humidity[i],
        Wind: parsed.wind[i],
        Rain: parsed.rain[i],
      }));
      setTrendData(combined);
      setCity(cityName);
    } catch { toast.error("Could not load trend data."); }
    finally { setLoading(false); }
  };

  const chartStyle = {
    background: "rgba(255,255,255,0.04)", borderRadius: 18,
    padding: "20px 16px", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 20,
  };

  const tooltipStyle = {
    contentStyle: { background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#F1F5F9" },
    labelStyle: { color: "#94A3B8" },
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, color: "#F97316" }}>📊 Weather Trends</h2>
      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 20 }}>Live 36-hour trend analysis from OpenWeatherMap data</p>

      <SearchBar onSearch={loadTrends} onGeolocate={() => {}} />

      {loading && <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>⏳ Loading trend data…</div>}

      {!loading && trendData.length > 0 && (
        <>
          <div style={{ color: "#64748B", fontSize: 13, margin: "20px 0 10px" }}>
            Trends for <strong style={{ color: "#F97316" }}>{city}</strong>
          </div>

          {/* Temperature Chart */}
          <div style={chartStyle}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#F97316", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>🌡️ Temperature (°C)</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} unit="°" />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="Temperature" stroke="#F97316" strokeWidth={2.5} dot={{ r: 3, fill: "#F97316" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity Chart */}
          <div style={chartStyle}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#38BDF8", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>💧 Humidity (%)</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} unit="%" />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="Humidity" stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 3, fill: "#38BDF8" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wind Speed Chart */}
          <div style={chartStyle}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#A78BFA", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>💨 Wind Speed (km/h)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="Wind" fill="#A78BFA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rain Probability Chart */}
          <div style={chartStyle}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#34D399", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>🌧️ Rain Probability (%)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} unit="%" />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="Rain" fill="#34D399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
