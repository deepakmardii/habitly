import { PrismaClient } from "@prisma/client";
import { getServerSession } from "@/app/lib/session";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const user = await getServerSession(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const habitId = params.habitId;
  if (!habitId) {
    return new Response(JSON.stringify({ error: "Missing habitId" }), { status: 400 });
  }
  // Ensure habit belongs to user
  const habit = await prisma.habit.findUnique({ where: { id: habitId, userId: user.id } });
  if (!habit) {
    return new Response(JSON.stringify({ error: "Habit not found" }), { status: 404 });
  }
  // Delete completions and habit (onDelete: Cascade should handle completions)
  await prisma.habit.delete({ where: { id: habitId } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 