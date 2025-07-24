import { useState } from "react";

const emojis = [
  "💪", "📚", "🏃", "🧘", "🍎", "💡", "🎨", "💰", "👥", "🛠", "🎵", "📝", "🌱", "🧑‍💻", "🏆"
];
const tags = [
  "Health", "Learning", "Productivity", "Fitness", "Mindfulness", "Social", "Finance", "Work", "Hobby", "Creativity", "Music", "Writing", "Growth", "Coding", "Achievement", "Other"
];

export default function NewHabitModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    emoji: "💪",
    tag: "Health",
    color: "blue-600",
    streak_goal: 21,
    reminder_time: "",
  });
  const [error, setError] = useState("");

  function validate(form) {
    if (!form.name || form.name.length < 2 || form.name.length > 50) return "Name is required (2-50 chars)";
    if (form.description && typeof form.description !== "string") return "Description must be a string";
    if (!form.emoji) return "Emoji is required";
    if (!form.tag) return "Tag is required";
    if (!form.color) return "Color is required";
    if (!form.streak_goal || form.streak_goal < 1 || form.streak_goal > 365) return "Streak goal must be 1-365";
    if (form.reminder_time && !/^\d{2}:\d{2}$/.test(form.reminder_time)) return "Reminder time must be HH:mm";
    return null;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Create New Habit</h2>
        <form className="flex flex-col gap-3" onSubmit={e => {
          e.preventDefault();
          const err = validate(form);
          if (err) { setError(err); return; }
          setError("");
          onSubmit(form);
        }}>
          <input type="text" placeholder="Name" className="border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
          <textarea placeholder="Description" className="border rounded px-3 py-2" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
          <div>
            <label className="block mb-1 font-medium">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map(emoji => (
                <button type="button" key={emoji} className={`text-2xl p-2 rounded border ${form.emoji === emoji ? 'border-blue-600' : 'border-gray-200'}`} onClick={() => setForm(f => ({...f, emoji}))}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Tag</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button type="button" key={tag} className={`px-3 py-1 rounded-full border text-sm ${form.tag === tag ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700'}`} onClick={() => setForm(f => ({...f, tag}))}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Color</label>
            <div className="flex flex-wrap gap-2">
              {/* colorClassMap from previous logic assumed here */}
              {[
                "red-600", "orange-600", "amber-600", "yellow-600", "lime-600", "green-600", "emerald-600", "teal-600", "cyan-600", "sky-600", "blue-600", "indigo-600", "violet-600", "purple-600", "fuchsia-600", "pink-600", "rose-600"
              ].map(color => (
                <button type="button" key={color} className={`w-7 h-7 rounded-full border-2 ${form.color === color ? 'border-black' : 'border-gray-200'} bg-${color}`} onClick={() => setForm(f => ({...f, color}))}>
                  <span className="sr-only">{color}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Streak Goal</label>
            <input type="number" min="1" max="365" className="border rounded px-3 py-2 w-full" value={form.streak_goal} onChange={e => setForm(f => ({...f, streak_goal: parseInt(e.target.value) || 1}))} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Reminder Time</label>
            <input type="time" className="border rounded px-3 py-2 w-full" value={form.reminder_time} onChange={e => setForm(f => ({...f, reminder_time: e.target.value}))} />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
        </form>
      </div>
    </div>
  );
} 