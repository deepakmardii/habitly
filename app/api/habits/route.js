import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

function getUserIdFromRequest(req) {
  // Simulate secure cookie parsing for userId (replace with real auth in prod)
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/userId=([^;]+)/);
  return match ? match[1] : null;
}

function validateHabitInput(body) {
  if (
    !body.name ||
    typeof body.name !== "string" ||
    body.name.length < 2 ||
    body.name.length > 50
  )
    return "Name is required (2-50 chars)";
  if (body.description && typeof body.description !== "string")
    return "Description must be a string";
  if (!body.emoji || typeof body.emoji !== "string") return "Emoji is required";
  if (!body.tag || typeof body.tag !== "string") return "Tag is required";
  if (!body.color || typeof body.color !== "string") return "Color is required";
  if (
    !body.streak_goal ||
    typeof body.streak_goal !== "number" ||
    body.streak_goal < 1 ||
    body.streak_goal > 365
  )
    return "Streak goal must be 1-365";
  if (body.reminder_time && typeof body.reminder_time !== "string")
    return "Reminder time must be a string (HH:mm)";
  return null;
}

// Daily completion endpoint: POST /api/habits/complete
export async function POST(req) {
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
  const url = req.nextUrl?.pathname || "";
  if (url.endsWith("/complete")) {
    try {
      const body = await req.json();
      const { habitId } = body;
      if (!habitId) {
        return new Response(JSON.stringify({ error: "habitId required" }), {
          status: 400,
        });
      }
      // Ensure habit exists and belongs to user
      const habit = await prisma.habit.findUnique({
        where: { id: habitId, userId },
      });
      if (!habit) {
        return new Response(JSON.stringify({ error: "Habit not found" }), {
          status: 404,
        });
      }
      // Mark completion for today (unique per user/habit/day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      try {
        const completion = await prisma.habitCompletion.create({
          data: {
            habitId,
            userId,
            completion_date: today,
          },
        });
        return new Response(JSON.stringify({ success: true, completion }), {
          status: 201,
        });
      } catch (e) {
        // Unique constraint violation: already completed today
        if (e.code === "P2002") {
          return new Response(
            JSON.stringify({ error: "Already completed today" }),
            { status: 409 }
          );
        }
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
        });
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
      });
    }
  }

  // Default: create habit
  try {
    const body = await req.json();
    const validationError = validateHabitInput(body);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
      });
    }
    const { name, description, emoji, tag, color, streak_goal, reminder_time } = body;
    // Check if user exists before creating habit
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
      });
    }
    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        description,
        emoji,
        tag,
        color,
        streak_goal,
        reminder_time: reminder_time
          ? new Date(`1970-01-01T${reminder_time}:00Z`)
          : null,
      },
    });
    return new Response(JSON.stringify(habit), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

// Completion dates endpoint: GET /api/habits/completions?habitId=...
export async function GET(req) {
  console.log("Cookies:", req.cookies);
  const session = await getServerSession(authOptions);
  console.log("Session:", session);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userEmail = session.user.email;
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }
  const userId = user.id;
  const url = req.nextUrl?.pathname || "";
  if (url.endsWith("/completions")) {
    try {
      const { searchParams } = new URL(req.url);
      const habitId = searchParams.get("habitId");
      if (!habitId) {
        return new Response(JSON.stringify({ error: "habitId required" }), {
          status: 400,
        });
      }
      // Ensure habit exists and belongs to user
      const habit = await prisma.habit.findUnique({
        where: { id: habitId, userId },
      });
      if (!habit) {
        return new Response(JSON.stringify({ error: "Habit not found" }), {
          status: 404,
        });
      }
      // Fetch all completion dates for this habit/user
      const completions = await prisma.habitCompletion.findMany({
        where: { habitId, userId },
        select: { completion_date: true },
        orderBy: { completion_date: "asc" },
      });
      return new Response(
        JSON.stringify(completions.map((c) => c.completion_date)),
        { status: 200 }
      );
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
      });
    }
  }

  // Add summary endpoint for dashboard
  if (url.endsWith("/summary")) {
    try {
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
        // Streak calculation (UTC)
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
        if (streak > 1) currentStreaks++;
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
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // Default: fetch habits
  try {
    const habits = await prisma.habit.findMany({
      where: { userId },
    });

    // For each habit, fetch completions and calculate stats
    const habitCards = await Promise.all(
      habits.map(async (habit) => {
        // Fetch all completion dates for this habit/user
        const completions = await prisma.habitCompletion.findMany({
          where: { habitId: habit.id, userId },
          select: { completion_date: true },
          orderBy: { completion_date: "asc" },
        });
        const completionDates = completions.map((c) => c.completion_date);

        // Calculate streak
        let streak = 0;
        if (completionDates.length > 0) {
          // Sort dates descending
          const dates = completionDates
            .map((d) => new Date(d).toISOString().slice(0, 10))
            .sort((a, b) => b.localeCompare(a));
          let day = new Date();
          day.setUTCHours(0, 0, 0, 0);
          for (let i = 0; i < dates.length; i++) {
            if (dates[i] === day.toISOString().slice(0, 10)) {
              streak++;
              day.setDate(day.getDate() - 1);
            } else {
              break;
            }
          }
        }

        // Progress to goal (completions / streak_goal)
        const progressToGoal = `${completionDates.length} / ${habit.streak_goal} days`;

        // Completion percent (capped at 100%)
        const completionPercent = Math.min(100, Math.round((completionDates.length / habit.streak_goal) * 100));

        return {
          title: habit.name,
          emoji: habit.emoji,
          tag: habit.tag,
          description: habit.description,
          streak,
          completionPercent,
          progressToGoal,
          reminderTime: habit.reminder_time
            ? habit.reminder_time.toISOString().slice(11, 16)
            : "",
          color: habit.color,
          id: habit.id,
        };
      })
    );

    return new Response(JSON.stringify(habitCards), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
