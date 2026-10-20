import { NextResponse } from "next/server";

type ApiErrorStatus = 400 | 401 | 403 | 404 | 429 | 500 | 502;

export function handleApiError(
  status: ApiErrorStatus,
  code: string,
  cause?: unknown,
) {
  if (status >= 500) console.error(`[api - error] ${code}`, cause);
  else console.warn(`[api - warning] ${code}`);

  return NextResponse.json({ error: code }, { status });
}
