import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Extracts the user session from the request.
 * Returns the user object if authenticated, otherwise null.
 * @param {Request} req - The Next.js API route Request object
 */
export async function getServerSession(req) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/userId=([^;]+)/);
  const userId = match ? match[1] : null;
  if (!userId) return null;

  // Optionally, fetch the user from the database for validation
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user || null;
} 