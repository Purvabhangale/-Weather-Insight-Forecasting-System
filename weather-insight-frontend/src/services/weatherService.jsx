import axios from "axios";

// ─── Replace with your FREE key from https://openweathermap.org/api ──────────
const API_KEY =  "YOUR_OPENWEATHER_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL  = "https://api.openweathermap.org/geo/1.0";

export const fetchCurrentWeather = (city) =>
  axios.get(`${BASE_URL}/weather`, { params: { q: city, appid: API_KEY, units: "metric" } }).then(r => r.data);

export const fetchWeatherByCoords = (lat, lon) =>
  axios.get(`${BASE_URL}/weather`, { params: { lat, lon, appid: API_KEY, units: "metric" } }).then(r => r.data);

export const fetchForecast = (city) =>
  axios.get(`${BASE_URL}/forecast`, { params: { q: city, appid: API_KEY, units: "metric", cnt: 40 } }).then(r => r.data);

export const fetchForecastByCoords = (lat, lon) =>
  axios.get(`${BASE_URL}/forecast`, { params: { lat, lon, appid: API_KEY, units: "metric", cnt: 40 } }).then(r => r.data);

// ─── AQI — OpenWeatherMap Air Pollution API (FREE) ───────────────────────────
export const fetchAQI = (lat, lon) =>
  axios.get(`${BASE_URL}/air_pollution`, { params: { lat, lon, appid: API_KEY } }).then(r => r.data);

export const getAQIInfo = (aqi) => {
  const levels = {
    1: { label: "Good",      color: "#22C55E", bg: "rgba(34,197,94,0.15)",   desc: "Air quality is satisfactory" },
    2: { label: "Fair",      color: "#84CC16", bg: "rgba(132,204,22,0.15)",  desc: "Acceptable air quality" },
    3: { label: "Moderate",  color: "#F59E0B", bg: "rgba(245,158,11,0.15)",  desc: "Sensitive groups may be affected" },
    4: { label: "Poor",      color: "#F97316", bg: "rgba(249,115,22,0.15)",  desc: "Everyone may experience effects" },
    5: { label: "Hazardous", color: "#EF4444", bg: "rgba(239,68,68,0.15)",   desc: "Health alert — avoid outdoors" },
  };
  return levels[aqi] || levels[1];
};

export const searchCities = (query) =>
  axios.get(`${GEO_URL}/direct`, { params: { q: query, limit: 6, appid: API_KEY } }).then(r => r.data);

export const reverseGeocode = (lat, lon) =>
  axios.get(`${GEO_URL}/reverse`, { params: { lat, lon, limit: 1, appid: API_KEY } }).then(r => r.data[0]);

export const parseDailyForecast = (f) => {
  const days = {};
  f.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = { temps: [], items: [] };
    days[date].temps.push(item.main.temp);
    days[date].items.push(item);
  });
  return Object.entries(days).map(([date, val]) => {
    const mid = val.items[Math.floor(val.items.length / 2)];
    return { date, high: Math.round(Math.max(...val.temps)), low: Math.round(Math.min(...val.temps)),
      icon: mid.weather[0].icon, description: mid.weather[0].description,
      rain: mid.pop ? Math.round(mid.pop * 100) : 0 };
  });
};

export const parseHourlyForecast = (f) =>
  f.list.slice(0, 12).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    temp: Math.round(item.main.temp), icon: item.weather[0].icon,
    description: item.weather[0].description,
    rain: item.pop ? Math.round(item.pop * 100) : 0,
    wind: Math.round(item.wind.speed * 3.6),
  }));

export const generateAlerts = (w) => {
  const alerts = [];
  const temp = w.main.temp, humidity = w.main.humidity;
  const wind = w.wind.speed * 3.6, visibility = w.visibility / 1000;
  const desc = w.weather[0].description.toLowerCase();
  if (temp > 38)   alerts.push({ type: "Heat",        msg: `Extreme heat ${Math.round(temp)}°C`, icon: "🔥", color: "#FF6B35" });
  if (temp < 5)    alerts.push({ type: "Cold Wave",    msg: `Very low temp ${Math.round(temp)}°C`, icon: "🥶", color: "#60A5FA" });
  if (wind > 25)   alerts.push({ type: "Wind",         msg: `Strong winds ${Math.round(wind)} km/h`, icon: "💨", color: "#7B1FA2" });
  if (humidity>85) alerts.push({ type: "Humidity",     msg: `High humidity ${humidity}%`, icon: "💧", color: "#00897B" });
  if (desc.includes("storm")||desc.includes("thunder"))
    alerts.push({ type: "Thunderstorm", msg: "Thunderstorm — stay indoors", icon: "⛈️", color: "#5C6BC0" });
  if (desc.includes("heavy rain"))
    alerts.push({ type: "Heavy Rain",   msg: "Heavy rainfall expected", icon: "🌧️", color: "#1976D2" });
  if (visibility<2)
    alerts.push({ type: "Fog",          msg: `Low visibility ${visibility.toFixed(1)} km`, icon: "🌫️", color: "#78909C" });
  return alerts;
};

export const getIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

export const parseTrendData = (f) => {
  const items = f.list.slice(0, 7);
  return {
    labels:   items.map((i) => new Date(i.dt * 1000).toLocaleTimeString([], { hour: "2-digit" })),
    temp:     items.map((i) => Math.round(i.main.temp)),
    humidity: items.map((i) => i.main.humidity),
    wind:     items.map((i) => Math.round(i.wind.speed * 3.6)),
    rain:     items.map((i) => Math.round((i.pop || 0) * 100)),
  };
};
