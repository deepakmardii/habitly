import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getUserIdFromRequest(req) {
  // Simulate secure cookie parsing for userId (replace with real auth in prod)
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/userId=([^;]+)/);
  return match ? match[1] : null;
}

function validateHabitInput(body) {
  if (!body.name || typeof body.name !== 'string' || body.name.length < 2 || body.name.length > 50) return 'Name is required (2-50 chars)';
  if (body.description && typeof body.description !== 'string') return 'Description must be a string';
  if (!body.icon || typeof body.icon !== 'string') return 'Icon is required';
  if (!body.color || typeof body.color !== 'string') return 'Color is required';
  if (!body.streak_goal || typeof body.streak_goal !== 'number' || body.streak_goal < 1 || body.streak_goal > 365) return 'Streak goal must be 1-365';
  if (body.reminder_time && typeof body.reminder_time !== 'string') return 'Reminder time must be a string (HH:mm)';
  return null;
}

export async function POST(req) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    const body = await req.json();
    const validationError = validateHabitInput(body);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), { status: 400 });
    }
    const {
      name,
      description,
      icon,
      color,
      streak_goal,
      reminder_time,
    } = body;
    // Check if user exists before creating habit
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 401 });
    }
    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        description,
        icon,
        color,
        streak_goal,
        reminder_time: reminder_time ? new Date(`1970-01-01T${reminder_time}:00Z`) : null,
      },
    });
    return new Response(JSON.stringify(habit), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
} 