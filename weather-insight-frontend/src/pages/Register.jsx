import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirm) {
      return toast.error("All fields are required");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (form.password !== form.confirm) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created successfully! 🌤️");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed. Email may already exist.");
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
            Create Account
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              color: "#94A3B8",
              fontSize: 13,
            }}
          >
            Weather Insight Forecasting System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />

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
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
          />

          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Creating account..." : "Create Account →"}
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#F97316",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign In
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
};