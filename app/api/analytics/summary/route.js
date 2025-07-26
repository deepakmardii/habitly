import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req) {
  // Session management (reuse pattern)
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

  // 1. Total completions (+% from last month)
  // Get all completions for the user
  const allCompletions = await prisma.habitCompletion.findMany({
    where: { userId },
    select: { completion_date: true },
  });
  const totalCompletions = allCompletions.length;

  // Calculate this month and last month completions
  const now = new Date();
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
  // Calculate percent change
  let totalCompletionsChange = 0;
  if (lastMonthCompletions > 0) {
    totalCompletionsChange = Math.round(((thisMonthCompletions - lastMonthCompletions) / lastMonthCompletions) * 100);
  } else if (thisMonthCompletions > 0) {
    totalCompletionsChange = 100;
  }

  // 2. Average streak (+improvement)
  // 3. Best streak (with habit name)
  // 4. Success rate (+% this week)

  // Get all habits for the user
  const habits = await prisma.habit.findMany({ where: { userId } });

  let streaks = [];
  let bestStreak = 0;
  let bestStreakHabit = "";
  let nowDate = new Date();
  nowDate.setUTCHours(0, 0, 0, 0);

  for (const habit of habits) {
    const completions = await prisma.habitCompletion.findMany({
      where: { habitId: habit.id, userId },
      select: { completion_date: true },
      orderBy: { completion_date: "asc" },
    });
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
  // Average streak
  const averageStreak = streaks.length > 0 ? (streaks.reduce((a, b) => a + b, 0) / streaks.length) : 0;

  // Calculate previous month's average streak for improvement
  let prevMonthStreaks = [];
  for (const habit of habits) {
    const completions = await prisma.habitCompletion.findMany({
      where: {
        habitId: habit.id,
        userId,
        completion_date: {
          gte: startOfLastMonth,
          lt: startOfThisMonth,
        },
      },
      select: { completion_date: true },
      orderBy: { completion_date: "asc" },
    });
    // Calculate streak for last month - count consecutive days from most recent completion backwards
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

  // Success Rate (this week vs last week)
  // This week
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

  return new Response(JSON.stringify({
    totalCompletions,
    totalCompletionsChange,
    averageStreak: +averageStreak.toFixed(2),
    averageStreakImprovement,
    bestStreak,
    bestStreakHabit,
    successRate,
    successRateChange,
  }), { status: 200 });
} 