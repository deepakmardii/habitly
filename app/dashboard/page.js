"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import MiniHeatmapCard from "../components/MiniHeatmapCard";
import NewHabitModal from "../components/NewHabitModal";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FcIdea, FcCalendar, FcSurvey, FcAlarmClock, FcTodoList, FcHighPriority } from "react-icons/fc";

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <PageHeader title="Dashboard" subtitle="Welcome back! Here's your habit progress overview." />
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pt-8 p-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center min-h-[140px] relative animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-12 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 px-8">
      <div className="md:col-span-2">
        <div className="border border-gray-200 rounded-2xl bg-white p-8 mb-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="md:col-span-1">
        <div className="border border-gray-200 rounded-2xl bg-white p-6 mb-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState({
    habits: [],
    summary: null,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Debug authentication
  useEffect(() => {
    console.log('Dashboard - Session status:', status);
    console.log('Dashboard - Session data:', session);
  }, [session, status]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      console.log('User is not authenticated');
      setLoading(false);
      return;
    }

    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Dashboard fetch error:', error);
        setLoading(false);
      });
  }, [status]);

  // Show loading or authentication message
  if (status === 'loading') {
    return <LoadingSkeleton />;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const { habits, summary, recentActivity } = dashboardData;
  const safeHabits = Array.isArray(habits) ? habits : [];
  const safeRecentActivity = Array.isArray(recentActivity) ? recentActivity : [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's your habit progress overview." />
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pt-8 p-4">
        {/* Active Habits */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center min-h-[140px] relative">
          <span className="absolute top-4 right-4 text-xl text-blue-500">🎯</span>
          <h2 className="text-lg font-bold text-gray-700 mb-1">Active Habits</h2>
          {loading ? (
            <p className="text-gray-400 font-bold text-3xl mb-1">-</p>
          ) : safeHabits.length === 0 ? (
            <>
              <FcIdea className="text-4xl mb-2" />
              <p className="text-gray-400 font-semibold">No habits yet!</p>
            </>
          ) : (
            <p className="font-bold text-3xl mb-1">{safeHabits.length}</p>
          )}
          <p className="text-xs text-gray-500">Currently tracking</p>
        </div>
        {/* Current Streaks */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center min-h-[140px] relative">
          <span className="absolute top-4 right-4 text-xl text-orange-500">🔥</span>
          <h2 className="text-lg font-bold text-gray-700 mb-1">Current Streaks</h2>
          {loading ? (
            <p className="text-gray-400 font-bold text-3xl mb-1">-</p>
          ) : !summary || summary.currentStreaks === undefined ? (
            <>
              <FcAlarmClock className="text-4xl mb-2" />
              <p className="text-gray-400 font-semibold">No streaks yet!</p>
            </>
          ) : (
            <p className="font-bold text-3xl mb-1">{summary.currentStreaks}</p>
          )}
          <p className="text-xs text-gray-500">Habits with active streaks</p>
        </div>
        {/* Completion Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center min-h-[140px] relative">
          <span className="absolute top-4 right-4 text-xl text-green-600">📈</span>
          <h2 className="text-lg font-bold text-gray-700 mb-1">Completion Rate</h2>
          {loading ? (
            <p className="text-gray-400 font-bold text-3xl mb-1">-</p>
          ) : !summary || summary.completionRate === undefined ? (
            <>
              <FcSurvey className="text-4xl mb-2" />
              <p className="text-gray-400 font-semibold">No completions yet!</p>
            </>
          ) : (
            <p className="font-bold text-3xl mb-1">{summary.completionRate + "%"}</p>
          )}
          <p className="text-xs text-gray-500">This week's average</p>
        </div>
        {/* Days Tracked */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center min-h-[140px] relative">
          <span className="absolute top-4 right-4 text-xl text-purple-500">🗓️</span>
          <h2 className="text-lg font-bold text-gray-700 mb-1">Days Tracked</h2>
          {loading ? (
            <p className="text-gray-400 font-bold text-3xl mb-1">-</p>
          ) : !summary || summary.daysTracked === undefined ? (
            <>
              <FcCalendar className="text-4xl mb-2" />
              <p className="text-gray-400 font-semibold">No days tracked yet!</p>
            </>
          ) : (
            <p className="font-bold text-3xl mb-1">{summary.daysTracked}</p>
          )}
          <p className="text-xs text-gray-500">Total tracking days</p>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 px-8">
        {/* Left: Habit Activity Heatmaps */}
        <div className="md:col-span-2">
          <div className="border border-gray-200 rounded-2xl bg-white p-8 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <FcTodoList className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-gray-900">Habit Activity Heatmaps</h2>
            </div>
            <div className="text-gray-500 text-base mb-6 ml-9">Individual completion patterns for each of your habits</div>
            {safeHabits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-lg font-semibold gap-2">
                <FcIdea className="text-5xl mb-2" />
                <span>No habits yet. Your heatmap will appear here after you create one!</span>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {safeHabits.slice(0, 4).map((habit) => (
                  <div key={habit.id} className="flex flex-col items-start gap-4">
                    <div className="flex items-center gap-4">
                      <span className={`text-2xl p-2 rounded-md bg-blue-100 mt-1`}>{habit.emoji}</span>
                      <div className="flex flex-col flex-1">
                        <span className="font-semibold text-lg text-gray-900">{habit.title}</span>
                        <div className="flex items-center gap-4 text-gray-500 text-base mb-2">
                          <span>{habit.streak} day streak</span>
                          <span>• {habit.completionPercent}% completion rate</span>
                        </div>
                      </div>
                    </div>
                    <MiniHeatmapCard
                      key={habit.id}
                      habitId={habit.id}
                      title={undefined}
                      streak={undefined}
                      completionPercent={undefined}
                      color={habit.color}
                      emoji={undefined}
                      tag={undefined}
                      completions={habit.completions} // Pass completion data
                      isCompletedToday={habit.isCompletedToday} // Pass completion status
                      showHeader={false}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Right: Recent Activity */}
        <div className="md:col-span-1">
          <div className="border border-gray-200 rounded-2xl bg-white p-6 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <FcHighPriority className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="text-gray-500 text-base mb-6 ml-9">Your latest habit completions and updates</div>
            {safeRecentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-lg font-semibold gap-2">
                <FcHighPriority className="text-5xl mb-2" />
                <span>No recent activity. Get moving and make some progress!</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {safeRecentActivity.map((item, idx) => {
                  const habitEmoji = habits.find(h => h.id === item.habitId)?.emoji || "❓";
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <span className={`text-2xl p-2 rounded-md bg-blue-100`}>{habitEmoji}</span>
                      <div className="flex flex-col flex-1">
                        <span className="font-semibold text-base text-gray-900">{item.habitName} {item.status === "completed" ? <FaCheckCircle className="inline ml-1 text-green-500 w-4 h-4" /> : <FaTimesCircle className="inline ml-1 text-red-500 w-4 h-4" />}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.status === "completed" ? "bg-gray-900 text-white" : "bg-red-500 text-white"}`}>
                            {item.status === "completed" ? "completed" : "missed"}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{item.when}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-center mt-8">
        {safeHabits.length === 0 && safeRecentActivity.length === 0 ? (
          <>
            <Button
              className="mx-auto mt-2 px-6 py-3 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow"
              onClick={() => setShowModal(true)}
            >
              <span className="mr-2">✨</span> Create your first habit
            </Button>
            <NewHabitModal open={showModal} onClose={() => setShowModal(false)} onSubmit={() => setShowModal(false)} />
          </>
        ) : (
          "Welcome! Your habit analytics and management tools will appear here."
        )}
      </p>
    </div>
  );
}
