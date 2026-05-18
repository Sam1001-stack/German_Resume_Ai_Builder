import type { RegisterPayload, SignInPayload, User } from "@/types/auth";

/** Frontend auth service — mock until backend auth endpoints exist. */
export const authService = {
  async signIn(payload: SignInPayload): Promise<{ user: User; token: string }> {
    await delay(800);
    return {
      user: mockUser(payload.email),
      token: `mock-token-${Date.now()}`,
    };
  },

  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    await delay(1000);
    return {
      user: {
        ...mockUser(payload.email),
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
      token: `mock-token-${Date.now()}`,
    };
  },

  async forgotPassword(_email: string): Promise<void> {
    await delay(600);
  },

  async verifyOtp(_otp: string): Promise<void> {
    await delay(600);
  },

  async resetPassword(_password: string): Promise<void> {
    await delay(600);
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockUser(email: string): User {
  const name = email.split("@")[0] ?? "User";
  return {
    id: crypto.randomUUID(),
    email,
    firstName: name.charAt(0).toUpperCase() + name.slice(1),
    lastName: "Demo",
    emailVerified: true,
    createdAt: new Date().toISOString(),
  };
}
