import type { TemplateConfig } from "@/types/template";
import { HeroSection } from "./hero-section";
import { DetailsSection } from "./details-section";
import { CountdownSection } from "./countdown-section";
import { GallerySection } from "./gallery-section";
import { MapSection } from "./map-section";
import { GiftSection } from "./gift-section";
import { RsvpSection } from "./rsvp-section";
import { LanguageSwitcher } from "./language-switcher";
import { AnimatedSection } from "./animated-section";
import { StickyBar } from "./sticky-bar";
import { TimelineSection } from "./timeline-section";

interface Props {
  config: TemplateConfig;
  customization: Record<string, unknown>;
  event: {
    id: string;
    title: string;
    eventDate: Date | null;
    venueAddress: string | null;
    venueLat: number | null;
    venueLng: number | null;
    kaspiQrUrl: string | null;
  };
  photos: { id: string; s3Key: string; originalName: string }[];
  s3Endpoint: string;
  s3Bucket: string;
  locale: string;
  guestToken?: string;
  guestName?: string;
}

export function InvitationContent({
  config,
  customization,
  event,
  photos,
  s3Endpoint,
  s3Bucket,
  locale,
  guestToken,
  guestName,
}: Props) {
  const anim = config.animationStyle || "fade";
  const hasGift = config.sections.includes("gift");

  return (
    <>
      <LanguageSwitcher locale={locale} />

      {config.sections.map((section, i) => {
        const delay = i * 0.1;
        let node: React.ReactNode = null;

        switch (section) {
          case "hero":
            node = (
              <HeroSection
                config={config}
                customization={customization}
                title={event.title}
                guestName={guestName}
              />
            );
            break;
          case "details":
            node = (
              <DetailsSection
                config={config}
                customization={customization}
                eventDate={event.eventDate}
                venueAddress={event.venueAddress}
                locale={locale}
              />
            );
            break;
          case "countdown":
            node = event.eventDate ? (
              <CountdownSection
                config={config}
                eventDate={event.eventDate.toISOString()}
                locale={locale}
              />
            ) : null;
            break;
          case "gallery":
            node = (
              <GallerySection
                config={config}
                photos={photos}
                s3Endpoint={s3Endpoint}
                s3Bucket={s3Bucket}
              />
            );
            break;
          case "map":
            node = (
              <MapSection
                config={config}
                customization={customization}
                venueAddress={event.venueAddress}
                venueLat={event.venueLat}
                venueLng={event.venueLng}
                locale={locale}
              />
            );
            break;
          case "rsvp":
            node = (
              <RsvpSection
                config={config}
                eventId={event.id}
                guestToken={guestToken}
                guestName={guestName}
                locale={locale}
              />
            );
            break;
          case "timeline":
            node = (
              <TimelineSection
                config={config}
                customization={customization}
                locale={locale}
              />
            );
            break;
          case "gift":
            node = (
              <GiftSection
                config={config}
                kaspiQrUrl={event.kaspiQrUrl}
                locale={locale}
              />
            );
            break;
          default:
            break;
        }

        if (!node) return null;

        // Hero doesn't need scroll animation (it's above fold)
        if (section === "hero") {
          return (
            <section key={section} data-section={section}>
              {node}
            </section>
          );
        }

        return (
          <section key={section} data-section={section}>
            <AnimatedSection animation={anim} delay={delay}>
              {node}
            </AnimatedSection>
          </section>
        );
      })}

      <StickyBar
        primaryColor={config.theme.primaryColor}
        locale={locale}
        hasGift={hasGift}
      />
    </>
  );
}
