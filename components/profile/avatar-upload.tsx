"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { readImageAsDataUrl } from "@/lib/image-utils";
import { toast } from "sonner";

interface AvatarUploadProps {
  value?: string;
  initials: string;
  onChange: (dataUrl: string) => void;
}

export function AvatarUpload({ value, initials, onChange }: AvatarUploadProps) {
  const t = useTranslations("profile");
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value ?? "");

  useEffect(() => {
    setPreview(value ?? "");
  }, [value]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readImageAsDataUrl(file);
      setPreview(dataUrl);
      onChange(dataUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : t("uploadAvatar");
      toast.error(message);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Avatar className="h-20 w-20 border-2 border-violet-100 dark:border-violet-900">
        {preview && <AvatarImage src={preview} alt="" />}
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <Label htmlFor="avatar-upload">{t("uploadAvatar")}</Label>
        <input
          ref={inputRef}
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {t("uploadAvatar")}
        </Button>
        <p className="text-xs text-zinc-500">JPG, PNG, WebP or GIF · max 1 MB</p>
      </div>
    </div>
  );
}
