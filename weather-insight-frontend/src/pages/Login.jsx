import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("All fields are required");
    }

    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 🌤️");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: "44px 40px",
          width: "100%",
          maxWidth: 420,
          color: "#F1F5F9",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🌤️</div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              color: "#F97316",
            }}
          >
            Weather Insight
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              color: "#94A3B8",
              fontSize: 13,
            }}
          >
            Forecasting System — Sign In
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "#94A3B8",
            fontSize: 13,
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#F97316",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#94A3B8",
  marginBottom: 6,
  letterSpacing: 0.5,
  textTransform: "uppercase",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#F1F5F9",
  fontSize: 14,
  marginBottom: 18,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const btnStyle = {
  width: "100%",
  padding: "14px 0",
  background: "linear-gradient(90deg, #F97316, #EF4444)",
  border: "none",
  borderRadius: 12,
  color: "#fff",
  fontWeight: 800,
  fontSize: 15,
  cursor: "pointer",
  marginTop: 6,
  letterSpacing: 0.3,
};