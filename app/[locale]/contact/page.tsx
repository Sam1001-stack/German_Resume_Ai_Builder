"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ContentPage } from "@/components/shared/content-page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const { register, handleSubmit } = useForm<ContactForm>();

  const onSubmit = () => {
    toast.success(t("success"));
  };

  return (
    <ContentPage title={t("title")}>
      <p className="mb-8">{t("subtitle")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
        <div className="space-y-2">
          <Label>{t("name")}</Label>
          <Input {...register("name", { required: true })} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" {...register("email", { required: true })} />
        </div>
        <div className="space-y-2">
          <Label>{t("message")}</Label>
          <Textarea rows={5} {...register("message", { required: true })} />
        </div>
        <Button type="submit">{t("send")}</Button>
      </form>
    </ContentPage>
  );
}
