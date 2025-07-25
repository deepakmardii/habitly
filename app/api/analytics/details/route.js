import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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

    // Get all habits in one query
    const habits = await prisma.habit.findMany({ where: { userId } });
    const habitIds = habits.map(h => h.id);

    // Get all completions for this user in one query
    const allCompletions = await prisma.habitCompletion.findMany({
      where: { userId },
      select: { completion_date: true, habitId: true },
      orderBy: { completion_date: "asc" },
    });

    // --- Weekly Completions ---
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
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

    // --- Monthly Success Rate (last 6 months) ---
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

    // --- Habit Performance ---
    // Use Promise.all for parallel calculations
    const habitPerformance = await Promise.all(habits.map(async (habit) => {
      // Get completions for this habit (from allCompletions, already in memory)
      const completions = allCompletions.filter(c => c.habitId === habit.id);
      // Current streak (consecutive days up to today)
      let streak = 0;
      if (completions.length > 0) {
        const dates = completions
          .map((d) => new Date(d.completion_date).toISOString().slice(0, 10))
          .sort((a, b) => b.localeCompare(a));
        let day = new Date();
        day.setUTCHours(0, 0, 0, 0);
        for (let i = 0; i < dates.length; i++) {
          if (dates[i] === day.toISOString().slice(0, 10)) {
            streak++;
            day.setUTCDate(day.getUTCDate() - 1);
          } else {
            break;
          }
        }
      }
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
    }));

    return new Response(JSON.stringify({
      weeklyCompletions,
      monthlySuccessRate,
      habitPerformance,
    }), { status: 200 });
  } catch (error) {
    console.error("[Analytics Details Error]", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
} 