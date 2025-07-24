import React, { useEffect, useState, useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

function HabitCard({
  habitId,
  title,
  emoji,
  tag,
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Pick a random background color for the emoji (stable per habitId)
  const emojiBgColors = [
    "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-pink-100", "bg-purple-100", "bg-orange-100", "bg-red-100", "bg-teal-100", "bg-indigo-100"
  ];
  const emojiBg = useMemo(() => {
    if (!habitId) return emojiBgColors[0];
    let hash = 0;
    for (let i = 0; i < habitId.length; i++) hash = habitId.charCodeAt(i) + ((hash << 5) - hash);
    return emojiBgColors[Math.abs(hash) % emojiBgColors.length];
  }, [habitId]);

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

  const handleDeleteClick = () => {
    setMenuOpen(false);
    toast.custom((t) => (
      <div className="flex flex-col gap-2 p-3 rounded-md bg-red-500 shadow-lg">
        <span className="text-base font-semibold text-white">Delete this habit?</span>
        <div className="flex gap-2 mt-1">
          <button
            className="bg-white hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded border border-red-200"
            onClick={() => {
              toast.dismiss(t.id);
              if (onDelete) onDelete();
              toast.error("Habit deleted", { style: { background: '#fee2e2', color: '#b91c1c' } });
            }}
          >
            Delete
          </button>
          <button
            className="bg-red-400 hover:bg-red-300 text-white text-xs font-semibold px-3 py-1 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm flex flex-col gap-3 relative min-h-[220px]">
      {/* Three-dot menu */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full focus:outline-none"
          title="More options"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg py-1">
            <button
              onClick={handleDeleteClick}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold text-sm rounded-md flex items-center gap-2"
            >
              <FaTrash className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>
      {/* Header: Emoji, Title, Tag */}
      <div className="flex items-center gap-3 mb-1">
        <span className={`text-3xl p-2 rounded-md ${emojiBg}`}>{emoji}</span>
        <div className="flex flex-col">
          <span className="font-bold text-xl text-gray-900 leading-tight">{title}</span>
          <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-sm font-semibold mt-0.5 w-fit">{tag}</span>
        </div>
      </div>
      {/* Description */}
      <p className="text-gray-500 text-base font-medium mb-1">{description}</p>
      {/* Streak and % Complete Row */}
      <div className="flex items-center justify-between flex-wrap mb-1">
        <span className="flex items-center gap-1 text-orange-700 font-semibold text-base">
          <span className="text-lg">🔥</span> {streak} day streak
        </span>
        <span className="flex items-center gap-1 text-blue-700 font-semibold text-base">
          <span className="text-lg">🎯</span> {completionPercent}% complete
        </span>
      </div>
      {/* Progress to goal */}
      <div className="flex items-center justify-between text-sm text-gray-800 font-semibold mb-1">
        <span>Progress to goal</span>
        <span>{progressToGoal}</span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-100 rounded-full mb-2">
        <div
          className="h-3 rounded-full bg-gray-900 transition-all duration-300"
          style={{ width: `${completionPercent}%` }}
        ></div>
      </div>
      {/* Reminder and Status */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-sm text-gray-400 font-semibold">Reminder: {reminderTime}</span>
        {isCompletedToday ? (
          <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full">Completed Today</span>
        ) : (
          <button
            onClick={handleMarkComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1 rounded-full transition-all duration-150 shadow"
            disabled={isCompletedToday}
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}

export default HabitCard;
