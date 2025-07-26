import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  const userId = user.id;
  
  const habits = await prisma.habit.findMany({ where: { userId } });
  const total = habits.length;
  const completions = await prisma.habitCompletion.findMany({ where: { userId } });
  const completed = completions.length;
  
  // Calculate longest streak across all habits
  let longestStreak = 0;
  for (const habit of habits) {
    const habitCompletions = completions.filter(c => c.habitId === habit.id);
    if (habitCompletions.length > 0) {
      const dates = habitCompletions
        .map(d => new Date(d.completion_date).toISOString().slice(0, 10))
        .sort((a, b) => b.localeCompare(a)); // Sort descending (most recent first)
      
      // Start from the most recent completion date
      let currentDate = new Date(dates[0]);
      currentDate.setUTCHours(0, 0, 0, 0);
      
      // Count consecutive days backwards
      let streak = 0;
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
      
      if (streak > longestStreak) {
        longestStreak = streak;
      }
    }
  }
  
  return new Response(JSON.stringify({ total, completed, streak: longestStreak }), { status: 200 });
} 