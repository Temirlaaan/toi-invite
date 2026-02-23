"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { updateEventAction } from "@/lib/event-actions";
import { createMediaAction, deleteMediaAction } from "@/lib/media-actions";
import { PublishButton } from "./publish-button";
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

interface TimelineItem {
  time: string;
  icon: string;
  title: string;
  description: string;
}

interface Props {
  event: EventData;
  template: { name: string; category: string; configJson: Record<string, unknown> };
  media: MediaItem[];
  locale: string;
  price: number;
  s3Endpoint?: string;
  s3Bucket?: string;
}

export function EventBuilder({ event, template, media: initialMedia, locale, price, s3Endpoint, s3Bucket }: Props) {
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

  const updateCustomizationValue = (key: string, value: unknown) => {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  };

  const timeline = (customization.timeline as TimelineItem[] | undefined) ?? [];

  const addTimelineItem = () => {
    updateCustomizationValue("timeline", [
      ...timeline,
      { time: "", icon: "", title: "", description: "" },
    ]);
  };

  const removeTimelineItem = (index: number) => {
    updateCustomizationValue(
      "timeline",
      timeline.filter((_, i) => i !== index)
    );
  };

  const updateTimelineItem = (index: number, field: keyof TimelineItem, value: string) => {
    const updated = timeline.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    updateCustomizationValue("timeline", updated);
  };

  const handleSingleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaCategory: "image" | "video",
    customizationKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
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
        setUploading(false);
        return;
      }

      const { url, key } = await res.json();

      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const s3Url =
        s3Endpoint && s3Bucket
          ? `${s3Endpoint}/${s3Bucket}/${key}`
          : key;
      updateCustomization(customizationKey, s3Url);
    } catch {
      alert(`Failed to upload ${file.name}`);
    }
    setUploading(false);
    e.target.value = "";
  };

  const parseDressColors = (value: string): string[] => {
    return value
      .split(",")
      .map((c) => c.trim())
      .filter((c) => /^#[0-9a-fA-F]{3,8}$/.test(c));
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
            <Button onClick={save} size="sm" variant="outline">
              {t("saved")}
            </Button>
            <PublishButton
              eventId={event.id}
              status={event.status}
              templateCategory={template.category}
              price={price}
            />
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
              <div className="space-y-2">
                <Label>{t("venueName")}</Label>
                <Input
                  value={(customization.venueName as string) ?? ""}
                  onChange={(e) =>
                    updateCustomization("venueName", e.target.value)
                  }
                  placeholder="Almaty Towers"
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
                <>
                  <div className="space-y-2">
                    <Label>{t("dressCode")}</Label>
                    <Input
                      value={(customization.dressCode as string) ?? ""}
                      onChange={(e) =>
                        updateCustomization("dressCode", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("dressColors")}</Label>
                    <Input
                      value={(customization.dressColors as string) ?? ""}
                      onChange={(e) =>
                        updateCustomization("dressColors", e.target.value)
                      }
                      placeholder="#8B7355, #D4C5A9"
                    />
                    {(customization.dressColors as string) && (
                      <div className="flex gap-2 mt-1">
                        {parseDressColors(customization.dressColors as string).map(
                          (color, i) => (
                            <div
                              key={i}
                              className="h-6 w-6 rounded-full border"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          )
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              {config.fields.hero.backgroundImage && (
                <div className="space-y-2">
                  <Label>{t("heroImage")}</Label>
                  {(customization.heroBackgroundImage as string) && (
                    <div className="flex items-center gap-2">
                      <img
                        src={customization.heroBackgroundImage as string}
                        alt=""
                        className="h-16 w-16 rounded object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => updateCustomization("heroBackgroundImage", "")}
                      >
                        &times;
                      </Button>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleSingleFileUpload(e, "image", "heroBackgroundImage")}
                    disabled={uploading}
                  />
                </div>
              )}
              {config.heroVideoSupport && (
                <div className="space-y-2">
                  <Label>{t("heroVideo")}</Label>
                  {(customization.heroVideo as string) && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {(customization.heroVideo as string).split("/").pop()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => updateCustomization("heroVideo", "")}
                      >
                        &times;
                      </Button>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={(e) => handleSingleFileUpload(e, "video", "heroVideo")}
                    disabled={uploading}
                  />
                </div>
              )}
              {config.sections.includes("timeline") && (
                <div className="space-y-3">
                  <Label>{t("timeline")}</Label>
                  {timeline.map((item, index) => (
                    <div key={index} className="space-y-2 rounded border p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={item.time}
                          onChange={(e) => updateTimelineItem(index, "time", e.target.value)}
                          placeholder={t("timelineTime")}
                        />
                        <Input
                          value={item.icon}
                          onChange={(e) => updateTimelineItem(index, "icon", e.target.value)}
                          placeholder={t("timelineIcon")}
                        />
                      </div>
                      <Input
                        value={item.title}
                        onChange={(e) => updateTimelineItem(index, "title", e.target.value)}
                        placeholder={t("timelineTitle")}
                      />
                      <Input
                        value={item.description}
                        onChange={(e) => updateTimelineItem(index, "description", e.target.value)}
                        placeholder={t("timelineDesc")}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => removeTimelineItem(index)}
                      >
                        {t("removeItem")}
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addTimelineItem}>
                    {t("addTimelineItem")}
                  </Button>
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
