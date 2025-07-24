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
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pt-8 p-4">
        {/* Active Habits */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between min-h-[140px] relative">
          <span className="absolute top-4 right-4 text-xl text-blue-500">🎯</span>
          <h2 className="text-lg font-bold text-gray-700 mb-1">Active Habits</h2>
          {loading ? (
            <p className="text-gray-400 font-bold text-3xl mb-1">-</p>
          ) : (
            <p className="font-bold text-3xl mb-1">{activeHabits.length}</p>
          )}
          <p className="text-xs text-gray-500">Currently tracking</p>
        </div>
        {/* Current Streaks */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between min-h-[140px] relative">
          <span className="absolute top-4 right-4 text-xl text-orange-500">🔥</span>
          <h2 className="text-lg font-bold text-gray-700 mb-1">Current Streaks</h2>
          {loading ? (
            <p className="text-gray-400 font-bold text-3xl mb-1">-</p>
          ) : (
            <p className="font-bold text-3xl mb-1">{summary ? summary.currentStreaks : "-"}</p>
          )}
          <p className="text-xs text-gray-500">Habits with active streaks</p>
        </div>
        {/* Completion Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between min-h-[140px] relative">
          <span className="absolute top-4 right-4 text-xl text-green-600">📈</span>
          <h2 className="text-lg font-bold text-gray-700 mb-1">Completion Rate</h2>
          {loading ? (
            <p className="text-gray-400 font-bold text-3xl mb-1">-</p>
          ) : (
            <p className="font-bold text-3xl mb-1">{summary ? summary.completionRate + "%" : "-"}</p>
          )}
          <p className="text-xs text-gray-500">This week's average</p>
        </div>
        {/* Days Tracked */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between min-h-[140px] relative">
          <span className="absolute top-4 right-4 text-xl text-purple-500">🗓️</span>
          <h2 className="text-lg font-bold text-gray-700 mb-1">Days Tracked</h2>
          {loading ? (
            <p className="text-gray-400 font-bold text-3xl mb-1">-</p>
          ) : (
            <p className="font-bold text-3xl mb-1">{summary ? summary.daysTracked : "-"}</p>
          )}
          <p className="text-xs text-gray-500">Total tracking days</p>
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
