"use client";

import type { TemplateConfig } from "@/types/template";

interface Props {
  config: TemplateConfig;
  customization: Record<string, unknown>;
  title: string;
  eventDate: string;
  venueAddress: string;
  locale: string;
}

export function TemplatePreview({
  config,
  customization,
  title,
  eventDate,
  venueAddress,
}: Props) {
  const theme = config.theme;
  const heroTitle = (customization.heroTitle as string) || title || "Your Event";
  const heroSubtitle = (customization.heroSubtitle as string) || "";

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const formattedTime = eventDate
    ? new Date(eventDate).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className="text-sm"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {config.sections.map((section) => {
        switch (section) {
          case "hero":
            return (
              <div
                key={section}
                className="flex min-h-[200px] flex-col items-center justify-center p-6 text-center text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <h2
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: theme.accentFont || theme.fontFamily,
                  }}
                >
                  {heroTitle}
                </h2>
                {heroSubtitle && (
                  <p className="mt-2 text-white/80">{heroSubtitle}</p>
                )}
              </div>
            );

          case "details":
            return (
              <div key={section} className="space-y-2 p-6 text-center">
                {formattedDate && (
                  <p className="text-lg font-semibold">{formattedDate}</p>
                )}
                {formattedTime && (
                  <p className="text-muted-foreground">{formattedTime}</p>
                )}
                {venueAddress && <p>{venueAddress}</p>}
                {typeof customization.dressCode === "string" &&
                  customization.dressCode && (
                    <p className="text-xs italic">
                      Dress code: {customization.dressCode}
                    </p>
                  )}
              </div>
            );

          case "countdown":
            return (
              <div
                key={section}
                className="p-4 text-center"
                style={{ backgroundColor: theme.secondaryColor + "20" }}
              >
                <p className="text-xs font-medium uppercase tracking-wider">
                  Countdown
                </p>
                <div className="mt-2 flex justify-center gap-4 text-lg font-bold">
                  <span>--</span>
                  <span>:</span>
                  <span>--</span>
                  <span>:</span>
                  <span>--</span>
                </div>
              </div>
            );

          case "gallery":
            return (
              <div key={section} className="p-4">
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: Math.min(config.fields.gallery.maxPhotos, 6) }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded bg-muted"
                      />
                    )
                  )}
                </div>
              </div>
            );

          case "map":
            return (
              <div
                key={section}
                className="flex h-[100px] items-center justify-center bg-muted p-4 text-xs text-muted-foreground"
              >
                Map
              </div>
            );

          case "rsvp":
            return (
              <div
                key={section}
                className="p-4 text-center"
                style={{ backgroundColor: theme.secondaryColor + "10" }}
              >
                <p className="text-xs font-medium">RSVP</p>
                <div className="mx-auto mt-2 h-8 w-24 rounded bg-muted" />
              </div>
            );

          case "gift":
            return (
              <div key={section} className="p-4 text-center">
                <p className="text-xs font-medium">Kaspi QR</p>
                <div className="mx-auto mt-2 h-16 w-16 rounded bg-muted" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
