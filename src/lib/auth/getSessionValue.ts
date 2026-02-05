"use server"

import { cookies } from "next/headers";

export async function getSessionValue(): Promise<string | null> {
  return (await cookies()).get("session")?.value ?? null;
}