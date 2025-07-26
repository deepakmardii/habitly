import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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

  try {
    // Fetch all data in parallel with optimized queries
    const [habits, allCompletions] = await Promise.all([
      // Get all habits
      prisma.habit.findMany({
        where: { userId },
        orderBy: { created_at: 'desc' }
      }),
      // Get all completions for this user in one query
      prisma.habitCompletion.findMany({
        where: { userId },
        select: { 
          habitId: true, 
          completion_date: true 
        },
        orderBy: { completion_date: 'desc' }
      })
    ]);

    if (habits.length === 0) {
      return new Response(JSON.stringify({
        habits: [],
        summary: {
          activeHabits: 0,
          currentStreaks: 0,
          completionRate: 0,
          daysTracked: 0
        },
        recentActivity: []
      }), { status: 200 });
    }

    // Group completions by habitId for efficient lookup
    const completionsByHabit = {};
    allCompletions.forEach(completion => {
      if (!completionsByHabit[completion.habitId]) {
        completionsByHabit[completion.habitId] = [];
      }
      completionsByHabit[completion.habitId].push(completion.completion_date);
    });

    // Calculate current date for streak calculations
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const todayStr = now.toISOString().slice(0, 10);
    const yesterday = new Date(now);
    yesterday.setUTCDate(now.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    // Process habits with stats
    let currentStreaks = 0;
    let allCompletionDates = [];
    let firstHabitDate = null;
    const habitCards = [];
    const activity = [];

    for (const habit of habits) {
      const completionDates = completionsByHabit[habit.id] || [];
      allCompletionDates.push(...completionDates);

        // Calculate streak - count consecutive days from most recent completion backwards
      let streak = 0;
      if (completionDates.length > 0) {
        const dates = completionDates
          .map(d => new Date(d).toISOString().slice(0, 10))
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

      if (streak > 1) currentStreaks++;

      // Track earliest habit date
      if (!firstHabitDate || habit.created_at < firstHabitDate) {
        firstHabitDate = habit.created_at;
      }

      // Build habit card data
      const completionPercent = Math.min(100, Math.round((completionDates.length / habit.streak_goal) * 100));
      
      // Check if completed today
      const isCompletedToday = completionDates.some(date => 
        new Date(date).toISOString().slice(0, 10) === todayStr
      );
      
      habitCards.push({
        title: habit.name,
        emoji: habit.emoji,
        tag: habit.tag,
        description: habit.description,
        streak,
        completionPercent,
        progressToGoal: `${completionDates.length} / ${habit.streak_goal} days`,
        reminderTime: habit.reminder_time
          ? habit.reminder_time.toISOString().slice(11, 16)
          : "",
        color: habit.color,
        id: habit.id,
        completions: completionDates.map(date => date.toISOString().slice(0, 10)), // Convert to date strings
        isCompletedToday: isCompletedToday, // Include completion status
      });

      // Build activity data
      const completedToday = completionDates.some(date => 
        new Date(date).toISOString().slice(0, 10) === todayStr
      );
      const completedYesterday = completionDates.some(date => 
        new Date(date).toISOString().slice(0, 10) === yesterdayStr
      );

      let status, when;
      if (completedToday) {
        status = "completed";
        when = "Today";
      } else if (completedYesterday) {
        status = "pending";
        when = "Today";
      } else {
        const lastCompletion = completionDates[0];
        if (lastCompletion) {
          status = "missed";
          when = formatWhen(lastCompletion);
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

    // Calculate summary stats
    const weekAgo = new Date(now);
    weekAgo.setUTCDate(now.getUTCDate() - 6);
    const completionsThisWeek = allCompletionDates.filter(date => {
      const d = new Date(date);
      return d >= weekAgo && d <= now;
    });
    
    const possibleCompletions = habits.length * 7;
    const completionRate = possibleCompletions > 0 ? Math.round((completionsThisWeek.length / possibleCompletions) * 100) : 0;
    
    let daysTracked = 0;
    if (firstHabitDate) {
      const first = new Date(firstHabitDate);
      first.setUTCHours(0, 0, 0, 0);
      daysTracked = Math.max(1, Math.floor((now - first) / (1000 * 60 * 60 * 24)) + 1);
    }

    // Sort activity by priority
    const statusOrder = { completed: 0, pending: 1, missed: 2 };
    activity.sort((a, b) => {
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      if (a.when === b.when) return 0;
      if (a.when === "Today") return -1;
      if (b.when === "Today") return 1;
      if (a.when === "Yesterday") return -1;
      if (b.when === "Yesterday") return 1;
      return 0;
    });

    return new Response(JSON.stringify({
      habits: habitCards,
      summary: {
        activeHabits: habits.length,
        currentStreaks,
        completionRate,
        daysTracked,
      },
      recentActivity: activity.slice(0, 10) // Limit to 10 most recent
    }), { status: 200 });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 