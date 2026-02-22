"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

async function verifyEventOwnership(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const event = await prisma.event.findFirst({
    where: { id: eventId, userId: session.user.id },
  });
  return event;
}

export async function addGuestAction(data: {
  eventId: string;
  name: string;
  phone?: string;
}) {
  const event = await verifyEventOwnership(data.eventId);
  if (!event) return { error: "Event not found" };

  const guest = await prisma.guest.create({
    data: {
      eventId: data.eventId,
      name: data.name.trim(),
      phone: data.phone?.trim() || null,
    },
  });

  return { success: true, guest };
}

export async function bulkImportGuestsAction(data: {
  eventId: string;
  guests: { name: string; phone?: string }[];
}) {
  const event = await verifyEventOwnership(data.eventId);
  if (!event) return { error: "Event not found" };

  if (data.guests.length === 0) return { error: "No guests to import" };
  if (data.guests.length > 500) return { error: "Maximum 500 guests per import" };

  const created = await prisma.guest.createMany({
    data: data.guests.map((g) => ({
      eventId: data.eventId,
      name: g.name.trim(),
      phone: g.phone?.trim() || null,
    })),
  });

  return { success: true, count: created.count };
}

export async function deleteGuestAction(guestId: string, eventId: string) {
  const event = await verifyEventOwnership(eventId);
  if (!event) return { error: "Event not found" };

  await prisma.guest.delete({ where: { id: guestId } });
  return { success: true };
}

export async function updateGuestTableAction(data: {
  guestId: string;
  eventId: string;
  tableNumber: number | null;
}) {
  const event = await verifyEventOwnership(data.eventId);
  if (!event) return { error: "Event not found" };

  await prisma.guest.update({
    where: { id: data.guestId },
    data: { tableNumber: data.tableNumber },
  });

  return { success: true };
}

export async function getGuestsWithRsvp(eventId: string) {
  const event = await verifyEventOwnership(eventId);
  if (!event) return [];

  return prisma.guest.findMany({
    where: { eventId },
    include: { rsvp: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getEventAnalytics(eventId: string) {
  const event = await verifyEventOwnership(eventId);
  if (!event) return null;

  const guests = await prisma.guest.findMany({
    where: { eventId },
    include: { rsvp: true },
  });

  const totalInvited = guests.length;
  const totalViews = guests.reduce((sum, g) => sum + g.viewCount, 0);

  const rsvpCounts = {
    confirmed: 0,
    declined: 0,
    maybe: 0,
    pending: 0,
  };
  let totalGuestCount = 0;

  for (const guest of guests) {
    if (guest.rsvp) {
      const status = guest.rsvp.status.toLowerCase() as keyof typeof rsvpCounts;
      rsvpCounts[status]++;
      if (guest.rsvp.status === "CONFIRMED") {
        totalGuestCount += guest.rsvp.guestCount;
      }
    } else {
      rsvpCounts.pending++;
    }
  }

  const responded =
    rsvpCounts.confirmed + rsvpCounts.declined + rsvpCounts.maybe;
  const conversionRate =
    totalViews > 0 ? Math.round((responded / totalViews) * 100) : 0;

  return {
    totalInvited,
    totalViews,
    totalGuestCount,
    conversionRate,
    rsvp: rsvpCounts,
  };
}

export async function exportGuestsCsv(eventId: string, appUrl: string) {
  const event = await verifyEventOwnership(eventId);
  if (!event) return { error: "Event not found" };

  const guests = await prisma.guest.findMany({
    where: { eventId },
    include: { rsvp: true },
    orderBy: { createdAt: "asc" },
  });

  const header = "Name,Phone,RSVP Status,Guest Count,Table,Message,Link";
  const rows = guests.map((g) => {
    const status = g.rsvp?.status ?? "PENDING";
    const count = g.rsvp?.guestCount ?? "";
    const table = g.tableNumber ?? "";
    const message = (g.rsvp?.message ?? "").replace(/"/g, '""');
    const link = `${appUrl}/e/${event.slug}/g/${g.token}`;
    return `"${g.name}","${g.phone ?? ""}","${status}","${count}","${table}","${message}","${link}"`;
  });

  return { csv: [header, ...rows].join("\n") };
}
