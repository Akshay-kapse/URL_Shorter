import { NextResponse } from "next/server";

export function withCors(response) {
  const headers = new Headers(response.headers);
  headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_FRONTEND_URL || "*"
  );
  headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return new NextResponse(response.body, {
    status: response.status,
    headers,
  });
}

// Preflight
export function handleOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin":
        process.env.NEXT_PUBLIC_FRONTEND_URL || "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}