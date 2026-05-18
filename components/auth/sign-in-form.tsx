"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { createSignInSchema, type SignInFormData } from "@/features/auth/validation";
import { authService } from "@/services/auth-service";
import { useAuth } from "@/hooks/use-auth";
import { setAuthCookie } from "@/lib/auth-cookie";

export function SignInForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const router = useRouter();
  const { login, setLoading } = useAuth();

  const schema = createSignInSchema((key) => tv(key));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: false },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      const { user, token } = await authService.signIn(data);
      login(user, token);
      setAuthCookie(token, data.rememberMe);
      toast.success(t("signInSuccess"));
      router.push("/dashboard");
    } catch {
      toast.error(tv("required"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("password")}</Label>
          <Link href="/forgot-password" className="text-sm text-violet-600 hover:underline">
            {t("forgotLink")}
          </Link>
        </div>
        <PasswordInput id="password" autoComplete="current-password" {...register("password")} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(v) => setValue("rememberMe", v === true)}
        />
        <Label htmlFor="remember" className="cursor-pointer font-normal">
          {t("rememberMe")}
        </Label>
      </div>
      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t("signIn")}
      </Button>
      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-zinc-500 dark:bg-zinc-950">
          {t("orContinueWith")}
        </span>
      </div>
      <SocialButtons />
      <p className="text-center text-sm text-zinc-600">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-violet-600 hover:underline">
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
