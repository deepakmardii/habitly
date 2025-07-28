"use client";
import PageHeader from "../components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaChartLine, FaFire, FaPercent, FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { useSubscription } from "../hooks/useSubscription";
import UpgradePrompt from "../components/UpgradePrompt";

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    summary: null,
    details: null
  });
  const [loading, setLoading] = useState(true);
  const { subscription, loading: subLoading } = useSubscription();

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalyticsData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      });
  }, []);

  const { summary, details } = analyticsData;

  // Prepare chart data
  const weeklyData = details?.weeklyCompletions?.map((count, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    count,
  })) || [];
  const monthlyData = details?.monthlySuccessRate || [];
  const habits = details?.habitPerformance || [];

  // Loading skeleton
  if (loading || subLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PageHeader title="Analytics" subtitle="View your habit analytics and insights." showAddHabit={false} />
        {/* 4 Analytics Cards Skeleton */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pt-8 p-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="relative animate-pulse">
              <div className="absolute top-4 right-4 w-6 h-6 bg-gray-200 rounded"></div>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const isPro = subscription && subscription.plan === 'pro';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageHeader title="Analytics" subtitle="View your habit analytics and insights." showAddHabit={false} />
      {/* 4 Analytics Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pt-8 p-4">
        {/* Total Completions */}
        <Card className="relative">
          <span className="absolute top-4 right-4 text-xl text-green-600"><FaCheckCircle /></span>
          <CardHeader>
            <CardTitle>Total Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl mb-1">
              {!summary ? "-" : summary.totalCompletions}
            </div>
            <div className="text-xs text-green-600 font-semibold">
              {!summary ? "" : `${summary.totalCompletionsChange >= 0 ? "+" : ""}${summary.totalCompletionsChange}% from last month`}
            </div>
          </CardContent>
        </Card>
        {/* Average Streak */}
        <Card className="relative">
          <span className="absolute top-4 right-4 text-xl text-orange-500"><FaFire /></span>
          <CardHeader>
            <CardTitle>Average Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl mb-1">
              {!summary ? "-" : summary.averageStreak}
            </div>
            <div className="text-xs text-blue-600 font-semibold">
              {!summary ? "" : `+${summary.averageStreakImprovement.toFixed(1)} days improvement`}
            </div>
          </CardContent>
        </Card>
        {/* Best Streak */}
        <Card className="relative">
          <span className="absolute top-4 right-4 text-xl text-purple-500"><FaChartLine /></span>
          <CardHeader>
            <CardTitle>Best Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl mb-1">
              {!summary ? "-" : summary.bestStreak}
            </div>
            <div className="text-xs text-gray-600 font-semibold">
              {!summary ? "" : summary.bestStreakHabit ? summary.bestStreakHabit : "-"}
            </div>
          </CardContent>
        </Card>
        {/* Success Rate */}
        <Card className="relative">
          <span className="absolute top-4 right-4 text-xl text-blue-600"><FaPercent /></span>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-3xl mb-1">
              {!summary ? "-" : `${summary.successRate}%`}
            </div>
            <div className="text-xs text-green-600 font-semibold">
              {!summary ? "" : `${summary.successRateChange >= 0 ? "+" : ""}${summary.successRateChange}% this week`}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Lower Section: Charts and Habit Performance */}
      {isPro ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* Left: Charts */}
        <div className="flex flex-col gap-8">
          {/* Weekly Completions */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Completions</CardTitle>
              <div className="text-gray-500 text-sm font-normal">Number of habits completed each day this week</div>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barSize={32}>
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#fb923c" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Monthly Success Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Success Rate</CardTitle>
              <div className="text-gray-500 text-sm font-normal">Your habit completion rate trend over the past 6 months</div>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right: Habit Performance */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Habit Performance</CardTitle>
              <div className="text-gray-500 text-sm font-normal">Individual habit completion rates and trends</div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                  {habits.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No habits found. Create some habits to see analytics here.
                    </div>
                  ) : (
                    habits.map((habit, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl mr-2">{habit.emoji}</span>
                      <span className="font-semibold text-base text-gray-900 flex-1">{habit.name}</span>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 rounded px-2 py-1 mr-2">
                        {habit.streak} day streak
                      </span>
                      <span className={`text-xs font-semibold flex items-center gap-1 ${habit.trend > 0 ? "text-green-600" : habit.trend < 0 ? "text-red-500" : "text-gray-400"}`}>
                        {habit.trend > 0 && <FaArrowUp />} {habit.trend < 0 && <FaArrowDown />} {habit.trend === 0 && <FaMinus />} {habit.trend > 0 ? "+" : ""}{habit.trend}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full mt-2 mb-1">
                      <div
                        className="h-3 rounded-full bg-gray-900 transition-all"
                        style={{ width: `${habit.completionRate}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-700 font-semibold text-right">{habit.completionRate}%</div>
                  </div>
                    ))
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <UpgradePrompt 
            title="Unlock Advanced Analytics"
            description="Upgrade to Pro to access detailed charts, trends, and habit performance insights."
            variant="default"
          />
        </div>
      )}
    </div>
  );
} 