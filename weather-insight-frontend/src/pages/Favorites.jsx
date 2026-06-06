import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchCurrentWeather, getIconUrl } from "../services/weatherService";
import { getFavorites, removeFavorite } from "../services/apiService";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [weatherMap, setWeatherMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFavorites()
      .then((res) => {
        const favs = res.data;
        setFavorites(favs);
        // Fetch live weather for each saved city
        favs.forEach(async (fav) => {
          try {
            const w = await fetchCurrentWeather(fav.city);
            setWeatherMap((prev) => ({ ...prev, [fav.city]: w }));
          } catch {}
        });
      })
      .catch(() => toast.error("Could not load favorites"))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (fav) => {
    try {
      await removeFavorite(fav.id);
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
      toast.info(`${fav.city} removed from favorites`);
    } catch (err) {
      toast.error(err.message || "Failed to remove favorite");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>
        ⏳ Loading favorites…
      </div>
    );

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, color: "#F97316" }}>
        ⭐ Favorite Cities
      </h2>
      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>
        Quick access to your saved locations with live weather
      </p>

      {favorites.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 30px", color: "#475569" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📍</div>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
            No favorites yet
          </div>
          <div style={{ fontSize: 13 }}>
            Go to Dashboard → Search a city → Click{" "}
            <strong style={{ color: "#F97316" }}>"Save City"</strong> button
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              marginTop: 20,
              padding: "10px 24px",
              background: "linear-gradient(90deg,#F97316,#EF4444)",
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Go to Dashboard →
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {favorites.map((fav) => {
            const w = weatherMap[fav.city];
            return (
              <div
                key={fav.id}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 20,
                  padding: "20px",
                  cursor: "pointer",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
                onClick={() => navigate("/dashboard")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#F9731644";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{fav.city}</div>
                    {w && (
                      <div style={{ fontSize: 11, color: "#64748B", textTransform: "capitalize" }}>
                        {w.weather[0].description}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(fav);
                    }}
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: 8,
                      padding: "4px 10px",
                      color: "#F87171",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>

                {w ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
                      <img src={getIconUrl(w.weather[0].icon)} alt="" style={{ width: 48, height: 48 }} />
                      <div style={{ fontSize: 30, fontWeight: 800 }}>
                        {Math.round(w.main.temp)}°C
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>
                      💧 {w.main.humidity}% &nbsp; 💨 {Math.round(w.wind.speed * 3.6)} km/h
                    </div>
                  </>
                ) : (
                  <div style={{ color: "#475569", fontSize: 13, padding: "10px 0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>⏳</span> Loading weather…
                  </div>
                )}

                <div style={{ fontSize: 11, color: "#334155", marginTop: 10 }}>
                  Saved:{" "}
                  {new Date(fav.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}