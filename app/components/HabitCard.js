import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { FaTrash } from "react-icons/fa";

function HabitCard({
  habitId,
  title,
  category,
  description,
  streak,
  completionPercent,
  progressToGoal,
  reminderTime,
  onMarkComplete,
  onDelete,
}) {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  // Fetch completions for heatmap and isCompletedToday only
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

  // Check if completed today
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

  // Refetch completions after marking complete
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

  return (
    <div className="border border-gray-200 rounded-2xl p-7 bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow-lg max-w-xs mx-auto my-6 flex flex-col gap-4 relative">
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 flex items-center gap-1 border border-red-600 text-red-600 px-3 py-1 rounded hover:bg-red-50 font-semibold text-sm shadow"
          title="Delete Habit"
        >
          <FaTrash /> Delete
        </button>
      )}
      <h2 className="mb-1 text-2xl font-extrabold text-gray-900 tracking-tight">
        {title}
      </h2>
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-block px-2 py-1 rounded-full bg-indigo-200 text-indigo-700 text-xs font-semibold">
          {category}
        </span>
      </div>
      <p className="mb-2 text-gray-700 text-base leading-relaxed">
        {description}
      </p>
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-1 text-green-600 font-semibold">
          <svg
            className="w-5 h-5 inline-block"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M13 17v5h-2v-5a7 7 0 1 1 2 0z" />
          </svg>
          {streak} day streak
        </span>
        <span className="flex items-center gap-1 text-blue-600 font-semibold">
          <svg
            className="w-5 h-5 inline-block"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M12 6v6l4 2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          {completionPercent}% complete
        </span>
      </div>
      <div className="mb-2 text-gray-500 text-sm">{progressToGoal}</div>
      <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 transition-all duration-300"
          style={{ width: `${completionPercent}%` }}
        ></div>
      </div>
      {/* Heatmap */}
      {/* Removed CalendarHeatmap from HabitCard as per user request */}
      <div className="flex items-center gap-2 mb-2 text-orange-600 font-medium">
        <svg
          className="w-5 h-5 inline-block"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 8v4l3 3"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        Reminder: {reminderTime}
      </div>
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
  );
}

export default HabitCard;
