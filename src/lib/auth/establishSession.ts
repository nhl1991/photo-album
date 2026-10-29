import { User } from "firebase/auth";
type EstablishSessionResult = { ok: true } | { ok: false; code: string | null };

export async function establishSession(
  user: User,
): Promise<EstablishSessionResult> {
  try {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!response.ok) {
      const { error } = await response.json().catch(() => ({ error: null }));
      return { ok: false, code: error ?? null };
    }
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, code: null };
  }
}
