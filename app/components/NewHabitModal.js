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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 relative">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 text-gray-700 hover:bg-gray-200 rounded-full"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-bold mb-4">Create New Habit</h2>
        <form className="flex flex-col gap-3" onSubmit={async e => {
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
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
          </div>
          <div>
            <Label className="mb-1">Emoji</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {emojis.map(emoji => (
                <Button type="button" key={emoji} variant={form.emoji === emoji ? "default" : "outline"} size="icon" className="text-2xl" onClick={() => setForm(f => ({...f, emoji}))}>
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-1">Tag</Label>
            <Select value={form.tag} onValueChange={tag => setForm(f => ({...f, tag}))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                {tags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1">Color</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                "red-600", "orange-600", "amber-600", "yellow-600", "lime-600", "green-600", "emerald-600", "teal-600", "cyan-600", "sky-600", "blue-600", "indigo-600", "violet-600", "purple-600", "fuchsia-600", "pink-600", "rose-600"
              ].map(color => (
                <Button
                  type="button"
                  key={color}
                  variant={form.color === color ? "default" : "outline"}
                  size="icon"
                  className={`w-7 h-7 rounded-full border-2 bg-${color} relative flex items-center justify-center`}
                  onClick={() => setForm(f => ({...f, color}))}
                >
                  {form.color === color && (
                    <Check className="w-4 h-4 text-white absolute" />
                  )}
                  <span className="sr-only">{color}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="streak_goal">Streak Goal</Label>
            <Input id="streak_goal" type="number" min="1" max="365" value={form.streak_goal} onChange={e => setForm(f => ({...f, streak_goal: parseInt(e.target.value) || 1}))} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Reminder Time</Label>
            <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  <span>{form.reminder_time ? form.reminder_time : "Set time"}</span>
                  <Clock className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 flex flex-col gap-2">
                <div className="flex gap-2">
                  <select
                    className="border rounded px-2 py-1 flex-1"
                    value={form.reminder_time.split(":")[0] || ""}
                    onChange={e => {
                      const min = form.reminder_time.split(":")[1] || "00";
                      setForm(f => ({...f, reminder_time: `${e.target.value}:${min}`}));
                    }}
                  >
                    <option value="">Hour</option>
                    {[...Array(24).keys()].map(h => (
                      <option key={h} value={h.toString().padStart(2, "0")}>{h.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                  <span className="self-center">:</span>
                  <select
                    className="border rounded px-2 py-1 flex-1"
                    value={form.reminder_time.split(":")[1] || ""}
                    onChange={e => {
                      const hr = form.reminder_time.split(":")[0] || "00";
                      setForm(f => ({...f, reminder_time: `${hr}:${e.target.value}`}));
                    }}
                  >
                    <option value="">Min</option>
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
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <Button type="submit" className="mt-4 w-full">Create</Button>
        </form>
      </div>
    </div>
  );
} 