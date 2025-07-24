// app/api/signup/route.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });
    return new Response(JSON.stringify({ id: user.id, email: user.email }), {
      status: 201,
      headers: {
        "Set-Cookie": `userId=${user.id}; Path=/; HttpOnly; SameSite=Lax`
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Signup failed" }), { status: 500 });
  }
}