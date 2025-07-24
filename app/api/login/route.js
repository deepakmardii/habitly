// app/api/login/route.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }
    return new Response(JSON.stringify({ id: user.id, email: user.email }), {
      status: 200,
      headers: {
        "Set-Cookie": `userId=${user.id}; Path=/; HttpOnly; SameSite=Lax`
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Login failed" }), { status: 500 });
  }
}