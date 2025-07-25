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
  // Calculate longest streak (simplified: max streak field on habits)
  const streak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
  return new Response(JSON.stringify({ total, completed, streak }), { status: 200 });
} 