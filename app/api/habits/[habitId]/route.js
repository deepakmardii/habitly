import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
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
  const habitId = params.habitId;
  if (!habitId) {
    return new Response(JSON.stringify({ error: "Missing habitId" }), { status: 400 });
  }
  // Ensure habit belongs to user
  const habit = await prisma.habit.findUnique({ where: { id: habitId, userId: userId } });
  if (!habit) {
    return new Response(JSON.stringify({ error: "Habit not found" }), { status: 404 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function DELETE(req, { params }) {
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
  const habitId = params.habitId;
  if (!habitId) {
    return new Response(JSON.stringify({ error: "Missing habitId" }), { status: 400 });
  }
  // Ensure habit belongs to user
  const habit = await prisma.habit.findUnique({ where: { id: habitId, userId: userId } });
  if (!habit) {
    return new Response(JSON.stringify({ error: "Habit not found" }), { status: 404 });
  }
  // Delete completions and habit (onDelete: Cascade should handle completions)
  await prisma.habit.delete({ where: { id: habitId } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 