"use client";
import Link from "next/link";
import { useState } from "react";
import NewHabitModal from "./NewHabitModal";
import { FaRegSmile } from "react-icons/fa";

export default function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "FaRegSmile",
    color: "blue-600",
  });
  const icons = ["FaRegSmile", "FaRegHeart", "FaRegStar", "FaRegCheckCircle", "FaRegSun"];
  const colors = [
    "red-600", "orange-600", "amber-600", "yellow-600", "lime-600", "green-600", "emerald-600", "teal-600", "cyan-600", "sky-600", "blue-600", "indigo-600", "violet-600", "purple-600", "fuchsia-600", "pink-600", "rose-600"
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-100 text-black shadow-lg flex flex-col border-r border-gray-200 z-40">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-700 tracking-tight">Habitly</h1>
        <p className="text-gray-600 text-sm mt-1">Build better habits</p>
      </div>
      <button className="mb-8 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => setShowModal(true)}>New Habit</button>
      <NewHabitModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async data => {
          setShowModal(false);
          try {
            // Set userId cookie from localStorage (after login/signup)
            const realUserId = localStorage.getItem("userId");
            if (realUserId) {
              document.cookie = `userId=${realUserId}; path=/; SameSite=Lax`;
            }
            const res = await fetch("/api/habits", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Unknown error");
            alert("Habit created!");
          } catch (e) {
            alert("Failed to create habit: " + e.message);
          }
        }}
      />
      <nav className="flex flex-col gap-2 flex-1">
        <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-gray-200 font-medium text-black transition">Dashboard</Link>
        <Link href="/habits" className="px-3 py-2 rounded hover:bg-gray-200 font-medium text-black transition">Habits</Link>
        <Link href="/analytics" className="px-3 py-2 rounded hover:bg-gray-200 font-medium text-black transition">Analytics</Link>
        <Link href="/settings" className="px-3 py-2 rounded hover:bg-gray-200 font-medium text-black transition">Settings</Link>
      </nav>
      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          document.cookie = "isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
          window.location.href = "/";
        }}
        className="w-full mt-auto px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition mb-2"
      >
        Logout
      </button>
    </aside>
  );
} 