"use client";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { X, Clock, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { toast } from "sonner";

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
  const [showTimePicker, setShowTimePicker] = useState(false);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md relative">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 text-gray-700 hover:bg-gray-200 rounded-full"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold mb-1">Create New Habit</h2>
        <div className="text-gray-500 text-base mb-6">Set up a new habit to track and build consistency.</div>
        <form className="flex flex-col gap-4" onSubmit={async e => {
          e.preventDefault();
          const err = validate(form);
          if (err) { setError(err); return; }
          setError("");
          try {
            await onSubmit(form);
            toast.success("Habit created!");
            onClose();
          } catch (e) {
            toast.error("Failed to create habit: " + (e.message || e));
          }
        }}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input id="name" type="text" placeholder="e.g., Morning Exercise" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Brief description of your habit..." value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
          </div>
          <div>
            <Label className="mb-1">Icon</Label>
            <div className="max-w-full overflow-x-auto">
              <div className="grid grid-cols-5 gap-2 min-w-[260px] w-full">
                {emojis.map(emoji => (
                  <button
                    type="button"
                    key={emoji}
                    className={`text-2xl p-2 rounded-md border transition-all duration-100 focus:outline-none ${form.emoji === emoji ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-100'}`}
                    onClick={() => setForm(f => ({...f, emoji}))}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label className="mb-1">Color</Label>
            <div className="flex flex-wrap gap-3 mt-1">
              {["#2563eb","#22c55e","#06b6d4","#a21caf","#f59e42","#ef4444","#ec4899","#a3e635"].map((hex, i) => {
                const colorMap = [
                  "blue-600","green-500","cyan-500","purple-600","orange-400","red-500","pink-500","lime-400"
                ];
                return (
                  <button
                    type="button"
                    key={hex}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-100 focus:outline-none ${form.color === colorMap[i] ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'}`}
                    style={{background: hex}}
                    onClick={() => setForm(f => ({...f, color: colorMap[i]}))}
                  >
                    {form.color === colorMap[i] && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="mb-1">Category</Label>
              <Select value={form.tag} onValueChange={tag => setForm(f => ({...f, tag}))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="streak_goal">Streak Goal (days)</Label>
              <Input id="streak_goal" type="number" min="1" max="365" value={form.streak_goal} onChange={e => setForm(f => ({...f, streak_goal: parseInt(e.target.value) || 1}))} />
            </div>
          </div>
          {/* Reminder Time - Commented out for now
          <div className="flex flex-col gap-2">
            <Label>Reminder Time</Label>
            <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  <span>{form.reminder_time ? form.reminder_time : "09:00 AM"}</span>
                  <Clock className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 flex flex-col gap-2">
                <div className="flex gap-2">
                  <select
                    className="border rounded px-2 py-1 flex-1"
                    value={form.reminder_time.split(":")[0] || "09"}
                    onChange={e => {
                      const min = form.reminder_time.split(":")[1] || "00";
                      setForm(f => ({...f, reminder_time: `${e.target.value}:${min}`}));
                    }}
                  >
                    {[...Array(24).keys()].map(h => (
                      <option key={h} value={h.toString().padStart(2, "0")}>{h.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                  <span className="self-center">:</span>
                  <select
                    className="border rounded px-2 py-1 flex-1"
                    value={form.reminder_time.split(":")[1] || "00"}
                    onChange={e => {
                      const hr = form.reminder_time.split(":")[0] || "09";
                      setForm(f => ({...f, reminder_time: `${hr}:${e.target.value}`}));
                    }}
                  >
                    {[...Array(60).keys()].map(m => (
                      <option key={m} value={m.toString().padStart(2, "0")}>{m.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  className="w-full mt-2"
                  onClick={() => setShowTimePicker(false)}
                >
                  Set Time
                </Button>
              </PopoverContent>
            </Popover>
          </div>
          */}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <div className="flex gap-4 mt-6">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-800 text-white">Create Habit</Button>
          </div>
        </form>
      </div>
    </div>
  );
} 