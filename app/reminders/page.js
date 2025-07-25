import React from "react";
import PageHeader from "../components/PageHeader";

export default function Reminders() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageHeader title="Reminders" subtitle="Manage your habit reminders and notification settings." showAddHabit={false} />
      <div className="w-full p-8">
        <div className="border border-gray-200 rounded-2xl bg-white p-8 mb-8">
          <div className="text-gray-400 text-center text-lg py-8">Coming soon</div>
        </div>
      </div>
    </div>
  );
} 