"use client";
import HabitCard from "../components/HabitCard";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import PageHeader from "../components/PageHeader";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [activeTab, setActiveTab] = useState("grid");
  const handleDelete = async (habitId) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    await fetch(`/api/habits/${habitId}`, { method: "DELETE" });
    // Refetch habits
    const res = await fetch("/api/habits");
    const data = await res.json();
    setHabits(data);
  };

  useEffect(() => {
    fetch("/api/habits")
      .then((res) => res.json())
      .then((data) => setHabits(data));
  }, []);

  return (
    <div>
      <PageHeader title="Habits" subtitle="Manage and track all your habits in one place" />
      <div className="flex mb-4 gap-2">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("grid")}
        >
          Grid View
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "heatmap" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("heatmap")}
        >
          Heatmap View
        </button>
      </div>
      {activeTab === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit, idx) => (
            <HabitCard
              key={habit.id ?? idx}
              habitId={habit.id}
              title={habit.title}
              category={habit.category}
              description={habit.description}
              streak={habit.streak}
              completionPercent={habit.completionPercent}
              progressToGoal={habit.progressToGoal}
              reminderTime={habit.reminderTime}
              onMarkComplete={async () => {
                // Refetch habits after marking complete
                const res = await fetch("/api/habits");
                const data = await res.json();
                setHabits(data);
              }}
              onDelete={() => handleDelete(habit.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {habits.map((habit, idx) => (
            <HeatmapHabitCard
              key={habit.id ?? idx}
              habitId={habit.id}
              title={habit.title}
              streak={habit.streak}
              completionPercent={habit.completionPercent}
              color={habit.color}
              onMarkComplete={async () => {
                // Refetch habits after marking complete
                const res = await fetch("/api/habits");
                const data = await res.json();
                setHabits(data);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HeatmapHabitCard({
  habitId,
  title,
  streak,
  completionPercent,
  color,
  onMarkComplete,
}) {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  useEffect(() => {
    async function fetchCompletions() {
      setLoading(true);
      try {
        if (!habitId) throw new Error("habitId is missing");
        const res = await fetch(`/api/habits/completions?habitId=${habitId}`);
        const data = await res.json();
        setCompletions(Array.isArray(data) ? data.map((date) => ({ date })) : []);
      } catch (e) {
        setCompletions([]);
      }
      setLoading(false);
    }
    fetchCompletions();
  }, [habitId]);

  useEffect(() => {
    if (!loading && completions.length > 0) {
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      const dates = completions.map((c) => c.date.slice(0, 10));
      setIsCompletedToday(dates.includes(todayStr));
    } else {
      setIsCompletedToday(false);
    }
  }, [completions, loading]);

  const handleMarkComplete = async () => {
    try {
      await fetch(`/api/habits/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId }),
      });
      if (onMarkComplete) await onMarkComplete();
      if (habitId) {
        const res = await fetch(`/api/habits/completions?habitId=${habitId}`);
        const data = await res.json();
        setCompletions(Array.isArray(data) ? data.map((date) => ({ date })) : []);
      }
    } catch (e) {}
  };

  const colorClassMap = {
    "red-600": "bg-red-600",
    "orange-600": "bg-orange-600",
    "amber-600": "bg-amber-600",
    "yellow-600": "bg-yellow-600",
    "lime-600": "bg-lime-600",
    "green-600": "bg-green-600",
    "emerald-600": "bg-emerald-600",
    "teal-600": "bg-teal-600",
    "cyan-600": "bg-cyan-600",
    "sky-600": "bg-sky-600",
    "blue-600": "bg-blue-600",
    "indigo-600": "bg-indigo-600",
    "violet-600": "bg-violet-600",
    "purple-600": "bg-purple-600",
    "fuchsia-600": "bg-fuchsia-600",
    "pink-600": "bg-pink-600",
    "rose-600": "bg-rose-600",
  };

  return (
    <div className="w-full border border-gray-200 rounded-2xl p-7 bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow-lg my-6 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2 md:mb-0">{title}</h2>
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1 text-green-600 font-semibold">
            <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 17v5h-2v-5a7 7 0 1 1 2 0z" />
            </svg>
            {streak} day streak
          </span>
          <span className="flex items-center gap-1 text-blue-600 font-semibold">
            <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            {completionPercent}% complete
          </span>
          <button
            onClick={handleMarkComplete}
            className={`bg-indigo-500 text-white rounded-xl px-5 py-2 font-bold shadow hover:bg-indigo-600 hover:scale-105 transition-all duration-200 ${
              isCompletedToday ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isCompletedToday}
          >
            {isCompletedToday ? "Completed Today" : "Mark Complete"}
          </button>
        </div>
      </div>
      <div className="mb-2 text-gray-700 font-semibold">Activity over the past year</div>
      <div className="w-full overflow-x-auto">
        {loading ? (
          <div className="text-gray-400 text-sm">Loading heatmap...</div>
        ) : (
          <YearHeatmap completions={completions} color={color} />
        )}
      </div>
    </div>
  );
}

function getYearDays() {
  const days = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - (364 - i));
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function YearHeatmap({ completions, color }) {
  const colorClassMap = {
    "red-600": "bg-red-600",
    "orange-600": "bg-orange-600",
    "amber-600": "bg-amber-600",
    "yellow-600": "bg-yellow-600",
    "lime-600": "bg-lime-600",
    "green-600": "bg-green-600",
    "emerald-600": "bg-emerald-600",
    "teal-600": "bg-teal-600",
    "cyan-600": "bg-cyan-600",
    "sky-600": "bg-sky-600",
    "blue-600": "bg-blue-600",
    "indigo-600": "bg-indigo-600",
    "violet-600": "bg-violet-600",
    "purple-600": "bg-purple-600",
    "fuchsia-600": "bg-fuchsia-600",
    "pink-600": "bg-pink-600",
    "rose-600": "bg-rose-600",
  };
  const completedSet = new Set(completions.map(c => c.date.slice(0, 10)));
  const days = getYearDays();
  // 53 weeks x 7 days (some cells may be empty at start/end)
  const weeks = Array.from({ length: 53 }, (_, w) => days.slice(w * 7, w * 7 + 7));
  return (
    <div className="flex">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col">
          {week.map((day, di) => (
            <div
              key={day}
              className={`w-4 h-4 m-0.5 rounded ${completedSet.has(day) ? colorClassMap[color] || "bg-gray-400" : "bg-white"} border border-gray-200`}
              title={day}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
