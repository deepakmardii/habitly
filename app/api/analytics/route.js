import { PrismaClient } from "@prisma/client";
import { handleGet, requireSession } from "@/app/lib/apiHelpers";
import { calculateAnalytics, fetchUserHabitsData } from "@/app/lib/analytics/analyticsSummary";

const prisma = new PrismaClient();

async function getUserData(req) {
  const session = await requireSession(req);
  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email } 
  });
  
  if (!user) throw new Error("User not found");
  return user;
}

async function getAnalytics(req) {
  const user = await getUserData(req);
  const [habits, allCompletions] = await fetchUserHabitsData(prisma, user.id);
  
  return calculateAnalytics(habits, allCompletions);
}

export async function GET(req) {
  return handleGet(req, getAnalytics);
}