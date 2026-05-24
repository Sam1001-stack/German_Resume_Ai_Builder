"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageTransition } from "@/components/shared/page-transition";
import { ProfileLayoutShell } from "@/components/profile/profile-layout-shell";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth-service";

interface EditProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  phone: string;
  location: string;
}

export default function EditProfilePage() {
  const t = useTranslations("profile");
  const ta = useTranslations("auth");
  const { user } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EditProfileForm>();

  useEffect(() => {
    authService
      .getProfile()
      .then((profile) => {
        setUser(profile);
        setAvatar(profile.avatar ?? "");
        reset({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          bio: profile.bio ?? "",
          phone: profile.phone ?? "",
          location: profile.location ?? "",
        });
      })
      .catch(() => {
        if (user) {
          reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            bio: user.bio ?? "",
            phone: user.phone ?? "",
            location: user.location ?? "",
          });
        }
      })
      .finally(() => setLoadingProfile(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "U";

  const onSubmit = async (data: EditProfileForm) => {
    try {
      const updated = await authService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        avatar: avatar || undefined,
        bio: data.bio,
        phone: data.phone,
        location: data.location,
      });
      setUser(updated);
      setAvatar(updated.avatar ?? "");
      toast.success(t("saveChanges"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("saveChanges");
      toast.error(message);
    }
  };

  if (loadingProfile) {
    return (
      <PageTransition>
        <ProfileLayoutShell>
          <Skeleton className="mb-8 h-8 w-48" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </ProfileLayoutShell>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <ProfileLayoutShell>
        <h1 className="mb-8 text-2xl font-bold">{t("editProfile")}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AvatarUpload value={avatar} initials={initials} onChange={setAvatar} />
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{ta("firstName")}</Label>
              <Input {...register("firstName")} />
            </div>
            <div className="space-y-2">
              <Label>{ta("lastName")}</Label>
              <Input {...register("lastName")} />
            </div>
          </section>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
          </div>
          <div className="space-y-2">
            <Label>{t("bio")}</Label>
            <Textarea {...register("bio")} rows={4} />
          </div>
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("phone")}</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>{t("location")}</Label>
              <Input {...register("location")} />
            </div>
          </section>
          <Button type="submit" loading={isSubmitting}>
            {t("saveChanges")}
          </Button>
        </form>
      </ProfileLayoutShell>
    </PageTransition>
  );
}
