import "server-only";
// 유저 정보가 있는지만 검증.
import { getSessionValue } from "@/lib/server/auth/getSessionValue";
import { verifySessionCookie } from "@/lib/server/auth/verifySession";
export async function getUserOptional() {
  try {
    const tokenId = await getSessionValue();
    if (!tokenId) return null;
    const decode = await verifySessionCookie(tokenId);
    return decode ? decode.uid : null;
  } catch {
    return null;
  }
}
