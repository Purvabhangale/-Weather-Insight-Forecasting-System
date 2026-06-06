import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import StatGrid from "../components/StatGrid";
import { addFavorite, removeFavorite, getFavorites, addHistory } from "../services/apiService";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherByCoords,
  fetchForecastByCoords,
  reverseGeocode,
  parseHourlyForecast,
  generateAlerts,
  getIconUrl,
} from "../services/weatherService";

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch favorites from backend on mount
  useEffect(() => {
    getFavorites()
      .then((res) => setFavorites(res.data))
      .catch(() => {});
    loadCity("Pune");
  }, []);

  const loadCity = useCallback(async (city, lat, lon) => {
    setLoading(true);
    setError("");
    try {
      let w, f;
      if (lat && lon) {
        [w, f] = await Promise.all([
          fetchWeatherByCoords(lat, lon),
          fetchForecastByCoords(lat, lon),
        ]);
      } else {
        [w, f] = await Promise.all([
          fetchCurrentWeather(city),
          fetchForecast(city),
        ]);
      }
      setWeather(w);
      setHourly(parseHourlyForecast(f));
      setAlerts(generateAlerts(w));

      // Save to history in backend
      addHistory(city || w.name).catch(() => {});
    } catch (err) {
      const msg = err.response?.data?.message || "City not found. Check API key.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGeolocate = () => {
    if (!navigator.geolocation)
      return toast.warning("Geolocation not supported.");
    toast.info("Detecting your location…");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const geo = await reverseGeocode(coords.latitude, coords.longitude);
          await loadCity(geo?.name || "Current Location", coords.latitude, coords.longitude);
          toast.success(`Showing weather for ${geo?.name || "your location"}`);
        } catch { toast.error("Failed to get location weather."); }
      },
      () => toast.error("Location permission denied.")
    );
  };

  // ─── SAVE / UNSAVE CITY ───────────────────────────────────────────────────────
  const handleSaveCity = async () => {
    if (!weather) {
      toast.warning("No city loaded yet!");
      return;
    }
    const city = weather.name;
    const existing = favorites.find(
      (f) => f.city.toLowerCase() === city.toLowerCase()
    );

    if (existing) {
      // Remove from favorites
      try {
        await removeFavorite(existing.id);
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
        toast.info(`⭐ ${city} removed from favorites`);
      } catch (err) {
        toast.error(err.message || "Failed to remove favorite");
      }
    } else {
      // Add to favorites
      try {
        const res = await addFavorite(city);
        setFavorites((prev) => [res.data, ...prev]);
        toast.success(`⭐ ${city} saved to favorites!`);
      } catch (err) {
        toast.error(err.message || "Failed to save favorite");
      }
    }
  };

  const isFav =
    weather &&
    favorites.some((f) => f.city.toLowerCase() === weather.name.toLowerCase());

  return (
    <div>
      <SearchBar onSearch={loadCity} onGeolocate={handleGeolocate} />

      {loading && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#94A3B8" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⛅</div>
          <div>Fetching live weather data…</div>
        </div>
      )}

      {error && !loading && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 14, padding: "16px 20px", marginTop: 20, color: "#F87171",
        }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && weather && (
        <>
          {/* ── WEATHER HERO CARD ── */}
          <div style={{
            background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(15,23,42,0.9))",
            border: "1px solid rgba(249,115,22,0.3)",
            borderRadius: 24, padding: "32px 36px",
            marginBottom: 24, marginTop: 20,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", flexWrap: "wrap", gap: 16,
            }}>
              {/* Left */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={getIconUrl(weather.weather[0].icon)}
                    alt={weather.weather[0].description}
                    style={{ width: 80, height: 80 }}
                  />
                  <div>
                    <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1, color: "#F1F5F9" }}>
                      {Math.round(weather.main.temp)}°C
                    </div>
                    <div style={{ color: "#94A3B8", fontSize: 15, textTransform: "capitalize" }}>
                      {weather.weather[0].description}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#F97316", marginTop: 10 }}>
                  {weather.name}, {weather.sys.country}
                </div>
                <div style={{ color: "#64748B", fontSize: 13, marginTop: 3 }}>
                  Feels like {Math.round(weather.main.feels_like)}°C ·{" "}
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
                </div>
                <div style={{ color: "#94A3B8", fontSize: 13, marginTop: 6 }}>
                  🌅 {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  &nbsp;&nbsp;
                  🌇 {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {/* Right */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleSaveCity}
                  style={{
                    background: isFav ? "#F97316" : "rgba(255,255,255,0.12)",
                    border: isFav ? "2px solid #F97316" : "2px solid rgba(255,255,255,0.25)",
                    borderRadius: 14,
                    padding: "12px 24px",
                    color: isFav ? "#fff" : "#F1F5F9",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    minWidth: 150,
                    justifyContent: "center",
                    zIndex: 10,
                    position: "relative",
                  }}
                >
                  {isFav ? "⭐ Saved!" : "☆ Save City"}
                </button>

                <div style={{ textAlign: "right", color: "#64748B", fontSize: 13, lineHeight: 1.8 }}>
                  <div>💧 Humidity: {weather.main.humidity}%</div>
                  <div>💨 Wind: {Math.round(weather.wind.speed * 3.6)} km/h</div>
                  <div>🌡️ Pressure: {weather.main.pressure} hPa</div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              {alerts.map((a, i) => (
                <div key={i} style={{
                  background: a.color + "18", border: `1px solid ${a.color}44`,
                  borderLeft: `4px solid ${a.color}`, borderRadius: 12,
                  padding: "12px 16px", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div style={{ fontSize: 14 }}>
                    <span style={{ fontWeight: 700, color: a.color }}>{a.type} Alert — </span>
                    {a.msg}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <StatGrid weather={weather} />

          {/* Hourly */}
          <div style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 20,
            padding: "20px 24px", border: "1px solid rgba(255,255,255,0.07)",
          }}>
            <div style={{
              fontWeight: 700, fontSize: 13, color: "#94A3B8",
              marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8,
            }}>
              ⏰ Hourly Forecast (Next 36 hrs)
            </div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
              {hourly.map((h, i) => (
                <div key={i} style={{
                  minWidth: 70, textAlign: "center", flexShrink: 0,
                  background: i === 0 ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                  borderRadius: 14, padding: "12px 8px",
                  border: i === 0 ? "1px solid #F9731666" : "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ color: "#64748B", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
                    {h.time}
                  </div>
                  <img src={getIconUrl(h.icon)} alt="" style={{ width: 36, height: 36 }} />
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{h.temp}°</div>
                  {h.rain > 20 && (
                    <div style={{ fontSize: 10, color: "#38BDF8", marginTop: 4 }}>💧{h.rain}%</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}