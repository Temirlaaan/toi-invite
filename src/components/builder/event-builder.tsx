"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { updateEventAction } from "@/lib/event-actions";
import { createMediaAction, deleteMediaAction } from "@/lib/media-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplatePreview } from "./template-preview";
import type { TemplateConfig } from "@/types/template";
import type { MediaType } from "@prisma/client";

interface EventData {
  id: string;
  title: string;
  eventDate: string | null;
  venueAddress: string | null;
  venueLat: number | null;
  venueLng: number | null;
  musicUrl: string | null;
  kaspiQrUrl: string | null;
  customizationJson: Record<string, unknown>;
  status: string;
}

interface MediaItem {
  id: string;
  type: MediaType;
  s3Key: string;
  originalName: string;
}

interface Props {
  event: EventData;
  template: { name: string; configJson: Record<string, unknown> };
  media: MediaItem[];
  locale: string;
}

export function EventBuilder({ event, template, media: initialMedia, locale }: Props) {
  const t = useTranslations("builder");
  const config = template.configJson as unknown as TemplateConfig;

  const [title, setTitle] = useState(event.title);
  const [eventDate, setEventDate] = useState(event.eventDate?.slice(0, 16) ?? "");
  const [venueAddress, setVenueAddress] = useState(event.venueAddress ?? "");
  const [venueLat, setVenueLat] = useState(event.venueLat?.toString() ?? "");
  const [venueLng, setVenueLng] = useState(event.venueLng?.toString() ?? "");
  const [kaspiQrUrl, setKaspiQrUrl] = useState(event.kaspiQrUrl ?? "");

  const [customization, setCustomization] = useState<Record<string, unknown>>(
    event.customizationJson ?? {}
  );
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [uploading, setUploading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async () => {
    setSaveStatus("saving");
    await updateEventAction(event.id, {
      title,
      eventDate: eventDate || null,
      venueAddress: venueAddress || null,
      venueLat: venueLat ? parseFloat(venueLat) : null,
      venueLng: venueLng ? parseFloat(venueLng) : null,
      kaspiQrUrl: kaspiQrUrl || null,
      customizationJson: customization,
    });
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, [event.id, title, eventDate, venueAddress, venueLat, venueLng, kaspiQrUrl, customization]);

  // Auto-save debounced
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [title, eventDate, venueAddress, venueLat, venueLng, kaspiQrUrl, customization, save]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaCategory: "image" | "video" | "audio"
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const mediaTypeMap: Record<string, MediaType> = {
      image: "PHOTO",
      video: "VIDEO",
      audio: "MUSIC",
    };

    for (const file of Array.from(files)) {
      try {
        // Get presigned URL
        const res = await fetch("/api/media/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event.id,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            mediaCategory,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || "Upload failed");
          continue;
        }

        const { url, key } = await res.json();

        // Upload to S3
        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        // Create media record
        const result = await createMediaAction({
          eventId: event.id,
          type: mediaTypeMap[mediaCategory],
          s3Key: key,
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
        });

        if (result && "media" in result && result.media) {
          setMedia((prev) => [
            ...prev,
            {
              id: result.media!.id,
              type: result.media!.type,
              s3Key: result.media!.s3Key,
              originalName: result.media!.originalName,
            },
          ]);
        }
      } catch {
        alert(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDeleteMedia = async (mediaId: string) => {
    await deleteMediaAction(mediaId);
    setMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const updateCustomization = (key: string, value: string) => {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Form Panel */}
      <div className="flex-1 overflow-y-auto border-r p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              &larr; {t("back")}
            </Link>
            <h1 className="text-xl font-bold">{t("title")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {saveStatus === "saving"
                ? t("saving")
                : saveStatus === "saved"
                  ? t("saved")
                  : ""}
            </span>
            <Button onClick={save} size="sm">
              {t("saved")}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("eventDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("eventTitle")}</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("eventDate")}</Label>
                <Input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("venueAddress")}</Label>
                <Input
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="Алматы, Almaty Towers"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("lat")}</Label>
                  <Input
                    type="number"
                    step="any"
                    value={venueLat}
                    onChange={(e) => setVenueLat(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("lng")}</Label>
                  <Input
                    type="number"
                    step="any"
                    value={venueLng}
                    onChange={(e) => setVenueLng(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("customization")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("heroTitle")}</Label>
                <Input
                  value={(customization.heroTitle as string) ?? ""}
                  onChange={(e) =>
                    updateCustomization("heroTitle", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("heroSubtitle")}</Label>
                <Input
                  value={(customization.heroSubtitle as string) ?? ""}
                  onChange={(e) =>
                    updateCustomization("heroSubtitle", e.target.value)
                  }
                />
              </div>
              {config.fields.details.dressCode && (
                <div className="space-y-2">
                  <Label>{t("dressCode")}</Label>
                  <Input
                    value={(customization.dressCode as string) ?? ""}
                    onChange={(e) =>
                      updateCustomization("dressCode", e.target.value)
                    }
                  />
                </div>
              )}
              {config.fields.gift?.kaspiQr && (
                <div className="space-y-2">
                  <Label>{t("kaspiQr")}</Label>
                  <Input
                    value={kaspiQrUrl}
                    onChange={(e) => setKaspiQrUrl(e.target.value)}
                    placeholder="https://kaspi.kz/pay/..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("media")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">{t("uploadPhotos")}</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => handleFileUpload(e, "image")}
                  disabled={uploading}
                />
              </div>
              <div>
                <Label className="mb-2 block">{t("uploadMusic")}</Label>
                <Input
                  type="file"
                  accept="audio/mpeg,audio/wav,audio/ogg"
                  onChange={(e) => handleFileUpload(e, "audio")}
                  disabled={uploading}
                />
              </div>

              {media.length > 0 && (
                <div className="space-y-2">
                  {media.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                    >
                      <span className="truncate">{m.originalName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMedia(m.id)}
                        className="text-destructive"
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-full border-t lg:w-[400px] lg:border-t-0">
        <div className="sticky top-0 p-4">
          <h2 className="mb-4 text-center text-sm font-medium text-muted-foreground">
            {t("preview")}
          </h2>
          <div className="overflow-hidden rounded-lg border shadow-sm">
            <TemplatePreview
              config={config}
              customization={customization}
              title={title}
              eventDate={eventDate}
              venueAddress={venueAddress}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
