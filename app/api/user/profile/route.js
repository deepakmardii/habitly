import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  return new Response(
    JSON.stringify({
      name: user.name || "",
      email: user.email,
      joined: user.created_at ? new Date(user.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }) : "-"
    }),
    { status: 200 }
  );
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  const { name } = await req.json();
  await prisma.user.update({ where: { email: session.user.email }, data: { name } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 