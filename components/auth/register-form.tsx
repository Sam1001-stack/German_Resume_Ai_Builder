"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { createRegisterSchema, type RegisterFormData } from "@/features/auth/validation";
import { authService } from "@/services/auth-service";
import { useAuth } from "@/hooks/use-auth";
import { setAuthCookie } from "@/lib/auth-cookie";
import { setAuthFlow } from "@/lib/auth-flow";

export function RegisterForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const router = useRouter();
  const { login, setLoading } = useAuth();
  const schema = createRegisterSchema((key) => tv(key));

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "user" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const { user, token } = await authService.register(data);
      login(user, token);
      setAuthCookie(token, true);
      setAuthFlow("email_verification", data.email);
      toast.success(t("registerSuccess"));
      router.push("/verify-otp");
    } catch (error) {
      const message = error instanceof Error ? error.message : tv("required");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("firstName")}</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t("lastName")}</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium leading-none">{t("registerAs")}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
              selectedRole === "user"
                ? "border-violet-600 bg-violet-50 dark:border-violet-500 dark:bg-violet-950/40"
                : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
            }`}
          >
            <input
              type="radio"
              value="user"
              className="h-4 w-4 accent-violet-600"
              {...register("role")}
            />
            <span>
              <span className="block text-sm font-medium">{t("roleCandidate")}</span>
              <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                {t("roleCandidateDesc")}
              </span>
            </span>
          </label>
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
              selectedRole === "recruiter"
                ? "border-violet-600 bg-violet-50 dark:border-violet-500 dark:bg-violet-950/40"
                : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
            }`}
          >
            <input
              type="radio"
              value="recruiter"
              className="h-4 w-4 accent-violet-600"
              {...register("role")}
            />
            <span>
              <span className="block text-sm font-medium">{t("roleRecruiter")}</span>
              <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                {t("roleRecruiterDesc")}
              </span>
            </span>
          </label>
        </div>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </fieldset>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <PasswordInput id="password" {...register("password")} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <PasswordInput id="confirmPassword" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t("register")}
      </Button>
      <Separator />
      <SocialButtons />
      <p className="text-center text-sm text-zinc-600">
        {t("hasAccount")}{" "}
        <Link href="/sign-in" className="font-medium text-violet-600 hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </form>
  );
}
