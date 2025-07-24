"use client";
import Navbar from "./components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="font-sans min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-20 gap-6">
          <Image src="/next.svg" alt="Habitly Logo" width={120} height={32} priority />
          <h1 className="text-4xl font-bold text-center">Track Habits. Build Streaks. Stay Motivated.</h1>
          <p className="text-lg text-center max-w-xl text-gray-600 dark:text-gray-300">
            Minimalist habit tracker with analytics, heatmap calendar, and reminders. Powered by NeonTech.
          </p>
          <a href="/signup" className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
            Get Started
          </a>
        </section>
        {/* Features Section */}
        <section className="py-16 px-4 max-w-4xl mx-auto grid gap-10">
          <h2 className="text-2xl font-semibold text-center mb-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
              <Image src="/file.svg" alt="Fast Auth" width={40} height={40} />
              <h3 className="font-bold mt-4 mb-2">Fast Auth</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">Sign up or log in instantly with NeonTech Auth.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
              <Image src="/window.svg" alt="Heatmap Calendar" width={40} height={40} />
              <h3 className="font-bold mt-4 mb-2">Heatmap Calendar</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">Visualize your habit streaks with a GitHub-style calendar.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
              <Image src="/globe.svg" alt="Analytics" width={40} height={40} />
              <h3 className="font-bold mt-4 mb-2">Analytics</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">Track completions, streaks, and progress over time.</p>
            </div>
          </div>
        </section>
        {/* How It Works Section */}
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">How It Works</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-200">
            <li>Sign up and create your first habit.</li>
            <li>Set streak goals and reminders.</li>
            <li>Mark habits as complete each day.</li>
            <li>View your progress in the heatmap calendar.</li>
            <li>Analyze your streaks and completion rates.</li>
          </ol>
        </section>
        {/* Analytics Section */}
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Analytics & Insights</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex-1">
              <h3 className="font-bold mb-2">Streak Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">Monitor your longest streaks and daily completions.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex-1">
              <h3 className="font-bold mb-2">Completion Rate</h3>
              <p className="text-gray-600 dark:text-gray-300">See your overall habit completion percentage and trends.</p>
            </div>
          </div>
        </section>
        {/* Call to Action Section */}
        <section className="py-16 flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-semibold text-center">Ready to build better habits?</h2>
          <a href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
            Create your account
          </a>
          <p className="text-gray-600 dark:text-gray-300">Already have an account? <a href="/login" className="underline text-blue-600">Log in</a></p>
        </section>
      </div>
    </>
  );
}
