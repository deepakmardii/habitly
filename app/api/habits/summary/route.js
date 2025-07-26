import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req) {
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
  const habits = await prisma.habit.findMany({ where: { userId } });
  // For each habit, fetch completions and calculate streak
  let currentStreaks = 0;
  let allCompletions = [];
  let firstHabitDate = null;
  for (const habit of habits) {
    const completions = await prisma.habitCompletion.findMany({
      where: { habitId: habit.id, userId },
      select: { completion_date: true },
      orderBy: { completion_date: "asc" },
    });
    allCompletions.push(...completions.map(c => c.completion_date));
    // Streak calculation - count consecutive days from most recent completion backwards
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
    if (streak > 0) currentStreaks++;
    if (!firstHabitDate || habit.created_at < firstHabitDate) {
      firstHabitDate = habit.created_at;
    }
  }
  // Completion Rate (this week's average)
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  const weekAgo = new Date(now);
  weekAgo.setUTCDate(now.getUTCDate() - 6);
  const completionsThisWeek = allCompletions.filter(date => {
    const d = new Date(date);
    return d >= weekAgo && d <= now;
  });
  // Number of possible completions this week
  const possibleCompletions = habits.length * 7;
  const completionRate = possibleCompletions > 0 ? Math.round((completionsThisWeek.length / possibleCompletions) * 100) : 0;
  // Days Tracked
  let daysTracked = 0;
  if (firstHabitDate) {
    const first = new Date(firstHabitDate);
    first.setUTCHours(0, 0, 0, 0);
    daysTracked = Math.max(1, Math.floor((now - first) / (1000 * 60 * 60 * 24)) + 1);
  }
  return new Response(JSON.stringify({
    activeHabits: habits.length,
    currentStreaks,
    completionRate,
    daysTracked,
  }), { status: 200 });
} 