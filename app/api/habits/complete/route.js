// app/api/habits/complete/route.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

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
  const { habitId } = await req.json();
  if (!habitId) {
    return NextResponse.json({ error: "Missing habitId" }, { status: 400 });
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Ensure habit exists and belongs to user
  const habit = await prisma.habit.findUnique({ where: { id: habitId, userId: userId } });
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  // Create completion (unique per user/habit/day)
  try {
    await prisma.habitCompletion.create({
      data: {
        habitId,
        userId: userId,
        completion_date: today,
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    // Unique constraint violation: already completed today
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Already completed today" }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
