"use client";
import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import MiniHeatmapCard from "../components/MiniHeatmapCard";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 px-8">
        {/* Left: Habit Activity Heatmaps */}
        <div className="md:col-span-2">
          <div className="border border-gray-200 rounded-2xl bg-white p-8 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <FaCalendarAlt className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Habit Activity Heatmaps</h2>
            </div>
            <div className="text-gray-500 text-base mb-6 ml-9">Individual completion patterns for each of your habits</div>
            <div className="flex flex-col gap-8">
            {habits.slice(0, 4).map((habit) => (
                <div key={habit.id} className="flex flex-col items-start gap-4">
                  <div className="flex items-center gap-4">
                  <span className={`text-2xl p-2 rounded-md bg-blue-100 mt-1`}>{habit.emoji}</span>
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-lg text-gray-900">{habit.title}</span>
                    <div className="flex items-center gap-4 text-gray-500 text-base mb-2">
                      <span>{habit.streak} day streak</span>
                      <span>• {habit.completionPercent}% completion rate</span>
                    </div>
                   
                  </div>
                  </div>
              <MiniHeatmapCard
                key={habit.id}
                habitId={habit.id}
                title={undefined}
                streak={undefined}
                completionPercent={undefined}
                color={habit.color}
                emoji={undefined}
                tag={undefined}
                showHeader={false}
              />
                </div>
            ))}
            </div>
          </div>
        </div>
        {/* Right: Recent Activity */}
        <div className="md:col-span-1">
          <div className="border border-gray-200 rounded-2xl bg-white p-6 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <FaClock className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="text-gray-500 text-base mb-6 ml-9">Your latest habit completions and updates</div>
            <div className="flex flex-col gap-4">
            {recentActivity.length === 0 && <div className="text-gray-500">No recent activity.</div>}
              {recentActivity.map((item, idx) => {
                const habitEmoji = habits.find(h => h.id === item.habitId)?.emoji || "❓";
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className={`text-2xl p-2 rounded-md bg-blue-100`}>{habitEmoji}</span>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-base text-gray-900">{item.habitName} {item.status === "completed" ? <FaCheckCircle className="inline ml-1 text-green-500 w-4 h-4" /> : <FaTimesCircle className="inline ml-1 text-red-500 w-4 h-4" />}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.status === "completed" ? "bg-gray-900 text-white" : "bg-red-500 text-white"}`}>
                          {item.status === "completed" ? "completed" : "missed"}
                </span>
                        <span className="text-xs text-gray-500 ml-2">{item.when}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
