import { NextResponse } from "next/server";
import { ApiError } from "../error/ApiError";

export function handleApiError(e:unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.code }, { status: e.status });
  }
  console.error(e);
  return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
}
