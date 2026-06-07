// ─── Backend API Service ──────────────────────────────────────────────────────
// All data goes to MySQL database via Spring Boot backend at localhost:8081

const API_BASE =  "https://medicare-ai-backend.onrender.com/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ─── Helper ───────────────────────────────────────────────────────────────────
const apiCall = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return { data };
};

// ─── User / Profile ───────────────────────────────────────────────────────────
export const getProfile = () => apiCall("/user/profile");

export const updateProfile = (body) =>
  apiCall("/user/profile", {
    method: "PUT",
    body: JSON.stringify(body),
  });

// ─── Favorites ────────────────────────────────────────────────────────────────
export const getFavorites = () => apiCall("/favorites");

export const addFavorite = (city) =>
  apiCall("/favorites", {
    method: "POST",
    body: JSON.stringify({ city }),
  });

export const removeFavorite = (id) =>
  apiCall(`/favorites/${id}`, { method: "DELETE" });

// ─── Search History ───────────────────────────────────────────────────────────
export const getHistory = () => apiCall("/history");

export const addHistory = (city) =>
  apiCall("/history", {
    method: "POST",
    body: JSON.stringify({ city }),
  });

export const clearHistory = () => apiCall("/history", { method: "DELETE" });

// ─── Admin ────────────────────────────────────────────────────────────────────
export const getAllUsers = () => apiCall("/admin/users");

export const deleteUser = (id) =>
  apiCall(`/admin/users/${id}`, { method: "DELETE" });

export const getPopularCities = () => apiCall("/admin/popular-cities");

export const getSystemStats = () => apiCall("/admin/stats");