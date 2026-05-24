export type AuthFlowPurpose = "email_verification" | "password_reset";

const FLOW_KEY = "resumeai-auth-flow";
const EMAIL_KEY = "resumeai-auth-email";
const RESET_TOKEN_KEY = "resumeai-reset-token";

export function setAuthFlow(purpose: AuthFlowPurpose, email?: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(FLOW_KEY, purpose);
  if (email) {
    sessionStorage.setItem(EMAIL_KEY, email);
  }
}

export function getAuthFlow(): AuthFlowPurpose {
  if (typeof window === "undefined") return "password_reset";
  return (
    (sessionStorage.getItem(FLOW_KEY) as AuthFlowPurpose | null) ??
    "password_reset"
  );
}

export function getAuthFlowEmail(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(EMAIL_KEY) ?? "";
}

export function setResetToken(token: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RESET_TOKEN_KEY, token);
}

export function getResetToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(RESET_TOKEN_KEY) ?? "";
}

export function clearAuthFlow() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(FLOW_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
  sessionStorage.removeItem(RESET_TOKEN_KEY);
}
