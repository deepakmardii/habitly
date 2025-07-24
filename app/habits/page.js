"use client";
import HabitCard from "../components/HabitCard";
import { useEffect, useState } from "react";

export default function Habits() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    fetch("/api/habits")
      .then((res) => res.json())
      .then((data) => setHabits(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Habits</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            title={habit.title}
            category={habit.category}
            description={habit.description}
            streak={habit.streak}
            completionPercent={habit.completionPercent}
            progressToGoal={habit.progressToGoal}
            reminderTime={habit.reminderTime}
            onMarkComplete={() => {}}
          />
        ))}
      </div>
    </div>
  );
}