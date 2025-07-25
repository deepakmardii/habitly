"use client";
import Navbar from "./components/Navbar";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold text-center">Track Habits. Build Streaks. Stay Motivated.</h1>
          <p className="text-lg text-center max-w-xl text-gray-600 dark:text-gray-300">
            Minimalist habit tracker with analytics, heatmap calendar, and reminders. Powered by NeonTech.
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Sign up with Google <FcGoogle className="text-2xl" />
          </button>
        </div>
      </div>
    </>
  );
}
