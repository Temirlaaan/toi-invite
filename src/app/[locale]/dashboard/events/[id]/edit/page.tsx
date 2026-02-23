import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { EventBuilder } from "@/components/builder/event-builder";
import { TEMPLATE_PRICING } from "@/lib/kaspi";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { id, locale } = await params;

  const event = await prisma.event.findFirst({
    where: { id, userId: session.user.id },
    include: { template: true, media: true },
  });

  if (!event) notFound();

  return (
    <EventBuilder
      event={{
        id: event.id,
        title: event.title,
        eventDate: event.eventDate?.toISOString() ?? null,
        venueAddress: event.venueAddress,
        venueLat: event.venueLat,
        venueLng: event.venueLng,
        musicUrl: event.musicUrl,
        kaspiQrUrl: event.kaspiQrUrl,
        customizationJson: event.customizationJson as Record<string, unknown>,
        status: event.status,
      }}
      template={{
        name: event.template.name,
        category: event.template.category,
        configJson: event.template.configJson as Record<string, unknown>,
      }}
      price={TEMPLATE_PRICING[event.template.category] ?? 0}
      media={event.media.map((m) => ({
        id: m.id,
        type: m.type,
        s3Key: m.s3Key,
        originalName: m.originalName,
      }))}
      locale={locale}
      s3Endpoint={process.env.S3_ENDPOINT}
      s3Bucket={process.env.S3_BUCKET}
    />
  );
}
