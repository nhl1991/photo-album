import type { FirebaseError } from "firebase/app";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
  "auth/weak-password": "비밀번호는 6자 이상이어야 합니다.",
  "auth/invalid-email": "이메일 형식이 올바르지 않습니다.",
  "auth/user-disabled": "비활성화된 계정입니다.",
  "auth/too-many-requests": "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  "auth/network-request-failed": "네트워크 오류가 발생했습니다.",
};

export function getAuthErrorMessage(error: FirebaseError) {
  return AUTH_ERROR_MESSAGES[error.code] ?? "요청을 처리하지 못했습니다. 다시 시도해주세요.";
}
