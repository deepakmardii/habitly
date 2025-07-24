"use client";
import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import MiniHeatmapCard from "../components/MiniHeatmapCard";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

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
    fetch("/api/habits/activity")
      .then((res) => res.json())
      .then((data) => setRecentActivity(data));
  }, []);

  const activeHabits = habits;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's your habit progress overview." />
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
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left: Habit Activity Heatmaps */}
        <div>
          <h2 className="text-xl font-bold mb-4">Habit Activity Heatmaps</h2>
          <div className="flex flex-col gap-4">
            {habits.slice(0, 4).map((habit) => (
              <MiniHeatmapCard
                key={habit.id}
                habitId={habit.id}
                title={habit.title}
                streak={habit.streak}
                completionPercent={habit.completionPercent}
                color={habit.color}
              />
            ))}
          </div>
        </div>
        {/* Right: Recent Activity */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="flex flex-col gap-3">
            {recentActivity.length === 0 && <div className="text-gray-500">No recent activity.</div>}
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded shadow-sm">
                <span className="font-semibold text-gray-800">{item.habitName}</span>
                <span className={`text-xs px-2 py-1 rounded ${item.status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {item.status === "completed" ? "Completed" : "Missed"}
                </span>
                <span className="text-gray-500 text-xs ml-auto">{item.when}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600">
        Welcome! Your habit analytics and management tools will appear here.
      </p>
    </div>
  );
}
