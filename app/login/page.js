"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        localStorage.setItem("isLoggedIn", "true");
        document.cookie = "isLoggedIn=true; path=/; SameSite=Lax";
        window.dispatchEvent(new Event("storage"));
        router.push("/dashboard");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
      <form
        className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 w-full max-w-md flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-2">Log In</h1>
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-4 py-2 focus:outline-none focus:ring"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded px-4 py-2 focus:outline-none focus:ring"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <p className="text-center text-gray-600 dark:text-gray-300">
          Don't have an account? <a href="/signup" className="underline text-blue-600">Sign up</a>
        </p>
      </form>
    </div>
  );
}