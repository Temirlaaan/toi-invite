import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { TemplateConfig } from "@/types/template";
import { InvitationContent } from "@/components/invitation/invitation-content";
import { Envelope } from "@/components/invitation/envelope";
import { MusicPlayer } from "@/components/invitation/music-player";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

async function getEvent(slug: string) {
  return prisma.event.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { template: true, media: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};

  const customization = event.customizationJson as Record<string, unknown>;
  const title = (customization.heroTitle as string) || event.title;
  const description =
    (customization.heroSubtitle as string) || `${event.title} — Toi Invite`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", siteName: "Toi Invite" },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { locale, slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const config = event.template.configJson as unknown as TemplateConfig;
  const customization = event.customizationJson as Record<string, unknown>;
  const photos = event.media.filter((m) => m.type === "PHOTO");
  const musicFile = event.media.find((m) => m.type === "MUSIC");

  const s3Endpoint = process.env.S3_ENDPOINT || "http://localhost:9000";
  const s3Bucket = process.env.S3_BUCKET || "toi-invite";

  const musicUrl =
    event.musicUrl ||
    (musicFile ? `${s3Endpoint}/${s3Bucket}/${musicFile.s3Key}` : null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    ...(event.eventDate && { startDate: event.eventDate.toISOString() }),
    ...(event.venueAddress && {
      location: {
        "@type": "Place",
        name: event.venueAddress,
        ...(event.venueLat &&
          event.venueLng && {
            geo: {
              "@type": "GeoCoordinates",
              latitude: event.venueLat,
              longitude: event.venueLng,
            },
          }),
      },
    }),
  };

  const content = (
    <div
      className="mx-auto min-h-screen max-w-[430px] md:my-8 md:rounded-2xl md:shadow-2xl md:overflow-hidden"
      style={{
        backgroundColor: config.theme.backgroundColor,
        fontFamily: config.theme.fontFamily,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InvitationContent
        config={config}
        customization={customization}
        event={{
          id: event.id,
          title: event.title,
          eventDate: event.eventDate,
          venueAddress: event.venueAddress,
          venueLat: event.venueLat,
          venueLng: event.venueLng,
          kaspiQrUrl: event.kaspiQrUrl,
        }}
        photos={photos.map((p) => ({
          id: p.id,
          s3Key: p.s3Key,
          originalName: p.originalName,
        }))}
        s3Endpoint={s3Endpoint}
        s3Bucket={s3Bucket}
        locale={locale}
      />
      {/* MusicPlayer only shown when no envelope (envelope handles its own audio) */}
      {!config.hasEnvelope && musicUrl && (
        <MusicPlayer musicUrl={musicUrl} primaryColor={config.theme.primaryColor} />
      )}
    </div>
  );

  if (config.hasEnvelope) {
    return (
      <Envelope
        primaryColor={config.theme.primaryColor}
        backgroundColor={config.theme.backgroundColor}
        textColor={config.theme.textColor}
        title={event.title}
        musicUrl={musicUrl}
        locale={locale}
      >
        {content}
      </Envelope>
    );
  }

  return content;
}
