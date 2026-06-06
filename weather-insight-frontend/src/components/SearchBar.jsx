import React, { useState, useRef, useEffect } from "react";
import { searchCities } from "../services/weatherService";

export default function SearchBar({ onSearch, onGeolocate }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSug, setLoadingSug] = useState(false);
  const timerRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autocomplete with debounce
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        setLoadingSug(true);
        const data = await searchCities(query);
        setSuggestions(data);
      } catch { setSuggestions([]); }
      finally { setLoadingSug(false); }
    }, 400);
  }, [query]);

  const handleSelect = (item) => {
    const cityName = `${item.name}${item.state ? ", " + item.state : ""}, ${item.country}`;
    setQuery(cityName);
    setSuggestions([]); // ← close dropdown immediately
    onSearch(item.name, item.lat, item.lon);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSuggestions([]); // ← close dropdown
      onSearch(query.trim());
    }
  };

  return (
    // zIndex 50 only — so it does NOT cover the Save City button
    <div ref={wrapperRef} style={{ position: "relative", maxWidth: 560, zIndex: 50 }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10 }}>
        {/* Search Input */}
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{
            position: "absolute", left: 14, top: "50%",
            transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none",
          }}>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city… (Pune, Mumbai, Delhi, London…)"
            style={{
              width: "100%", padding: "13px 14px 13px 44px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14, color: "#F1F5F9", fontSize: 14,
              outline: "none", fontFamily: "inherit", boxSizing: "border-box",
            }}
          />
          {loadingSug && (
            <span style={{
              position: "absolute", right: 14, top: "50%",
              transform: "translateY(-50%)", color: "#64748B", fontSize: 12,
            }}>…</span>
          )}
        </div>

        {/* Geo Button */}
        <button
          type="button"
          onClick={onGeolocate}
          title="Use my location"
          style={{
            padding: "13px 16px", background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
            color: "#94A3B8", cursor: "pointer", fontSize: 18,
          }}
        >📍</button>

        {/* Search Button */}
        <button
          type="submit"
          style={{
            padding: "13px 24px",
            background: "linear-gradient(90deg,#F97316,#EF4444)",
            border: "none", borderRadius: 14, color: "#fff",
            fontWeight: 700, cursor: "pointer", fontSize: 14,
          }}
        >Search</button>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "110%", left: 0, right: 0,
          background: "#1E293B",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          // zIndex 49 — BELOW the search bar, does NOT cover page content
          zIndex: 49,
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
        }}>
          {suggestions.map((s, i) => (
            <div
              key={i}
              onMouseDown={(e) => {
                // onMouseDown instead of onClick — fires before blur
                e.preventDefault();
                handleSelect(s);
              }}
              style={{
                padding: "12px 18px", cursor: "pointer", fontSize: 14,
                color: "#CBD5E1",
                borderBottom: i < suggestions.length - 1
                  ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(249,115,22,0.12)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              📍 <strong>{s.name}</strong>
              <span style={{ color: "#475569", marginLeft: 6, fontSize: 12 }}>
                {s.state ? `${s.state}, ` : ""}{s.country}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

