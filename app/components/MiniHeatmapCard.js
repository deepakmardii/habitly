import { useEffect, useState } from "react";

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

  const completedSet = new Set(completions.map(c => c.date.slice(0, 10)));
  const days = getYearDays();
  const weeks = Array.from({ length: 53 }, (_, w) => days.slice(w * 7, w * 7 + 7));

  return (
    <div className="w-full border border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{emoji}</span>
        <span className="inline-block px-2 py-1 rounded-full bg-indigo-200 text-indigo-700 text-xs font-semibold">{tag}</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-2 md:mb-0">{title}</h2>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
            <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 17v5h-2v-5a7 7 0 1 1 2 0z" />
            </svg>
            {streak} day streak
          </span>
          <span className="flex items-center gap-1 text-blue-600 font-semibold text-sm">
            <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            {completionPercent}% complete
          </span>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        {loading ? (
          <div className="text-gray-400 text-sm">Loading heatmap...</div>
        ) : (
          <div className="flex">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col">
                {week.map((day, di) => (
                  <div
                    key={day}
                    className={`w-3 h-3 m-0.5 rounded ${completedSet.has(day) ? colorClassMap[color] || "bg-gray-400" : "bg-white"} border border-gray-200`}
                    title={day}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 