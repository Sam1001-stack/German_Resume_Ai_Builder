import { z } from "zod";

export const createSignInSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t("required")).email(t("email")),
    password: z.string().min(1, t("required")).min(8, t("passwordMin")),
    rememberMe: z.boolean().optional(),
  });

export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z.string().min(1, t("required")).min(2, t("nameMin")),
      lastName: z.string().min(1, t("required")).min(2, t("nameMin")),
      email: z.string().min(1, t("required")).email(t("email")),
      password: z.string().min(1, t("required")).min(8, t("passwordMin")),
      confirmPassword: z.string().min(1, t("required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMatch"),
      path: ["confirmPassword"],
    });

export const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t("required")).email(t("email")),
  });

export const createOtpSchema = (t: (key: string) => string) =>
  z.object({
    otp: z
      .string()
      .min(1, t("required"))
      .length(6, t("otpLength"))
      .regex(/^\d+$/, t("otpLength")),
  });

export const createResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z.string().min(1, t("required")).min(8, t("passwordMin")),
      confirmPassword: z.string().min(1, t("required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMatch"),
      path: ["confirmPassword"],
    });

export type SignInFormData = z.infer<ReturnType<typeof createSignInSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;
export type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
export type OtpFormData = z.infer<ReturnType<typeof createOtpSchema>>;
export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;
