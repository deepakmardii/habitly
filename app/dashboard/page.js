"use client";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/habits")
      .then((res) => res.json())
      .then((data) => {
        setHabits(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeHabits = habits;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="w-full max-w-md bg-gray-100 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Active Habits</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            <p className="font-bold mb-2">
              {activeHabits.length} active habit
              {activeHabits.length !== 1 ? "s" : ""}
            </p>
            {/* <ul className="list-disc list-inside text-gray-800">
              {activeHabits.map((habit) => (
                <li key={habit.id || habit.name}>{habit.name}</li>
              ))}
            </ul> */}
          </>
        )}

        <p className="text-gray-700 mb-2">Currently tracking</p>
      </div>
      <p className="text-gray-600">
        Welcome! Your habit analytics and management tools will appear here.
      </p>
    </div>
  );
}
