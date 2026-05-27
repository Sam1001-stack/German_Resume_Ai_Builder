import type {
  ChangePasswordPayload,
  RegisterPayload,
  SignInPayload,
  UpdateProfilePayload,
  User,
  UserRole,
} from "@/types/auth";
import apiClient from "./api-client";

interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  bio?: string;
  phone?: string;
  location?: string;
  emailVerified: boolean;
  role: UserRole;
  createdAt: string;
}

function mapUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    avatar: apiUser.image,
    bio: apiUser.bio,
    phone: apiUser.phone,
    location: apiUser.location,
    emailVerified: apiUser.emailVerified,
    role: apiUser.role ?? "user",
    createdAt: apiUser.createdAt,
  };
}

export const authService = {
  async signIn(payload: SignInPayload): Promise<{ user: User; token: string }> {
    const { data } = await apiClient.post<{ user: ApiUser; token: string }>(
      "/auth/login",
      { email: payload.email, password: payload.password }
    );
    return { user: mapUser(data.user), token: data.token };
  },

  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    const { data } = await apiClient.post<{ user: ApiUser; token: string }>(
      "/auth/register",
      {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        role: payload.role,
      }
    );
    return { user: mapUser(data.user), token: data.token };
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async verifyOtp(
    otp: string,
    purpose: "email_verification" | "password_reset",
    email?: string
  ): Promise<{ user?: User; resetToken?: string }> {
    const { data } = await apiClient.post<{
      user?: ApiUser;
      resetToken?: string;
      message?: string;
    }>("/auth/verify-otp", {
      otp,
      purpose,
      ...(email ? { email } : {}),
    });

    return {
      user: data.user ? mapUser(data.user) : undefined,
      resetToken: data.resetToken,
    };
  },

  async resendOtp(
    purpose: "email_verification" | "password_reset",
    email?: string
  ): Promise<void> {
    await apiClient.post("/auth/resend-otp", {
      purpose,
      ...(email ? { email } : {}),
    });
  },

  async resetPassword(password: string, resetToken: string): Promise<void> {
    await apiClient.post("/auth/reset-password", {
      password,
      confirmPassword: password,
      resetToken,
    });
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<{ user: ApiUser }>("/auth/profile");
    return mapUser(data.user);
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.put<{ user: ApiUser }>("/auth/profile", {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      image: payload.avatar,
      bio: payload.bio,
      phone: payload.phone,
      location: payload.location,
    });
    return mapUser(data.user);
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await apiClient.put("/auth/change-password", payload);
  },
};
