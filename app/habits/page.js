"use client";
import HabitCard from "../components/HabitCard";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import MiniHeatmapCard from "../components/MiniHeatmapCard";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("grid");

  const handleDelete = async (habitId) => {
    await fetch(`/api/habits/${habitId}`, { method: "DELETE" });
    // Refetch habits
    const res = await fetch("/api/habits");
    const data = await res.json();
    setHabits(data);
  };

  useEffect(() => {
    fetch("/api/habits")
      .then((res) => res.json())
      .then((data) => {
        setHabits(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching habits:', error);
        setLoading(false);
      });
  }, []);

  const safeHabits = Array.isArray(habits) ? habits : [];

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <PageHeader title="Habits" subtitle="Manage and track all your habits in one place" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6 mt-2 p-4 px-8">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="w-full md:w-72 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded-full mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-8 bg-gray-200 rounded-full w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Habits" subtitle="Manage and track all your habits in one place" />
      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6 mt-2 p-4 px-8">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search habits..."
            className="w-full md:w-72 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700"
            disabled
          />
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-100" disabled>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            Filter
          </button>
        </div>
        {/* View Toggle */}
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            className={`px-4 py-2 rounded font-semibold text-sm border transition-all duration-150 ${activeTab === "grid" ? "bg-white border-blue-500 text-blue-600 shadow" : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"}`}
            onClick={() => setActiveTab("grid")}
          >
            Grid View
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold text-sm border transition-all duration-150 ${activeTab === "heatmap" ? "bg-white border-blue-500 text-blue-600 shadow" : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"}`}
            onClick={() => setActiveTab("heatmap")}
          >
            Heatmap View
          </button>
        </div>
      </div>
      {activeTab === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {safeHabits.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[60vh] h-full w-full text-gray-400 text-lg font-semibold">
              <span>No habits yet. Start by creating your first habit!</span>
            </div>
          ) : (
            safeHabits.map((habit, idx) => (
              <HabitCard
                key={habit.id ?? idx}
                habitId={habit.id}
                title={habit.title}
                emoji={habit.emoji}
                tag={habit.tag}
                description={habit.description}
                streak={habit.streak}
                completionPercent={habit.completionPercent}
                progressToGoal={habit.progressToGoal}
                reminderTime={habit.reminderTime}
                completions={habit.completions} // Pass completion data directly
                isCompletedToday={habit.isCompletedToday} // Pass completion status directly
                onMarkComplete={async () => {
                  // Refetch habits after marking complete
                  const res = await fetch("/api/habits");
                  const data = await res.json();
                  setHabits(data);
                }}
                onDelete={() => handleDelete(habit.id)}
              />
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 m-10 p-8 pb-14 border-2 border-gray-200 rounded-2xl">
          {safeHabits.map((habit, idx) => (
            <MiniHeatmapCard
              key={habit.id}
              habitId={habit.id}
              title={habit.title}
              emoji={habit.emoji}
              tag={habit.tag}
              streak={habit.streak}
              completionPercent={habit.completionPercent}
              color={habit.color}
              completions={habit.completions} // Pass completion data directly
              isCompletedToday={habit.isCompletedToday} // Pass completion status directly
              showHeader={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
