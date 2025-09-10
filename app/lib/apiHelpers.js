// app/lib/apiHelpers.js

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function requireSession(req) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function handleGet(req, getFunc) {
  try {
    const data = await getFunc(req);
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function handlePost(req, postFunc) {
  try {
    const body = await req.json();
    const data = await postFunc(body, req);
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function handlePut(req, putFunc) {
  try {
    const body = await req.json();
    const data = await putFunc(body, req);
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function handleDelete(req, deleteFunc) {
  try {
    const data = await deleteFunc(req);
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}