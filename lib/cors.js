import { NextResponse } from "next/server";

export function withCors(response) {
  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_FRONTEND_URL || "*"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

// Optional: function to handle preflight (OPTIONS) requests
export function handleOptions() {
  const response = NextResponse.json({ ok: true });
  return withCors(response);
}
