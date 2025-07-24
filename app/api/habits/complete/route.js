// app/api/habits/complete/route.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "@/app/lib/session";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const user = await getServerSession(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { habitId } = await request.json();
    if (!habitId) {
      return NextResponse.json({ error: "Missing habitId" }, { status: 400 });
    }
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Ensure habit exists and belongs to user
    const habit = await prisma.habit.findUnique({ where: { id: habitId, userId: user.id } });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Create completion (unique per user/habit/day)
    try {
      await prisma.habitCompletion.create({
        data: {
          habitId,
          userId: user.id,
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
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
