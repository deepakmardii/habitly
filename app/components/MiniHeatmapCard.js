import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

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

export default function MiniHeatmapCard({ habitId, title, emoji, tag, streak, completionPercent, color }) {
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

  // Emoji background color (stable per habitId)
  const emojiBgColors = [
    "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-pink-100", "bg-purple-100", "bg-orange-100", "bg-red-100", "bg-teal-100", "bg-indigo-100"
  ];
  const emojiBg = (() => {
    if (!habitId) return emojiBgColors[0];
    let hash = 0;
    for (let i = 0; i < habitId.length; i++) hash = habitId.charCodeAt(i) + ((hash << 5) - hash);
    return emojiBgColors[Math.abs(hash) % emojiBgColors.length];
  })();

  const completedSet = new Set(completions.map(c => c.date.slice(0, 10)));
  const days = getYearDays();
  const weeks = Array.from({ length: 53 }, (_, w) => days.slice(w * 7, w * 7 + 7));

  // Blue color scale for heatmap
  const blueScale = ["bg-blue-50", "bg-blue-200", "bg-blue-400", "bg-blue-600"];
  function getBlueShade(day) {
    if (!completedSet.has(day)) return "bg-white";
    // For demo: randomize shade for visual effect
    const idx = (day.charCodeAt(0) + day.charCodeAt(day.length-1)) % blueScale.length;
    return blueScale[idx];
  }

  return (
    <div className="w-full bg-white m-0 p-0 flex flex-col gap-2 overflow-x-auto box-border">
      {/* <div className="flex items-center gap-3 mb-1">
        <span className={`text-2xl p-2 rounded-md ${emojiBg}`}>{emoji}</span>
        <div className="flex flex-col">
          <span className="font-bold text-xl text-gray-900 leading-tight">{title}</span>
          <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-semibold mt-0.5 w-fit">{tag}</span>
        </div>
        <div className="ml-auto">
          {isCompletedToday && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-4 py-1 rounded-full">Completed Today</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6 flex-wrap mb-1">
        <span className="flex items-center gap-1 text-orange-700 font-semibold text-base">
          <span className="text-lg">🔥</span> {streak} day streak
        </span>
        <span className="flex items-center gap-1 text-blue-700 font-semibold text-base">
          <span className="text-lg">🎯</span> {completionPercent}% completion rate
        </span>
      </div> */}
      <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2 mt-2">
        <FaCalendarAlt className="w-4 h-4" />
        Activity over the past year
      </div>
      <div className="w-full max-w-full overflow-x-auto">
        {loading ? (
          <div className="text-gray-400 text-sm">Loading heatmap...</div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-xs text-gray-400 font-semibold">Less</span>
              <div className="flex gap-1">
                {blueScale.map((cls, i) => (
                  <div key={i} className={`w-4 h-3 rounded ${cls} border border-gray-200`} />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-semibold">More</span>
            </div>
            <div className="flex">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col">
                  {week.map((day, di) => (
                    <div
                      key={day}
                      className={`w-4 h-4 m-0.5 rounded ${getBlueShade(day)} border border-gray-200`}
                      title={day}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 