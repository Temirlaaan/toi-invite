import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { trackGuestView } from "@/lib/guest-actions";
import type { TemplateConfig } from "@/types/template";
import { HeroSection } from "@/components/invitation/hero-section";
import { DetailsSection } from "@/components/invitation/details-section";
import { CountdownSection } from "@/components/invitation/countdown-section";
import { GallerySection } from "@/components/invitation/gallery-section";
import { MapSection } from "@/components/invitation/map-section";
import { GiftSection } from "@/components/invitation/gift-section";
import { MusicPlayer } from "@/components/invitation/music-player";
import { RsvpSection } from "@/components/invitation/rsvp-section";
import { LanguageSwitcher } from "@/components/invitation/language-switcher";

interface Props {
  params: Promise<{ locale: string; slug: string; token: string }>;
}

async function getEventAndGuest(slug: string, token: string) {
  const guest = await prisma.guest.findUnique({
    where: { token },
    include: {
      event: {
        include: { template: true, media: true },
      },
    },
  });

  if (!guest || guest.event.slug !== slug || guest.event.status !== "PUBLISHED") {
    return null;
  }

  return { guest, event: guest.event };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, token } = await params;
  const data = await getEventAndGuest(slug, token);
  if (!data) return {};

  const { event, guest } = data;
  const customization = event.customizationJson as Record<string, unknown>;
  const title =
    (customization.heroTitle as string) || event.title;

  return {
    title: `${guest.name} — ${title}`,
    description: `${guest.name}, ${
      (customization.heroSubtitle as string) || event.title
    }`,
    openGraph: {
      title: `${guest.name} — ${title}`,
      type: "website",
      siteName: "Toi Invite",
    },
  };
}

export default async function PersonalizedInvitationPage({ params }: Props) {
  const { locale, slug, token } = await params;
  const data = await getEventAndGuest(slug, token);
  if (!data) notFound();

  const { guest, event } = data;

  // Track view
  await trackGuestView(token);

  const config = event.template.configJson as unknown as TemplateConfig;
  const customization = event.customizationJson as Record<string, unknown>;

  // Override hero subtitle with guest name
  const personalizedCustomization = {
    ...customization,
    heroSubtitle:
      (customization.heroSubtitle as string) ||
      (locale === "kk"
        ? `${guest.name}, сізді шақырамыз!`
        : `${guest.name}, приглашаем вас!`),
  };

  const photos = event.media.filter((m) => m.type === "PHOTO");
  const musicFile = event.media.find((m) => m.type === "MUSIC");

  const s3Endpoint = process.env.S3_ENDPOINT || "http://localhost:9000";
  const s3Bucket = process.env.S3_BUCKET || "toi-invite";

  const musicUrl = event.musicUrl || (musicFile
    ? `${s3Endpoint}/${s3Bucket}/${musicFile.s3Key}`
    : null);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: config.theme.backgroundColor,
        fontFamily: config.theme.fontFamily,
      }}
    >
      <LanguageSwitcher locale={locale} />

      {config.sections.map((section) => {
        switch (section) {
          case "hero":
            return (
              <HeroSection
                key={section}
                config={config}
                customization={personalizedCustomization}
                title={event.title}
              />
            );
          case "details":
            return (
              <DetailsSection
                key={section}
                config={config}
                customization={personalizedCustomization}
                eventDate={event.eventDate}
                venueAddress={event.venueAddress}
                locale={locale}
              />
            );
          case "countdown":
            return event.eventDate ? (
              <CountdownSection
                key={section}
                config={config}
                eventDate={event.eventDate.toISOString()}
                locale={locale}
              />
            ) : null;
          case "gallery":
            return (
              <GallerySection
                key={section}
                config={config}
                photos={photos.map((p) => ({
                  id: p.id,
                  s3Key: p.s3Key,
                  originalName: p.originalName,
                }))}
                s3Endpoint={s3Endpoint}
                s3Bucket={s3Bucket}
              />
            );
          case "map":
            return (
              <MapSection
                key={section}
                config={config}
                venueAddress={event.venueAddress}
                venueLat={event.venueLat}
                venueLng={event.venueLng}
                locale={locale}
              />
            );
          case "rsvp":
            return (
              <RsvpSection
                key={section}
                config={config}
                eventId={event.id}
                guestToken={token}
                guestName={guest.name}
                locale={locale}
              />
            );
          case "gift":
            return (
              <GiftSection
                key={section}
                config={config}
                kaspiQrUrl={event.kaspiQrUrl}
                locale={locale}
              />
            );
          default:
            return null;
        }
      })}

      {musicUrl && (
        <MusicPlayer musicUrl={musicUrl} primaryColor={config.theme.primaryColor} />
      )}
    </div>
  );
}
