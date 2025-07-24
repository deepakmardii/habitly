import { PrismaClient } from "@prisma/client";
import { getServerSession } from "@/app/lib/session";

const prisma = new PrismaClient();

function formatWhen(date) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours} hours ago`;
  return d.toLocaleDateString();
}

export async function GET(req) {
  const user = await getServerSession(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const userId = user.id;
  const habits = await prisma.habit.findMany({ where: { userId } });
  let activity = [];
  for (const habit of habits) {
    // Get completions for the last 2 days
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);
    const todayStr = today.toISOString().slice(0, 10);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    // Check if completed today
    const completedToday = await prisma.habitCompletion.findFirst({
      where: {
        habitId: habit.id,
        userId,
        completion_date: {
          gte: new Date(todayStr + "T00:00:00.000Z"),
          lt: new Date(todayStr + "T23:59:59.999Z"),
        },
      },
    });
    // Check if completed yesterday
    const completedYesterday = await prisma.habitCompletion.findFirst({
      where: {
        habitId: habit.id,
        userId,
        completion_date: {
          gte: new Date(yesterdayStr + "T00:00:00.000Z"),
          lt: new Date(yesterdayStr + "T23:59:59.999Z"),
        },
      },
    });
    let status, when;
    if (completedToday) {
      status = "completed";
      when = "Today";
    } else if (completedYesterday) {
      status = "pending";
      when = "Today";
    } else {
      // Find last completion
      const lastCompletion = await prisma.habitCompletion.findFirst({
        where: { habitId: habit.id, userId },
        orderBy: { completion_date: "desc" },
      });
      if (lastCompletion) {
        status = "missed";
        when = formatWhen(lastCompletion.completion_date);
      } else {
        status = "missed";
        when = "Never";
      }
    }
    activity.push({
      habitName: habit.name,
      habitId: habit.id,
      status,
      when,
    });
  }
  // Sort by status (completed > pending > missed), then by when (Today > Yesterday > ...)
  const statusOrder = { completed: 0, pending: 1, missed: 2 };
  activity.sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    // Today > Yesterday > ...
    if (a.when === b.when) return 0;
    if (a.when === "Today") return -1;
    if (b.when === "Today") return 1;
    if (a.when === "Yesterday") return -1;
    if (b.when === "Yesterday") return 1;
    return 0;
  });
  return new Response(JSON.stringify(activity), { status: 200 });
} 