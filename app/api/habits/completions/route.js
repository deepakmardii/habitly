import { PrismaClient } from "@prisma/client";
import { getServerSession } from "@/app/lib/session";

const prisma = new PrismaClient();

export async function GET(req) {
  const user = await getServerSession(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const habitId = searchParams.get("habitId");
  if (!habitId) {
    return new Response(JSON.stringify({ error: "habitId required" }), { status: 400 });
  }
  // Ensure habit exists and belongs to user
  const habit = await prisma.habit.findUnique({ where: { id: habitId, userId: user.id } });
  if (!habit) {
    return new Response(JSON.stringify({ error: "Habit not found" }), { status: 404 });
  }
  // Fetch all completion dates for this habit/user
  const completions = await prisma.habitCompletion.findMany({
    where: { habitId, userId: user.id },
    select: { completion_date: true },
    orderBy: { completion_date: "asc" },
  });
  return new Response(
    JSON.stringify(completions.map((c) => c.completion_date)),
    { status: 200 }
  );
} 