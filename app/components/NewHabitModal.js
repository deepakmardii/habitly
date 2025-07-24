import { useState } from "react";
import { FaRegSmile, FaRegHeart, FaRegStar, FaRegCheckCircle, FaRegSun } from "react-icons/fa";

const icons = [
  { name: "FaRegSmile", Comp: FaRegSmile },
  { name: "FaRegHeart", Comp: FaRegHeart },
  { name: "FaRegStar", Comp: FaRegStar },
  { name: "FaRegCheckCircle", Comp: FaRegCheckCircle },
  { name: "FaRegSun", Comp: FaRegSun },
];
const colors = [
  "red-600", "orange-600", "amber-600", "yellow-600", "lime-600", "green-600", "emerald-600", "teal-600", "cyan-600", "sky-600", "blue-600", "indigo-600", "violet-600", "purple-600", "fuchsia-600", "pink-600", "rose-600"
];

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

export default function NewHabitModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "FaRegSmile",
    color: "blue-600",
    streak_goal: 21,
    reminder_time: "",
  });
  const [error, setError] = useState("");

  function validate(form) {
    if (!form.name || form.name.length < 2 || form.name.length > 50) return "Name is required (2-50 chars)";
    if (form.description && typeof form.description !== "string") return "Description must be a string";
    if (!form.icon) return "Icon is required";
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
            <label className="block mb-1 font-medium">Icon</label>
            <div className="flex gap-2">
              {icons.map(({ name, Comp }) => (
                <button type="button" key={name} className={`p-2 rounded border ${form.icon === name ? 'border-blue-600' : 'border-gray-200'}`} onClick={() => setForm(f => ({...f, icon: name}))}>
                  <Comp className="text-2xl" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Color</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button type="button" key={color} className={`w-7 h-7 rounded-full border-2 ${form.color === color ? 'border-black' : 'border-gray-200'} ${colorClassMap[color]}`} onClick={() => setForm(f => ({...f, color}))}>
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