import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { getEventAnalytics } from "@/lib/guest-management-actions";
import { GuestListClient } from "@/components/guests/guest-list-client";

export default async function GuestsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { id, locale } = await params;

  const event = await prisma.event.findFirst({
    where: { id, userId: session.user.id },
    include: {
      guests: {
        include: { rsvp: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!event) notFound();

  const analytics = await getEventAnalytics(id);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <GuestListClient
      eventId={event.id}
      eventSlug={event.slug}
      eventTitle={event.title}
      guests={event.guests.map((g) => ({
        id: g.id,
        name: g.name,
        phone: g.phone,
        token: g.token,
        viewCount: g.viewCount,
        createdAt: g.createdAt.toISOString(),
        rsvp: g.rsvp
          ? {
              status: g.rsvp.status,
              guestCount: g.rsvp.guestCount,
              message: g.rsvp.message,
              respondedAt: g.rsvp.respondedAt?.toISOString() ?? null,
            }
          : null,
      }))}
      analytics={analytics}
      appUrl={appUrl}
      locale={locale}
    />
  );
}
