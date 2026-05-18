"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageTransition } from "@/components/shared/page-transition";
import { ProfileLayoutShell } from "@/components/profile/profile-layout-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { Upload } from "lucide-react";

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

  const { register, handleSubmit } = useForm<EditProfileForm>({
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      bio: "",
      phone: "",
      location: "",
    },
  });

  const onSubmit = (data: EditProfileForm) => {
    if (user) {
      setUser({ ...user, firstName: data.firstName, lastName: data.lastName, email: data.email });
    }
    toast.success(t("saveChanges"));
  };

  return (
    <PageTransition>
      <ProfileLayoutShell>
        <h1 className="mb-8 text-2xl font-bold">{t("editProfile")}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Button type="button" variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            {t("uploadAvatar")}
          </Button>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{ta("firstName")}</Label>
              <Input {...register("firstName")} />
            </div>
            <div className="space-y-2">
              <Label>{ta("lastName")}</Label>
              <Input {...register("lastName")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
          </div>
          <div className="space-y-2">
            <Label>{t("bio")}</Label>
            <Textarea {...register("bio")} rows={4} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("phone")}</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>{t("location")}</Label>
              <Input {...register("location")} />
            </div>
          </div>
          <Button type="submit">{t("saveChanges")}</Button>
        </form>
      </ProfileLayoutShell>
    </PageTransition>
  );
}
