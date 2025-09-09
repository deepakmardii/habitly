// app/lib/apiHelpers.js

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function requireSession(req) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function handleGet(req, getFn) {
  try {
    const data = await getFn(req);
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function handlePost(req, postFn) {
  try {
    const body = await req.json();
    const data = await postFn(body, req);
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function handlePut(req, putFn) {
  try {
    const body = await req.json();
    const data = await putFn(body, req);
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function handleDelete(req, deleteFn) {
  try {
    const data = await deleteFn(req);
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}