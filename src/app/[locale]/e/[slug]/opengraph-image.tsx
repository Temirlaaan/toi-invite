import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";
import type { TemplateConfig } from "@/types/template";

export const runtime = "nodejs";
export const alt = "Toi Invite";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { template: true },
  });

  if (!event) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Toi Invite
        </div>
      ),
      size
    );
  }

  const config = event.template.configJson as unknown as TemplateConfig;
  const customization = event.customizationJson as Record<string, unknown>;
  const heroTitle = (customization.heroTitle as string) || event.title;
  const heroSubtitle = (customization.heroSubtitle as string) || "";
  const dateStr = event.eventDate
    ? event.eventDate.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: config.theme.backgroundColor,
          color: config.theme.textColor,
          fontFamily: "sans-serif",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "4px",
            textTransform: "uppercase",
            opacity: 0.5,
            marginBottom: "20px",
          }}
        >
          Toi Invite
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: "900px",
          }}
        >
          {heroTitle}
        </div>
        {heroSubtitle && (
          <div
            style={{
              fontSize: 28,
              marginTop: "16px",
              opacity: 0.7,
              maxWidth: "700px",
            }}
          >
            {heroSubtitle}
          </div>
        )}
        {dateStr && (
          <div
            style={{
              fontSize: 24,
              marginTop: "24px",
              color: config.theme.primaryColor,
              fontWeight: 600,
            }}
          >
            {dateStr}
          </div>
        )}
        {event.venueAddress && (
          <div
            style={{
              fontSize: 20,
              marginTop: "8px",
              opacity: 0.6,
            }}
          >
            {event.venueAddress}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: 16,
            opacity: 0.4,
          }}
        >
          💌 toi-invite.kz
        </div>
      </div>
    ),
    size
  );
}
