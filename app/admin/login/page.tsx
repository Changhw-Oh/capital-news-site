"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "로그인에 실패했어요.");
      } else {
        window.location.href = "/admin";
      }
    } catch (error) {
      console.error(error);
      setMessage("로그인 중 오류가 발생했어요.");
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        maxWidth: "520px",
        margin: "0 auto",
        padding: "60px 20px",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "28px",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>
          Admin Login
        </p>

        <h1 style={{ marginTop: 0, fontSize: "32px", marginBottom: "12px" }}>
          관리자 로그인
        </h1>

        <p style={{ color: "#475569", lineHeight: "1.8", marginTop: 0 }}>
          관리자 페이지에 들어가려면 비밀번호를 입력해야 합니다.
        </p>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#334155",
            }}
          >
            관리자 비밀번호
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            style={{
              width: "100%",
              padding: "14px",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              fontSize: "16px",
              boxSizing: "border-box",
              marginBottom: "14px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          {message && (
            <p style={{ marginTop: "14px", color: "#dc2626" }}>{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}