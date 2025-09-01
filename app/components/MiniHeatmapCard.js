import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../components/ui/tooltip";

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

const lightColorClassMap = {
  "red-600": "bg-red-200",
  "orange-600": "bg-orange-200",
  "amber-600": "bg-amber-200",
  "yellow-600": "bg-yellow-200",
  "lime-600": "bg-lime-200",
  "green-600": "bg-green-200",
  "emerald-600": "bg-emerald-200",
  "teal-600": "bg-teal-200",
  "cyan-600": "bg-cyan-200",
  "sky-600": "bg-sky-200",
  "blue-600": "bg-blue-200",
  "indigo-600": "bg-indigo-200",
  "violet-600": "bg-violet-200",
  "purple-600": "bg-purple-200",
  "fuchsia-600": "bg-fuchsia-200",
  "pink-600": "bg-pink-200",
  "rose-600": "bg-rose-200",
};

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

export default function MiniHeatmapCard({
  habitId,
  title,
  emoji,
  tag,
  streak,
  completionPercent,
  color,
  completions = [], // Accept completions data from parent
  isCompletedToday = false, // Accept completion status from parent
  showHeader = false,
}) {
  // Emoji background color (stable per habitId)
  const emojiBgColors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-pink-100",
    "bg-purple-100",
    "bg-orange-100",
    "bg-red-100",
    "bg-teal-100",
    "bg-indigo-100",
  ];
  const emojiBg = (() => {
    if (!habitId) return emojiBgColors[0];
    let hash = 0;
    for (let i = 0; i < habitId.length; i++)
      hash = habitId.charCodeAt(i) + ((hash << 5) - hash);
    return emojiBgColors[Math.abs(hash) % emojiBgColors.length];
  })();

  const completedSet = new Set(completions.map((c) => c.slice(0, 10))); // Handle date strings directly
  const days = getYearDays();
  const weeks = Array.from({ length: 53 }, (_, w) =>
    days.slice(w * 7, w * 7 + 7)
  );

  function getShade(day) {
    if (!color) return "bg-gray-200";
    if (completedSet.has(day)) {
      // Completed: use original (darker) color
      return colorClassMap[color] || "bg-gray-600";
    } else {
      // Not completed: use lighter shade
      return lightColorClassMap[color] || "bg-gray-200";
    }
  }

  return (
    <div className="w-full bg-white m-0 py-3 flex flex-col gap-1.5 overflow-x-auto box-border">
      {/* Header: Only show if showHeader is true */}
      {showHeader && (
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-2xl p-2 rounded-md ${emojiBg}`}>{emoji}</span>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-gray-900 leading-tight">
              {title}
            </span>
            <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-semibold mt-0.5 w-fit">
              {tag}
            </span>
          </div>
          <div className="ml-auto">
            {isCompletedToday && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-4 py-1 rounded-full">
                Completed Today
              </span>
            )}
          </div>
        </div>
      )}
      {showHeader && (
        <div className="flex items-center gap-6 flex-wrap mb-1">
          <span className="flex items-center gap-1 text-orange-700 font-semibold text-base">
            <span className="text-lg">🔥</span> {streak} day streak
          </span>
          <span className="flex items-center gap-1 text-blue-700 font-semibold text-base">
            <span className="text-lg">🎯</span> {completionPercent}% completion
            rate
          </span>
        </div>
      )}
      {showHeader && (
        <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2 mt-2">
          <FaCalendarAlt className="w-4 h-4" />
          Activity over the past year
        </div>
      )}
      {/* Heatmap */}
      <div className="w-full max-w-full overflow-x-auto">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-xs text-gray-400 font-semibold">Less</span>
            <div className="flex gap-1">
              {/* The colorScaleMap and dynamic color classes are removed as per the edit hint. */}
              {/* The color prop is now directly used for the completed days. */}
              {/* The colorScaleMap and dynamic color classes are removed as per the edit hint. */}
            </div>
            <span className="text-xs text-gray-400 font-semibold">More</span>
          </div>
          <div className="flex">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col">
                {week.map((day, di) => (
                  <Tooltip key={day}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 m-0.25 rounded ${getShade(
                          day
                        )} border border-gray-200 transition-all duration-100 hover:ring-2 hover:ring-gray-700 hover:ring-offset-1`}
                      />
                    </TooltipTrigger>
                    <TooltipContent sideOffset={4}>
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">{day}</span>
                        <span className="text-xs text-gray-400">
                          {completedSet.has(day)
                            ? "Completed"
                            : "Not completed"}
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
