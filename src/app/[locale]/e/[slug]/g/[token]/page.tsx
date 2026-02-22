import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { trackGuestView } from "@/lib/guest-actions";
import type { TemplateConfig } from "@/types/template";
import { InvitationContent } from "@/components/invitation/invitation-content";
import { Envelope } from "@/components/invitation/envelope";
import { MusicPlayer } from "@/components/invitation/music-player";

interface Props {
  params: Promise<{ locale: string; slug: string; token: string }>;
}

async function getEventAndGuest(slug: string, token: string) {
  const guest = await prisma.guest.findUnique({
    where: { token },
    include: {
      event: { include: { template: true, media: true } },
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
  const title = (customization.heroTitle as string) || event.title;

  return {
    title: `${guest.name} — ${title}`,
    description: `${guest.name}, ${(customization.heroSubtitle as string) || event.title}`,
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
  await trackGuestView(token);

  const config = event.template.configJson as unknown as TemplateConfig;
  const customization = event.customizationJson as Record<string, unknown>;

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

  const musicUrl =
    event.musicUrl ||
    (musicFile ? `${s3Endpoint}/${s3Bucket}/${musicFile.s3Key}` : null);

  const content = (
    <div
      className="mx-auto min-h-screen max-w-[430px] md:my-8 md:rounded-2xl md:shadow-2xl md:overflow-hidden"
      style={{
        backgroundColor: config.theme.backgroundColor,
        fontFamily: config.theme.fontFamily,
      }}
    >
      <InvitationContent
        config={config}
        customization={personalizedCustomization}
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
        guestToken={token}
        guestName={guest.name}
      />
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
