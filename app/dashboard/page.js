"use client";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("/api/habits")
      .then((res) => res.json())
      .then((data) => {
        setHabits(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetch("/api/habits/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }, []);

  const activeHabits = habits;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-100 rounded-lg shadow p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Active Habits</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <p className="font-bold text-3xl mb-2">{activeHabits.length}</p>
          )}
          <p className="text-gray-700 mb-2">Currently tracking</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Current Streaks</h2>
          <p className="font-bold text-3xl mb-2">{summary ? summary.currentStreaks : "-"}</p>
          <p className="text-gray-700 mb-2">Habits with active streaks</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Completion Rate</h2>
          <p className="font-bold text-3xl mb-2">{summary ? summary.completionRate + "%" : "-"}</p>
          <p className="text-gray-700 mb-2">This week's average</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Days Tracked</h2>
          <p className="font-bold text-3xl mb-2">{summary ? summary.daysTracked : "-"}</p>
          <p className="text-gray-700 mb-2">Since first habit</p>
        </div>
      </div>
      <p className="text-gray-600">
        Welcome! Your habit analytics and management tools will appear here.
      </p>
    </div>
  );
}
