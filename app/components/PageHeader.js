import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import NewHabitModal from "./NewHabitModal";

export default function PageHeader({ title, subtitle }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="sticky top-0 z-30 w-full mx-auto bg-white border-b border-gray-200">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 font-normal leading-snug">{subtitle}</p>}
        </div>
        <Button size="sm" className="flex items-center gap-1" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add habit
        </Button>
        <NewHabitModal open={showModal} onClose={() => setShowModal(false)} onSubmit={() => setShowModal(false)} />
      </div>
    </div>
  );
} 