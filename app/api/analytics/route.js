import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    const userId = user.id;

    // Get all data in parallel with optimized queries
    const [habits, allCompletions] = await Promise.all([
      // Get all habits
      prisma.habit.findMany({ where: { userId } }),
      // Get all completions for this user in one query
      prisma.habitCompletion.findMany({
        where: { userId },
        select: { completion_date: true, habitId: true },
        orderBy: { completion_date: "asc" },
      })
    ]);

    if (habits.length === 0) {
      return new Response(JSON.stringify({
        summary: {
          totalCompletions: 0,
          totalCompletionsChange: 0,
          averageStreak: 0,
          averageStreakImprovement: 0,
          bestStreak: 0,
          bestStreakHabit: "",
          successRate: 0,
          successRateChange: 0,
        },
        details: {
          weeklyCompletions: Array(7).fill(0),
          monthlySuccessRate: [],
          habitPerformance: [],
        }
      }), { status: 200 });
    }

    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);

    // --- SUMMARY CALCULATIONS ---

    // 1. Total completions and monthly comparison
    const totalCompletions = allCompletions.length;
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    let thisMonthCompletions = 0;
    let lastMonthCompletions = 0;
    for (const c of allCompletions) {
      const date = new Date(c.completion_date);
      if (date >= startOfThisMonth) thisMonthCompletions++;
      else if (date >= startOfLastMonth && date <= endOfLastMonth) lastMonthCompletions++;
    }

    let totalCompletionsChange = 0;
    if (lastMonthCompletions > 0) {
      totalCompletionsChange = Math.round(((thisMonthCompletions - lastMonthCompletions) / lastMonthCompletions) * 100);
    } else if (thisMonthCompletions > 0) {
      totalCompletionsChange = 100;
    }

    // 2. Streak calculations
    let streaks = [];
    let bestStreak = 0;
    let bestStreakHabit = "";

    for (const habit of habits) {
      const completions = allCompletions.filter(c => c.habitId === habit.id);
      
      // Calculate current streak - count consecutive days from most recent completion backwards
      let streak = 0;
      if (completions.length > 0) {
        const dates = completions
          .map((d) => new Date(d.completion_date).toISOString().slice(0, 10))
          .sort((a, b) => b.localeCompare(a)); // Sort descending (most recent first)
        
        // Start from the most recent completion date
        let currentDate = new Date(dates[0]);
        currentDate.setUTCHours(0, 0, 0, 0);
        
        // Count consecutive days backwards
        for (let i = 0; i < dates.length; i++) {
          const expectedDate = new Date(currentDate);
          expectedDate.setUTCDate(currentDate.getUTCDate() - i);
          const expectedDateStr = expectedDate.toISOString().slice(0, 10);
          
          if (dates[i] === expectedDateStr) {
            streak++;
          } else {
            break; // Streak broken
          }
        }
      }
      streaks.push(streak);
      if (streak > bestStreak) {
        bestStreak = streak;
        bestStreakHabit = habit.name;
      }
    }

    const averageStreak = streaks.length > 0 ? (streaks.reduce((a, b) => a + b, 0) / streaks.length) : 0;

    // Calculate previous month's average streak for improvement
    let prevMonthStreaks = [];
    for (const habit of habits) {
      const completions = allCompletions.filter(c => {
        const date = new Date(c.completion_date);
        return c.habitId === habit.id && date >= startOfLastMonth && date < startOfThisMonth;
      });
      
      // Calculate streak for last month
      let streak = 0;
      if (completions.length > 0) {
        const dates = completions
          .map((d) => new Date(d.completion_date).toISOString().slice(0, 10))
          .sort((a, b) => b.localeCompare(a)); // Sort descending (most recent first)
        
        // Start from the most recent completion date
        let currentDate = new Date(dates[0]);
        currentDate.setUTCHours(0, 0, 0, 0);
        
        // Count consecutive days backwards
        for (let i = 0; i < dates.length; i++) {
          const expectedDate = new Date(currentDate);
          expectedDate.setUTCDate(currentDate.getUTCDate() - i);
          const expectedDateStr = expectedDate.toISOString().slice(0, 10);
          
          if (dates[i] === expectedDateStr) {
            streak++;
          } else {
            break; // Streak broken
          }
        }
      }
      prevMonthStreaks.push(streak);
    }
    const prevAverageStreak = prevMonthStreaks.length > 0 ? (prevMonthStreaks.reduce((a, b) => a + b, 0) / prevMonthStreaks.length) : 0;
    const averageStreakImprovement = prevAverageStreak > 0 ? +(averageStreak - prevAverageStreak).toFixed(2) : averageStreak;

    // 3. Success Rate (this week vs last week)
    const weekAgo = new Date(now);
    weekAgo.setUTCHours(0, 0, 0, 0);
    weekAgo.setUTCDate(now.getUTCDate() - 6);
    const completionsThisWeek = allCompletions.filter(c => {
      const d = new Date(c.completion_date);
      return d >= weekAgo && d <= now;
    });
    const possibleCompletions = habits.length * 7;
    const successRate = possibleCompletions > 0 ? Math.round((completionsThisWeek.length / possibleCompletions) * 100) : 0;

    // Last week
    const lastWeekStart = new Date(weekAgo);
    lastWeekStart.setUTCDate(weekAgo.getUTCDate() - 7);
    const lastWeekEnd = new Date(weekAgo);
    lastWeekEnd.setUTCDate(weekAgo.getUTCDate() - 1);
    const completionsLastWeek = allCompletions.filter(c => {
      const d = new Date(c.completion_date);
      return d >= lastWeekStart && d <= lastWeekEnd;
    });
    const possibleCompletionsLastWeek = habits.length * 7;
    const successRateLastWeek = possibleCompletionsLastWeek > 0 ? Math.round((completionsLastWeek.length / possibleCompletionsLastWeek) * 100) : 0;
    const successRateChange = successRateLastWeek > 0 ? Math.round(successRate - successRateLastWeek) : successRate;

    // --- DETAILS CALCULATIONS ---

    // 1. Weekly Completions
    const monday = getMonday(now);
    let weeklyCompletions = Array(7).fill(0);
    for (const c of allCompletions) {
      const date = new Date(c.completion_date);
      date.setUTCHours(0, 0, 0, 0);
      if (date >= monday && date <= now) {
        const dayIdx = (date.getDay() + 6) % 7; // Mon=0, Sun=6
        weeklyCompletions[dayIdx]++;
      }
    }

    // 2. Monthly Success Rate (last 6 months)
    const months = [];
    const monthlySuccessRate = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleString("default", { month: "short" }),
        days: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
      });
    }
    for (const m of months) {
      const start = new Date(m.year, m.month, 1);
      const end = new Date(m.year, m.month, m.days, 23, 59, 59, 999);
      const completions = allCompletions.filter(c => {
        const d = new Date(c.completion_date);
        return d >= start && d <= end;
      });
      const possible = habits.length * m.days;
      monthlySuccessRate.push({
        month: m.label,
        rate: possible > 0 ? Math.round((completions.length / possible) * 100) : 0,
      });
    }

    // 3. Habit Performance
    const habitPerformance = habits.map((habit) => {
      const completions = allCompletions.filter(c => c.habitId === habit.id);
      
      // Current streak (already calculated above)
      const streak = streaks[habits.findIndex(h => h.id === habit.id)];
      
      // Completion rate (last 30 days)
      const last30 = new Date(now);
      last30.setUTCDate(now.getUTCDate() - 29);
      const completions30 = completions.filter(c => {
        const d = new Date(c.completion_date);
        return d >= last30 && d <= now;
      });
      const completionRate = Math.round((completions30.length / 30) * 100);
      
      // Trend: compare last 30 days to previous 30 days
      const prev30Start = new Date(last30);
      prev30Start.setUTCDate(last30.getUTCDate() - 30);
      const completionsPrev30 = completions.filter(c => {
        const d = new Date(c.completion_date);
        return d >= prev30Start && d < last30;
      });
      const prevRate = Math.round((completionsPrev30.length / 30) * 100);
      const trend = prevRate > 0 ? completionRate - prevRate : completionRate;
      
      return {
        emoji: habit.emoji,
        name: habit.name,
        streak,
        completionRate,
        trend,
      };
    });

    return new Response(JSON.stringify({
      summary: {
        totalCompletions,
        totalCompletionsChange,
        averageStreak: +averageStreak.toFixed(2),
        averageStreakImprovement,
        bestStreak,
        bestStreakHabit,
        successRate,
        successRateChange,
      },
      details: {
        weeklyCompletions,
        monthlySuccessRate,
        habitPerformance,
      }
    }), { status: 200 });

  } catch (error) {
    console.error('Analytics API error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 