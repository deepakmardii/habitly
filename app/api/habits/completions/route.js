import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

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
  const { searchParams } = new URL(req.url);
  const habitId = searchParams.get("habitId");
  if (!habitId) {
    return new Response(JSON.stringify({ error: "habitId required" }), { status: 400 });
  }
  // Ensure habit exists and belongs to user
  const habit = await prisma.habit.findUnique({ where: { id: habitId, userId: userId } });
  if (!habit) {
    return new Response(JSON.stringify({ error: "Habit not found" }), { status: 404 });
  }
  // Fetch all completion dates for this habit/user
  const completions = await prisma.habitCompletion.findMany({
    where: { habitId, userId: userId },
    select: { completion_date: true },
    orderBy: { completion_date: "asc" },
  });
  return new Response(
    JSON.stringify(completions.map((c) => c.completion_date)),
    { status: 200 }
  );
}

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
  // ...existing logic, use userId for mutations...
} 