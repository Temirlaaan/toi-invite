"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { nanoid } from "@/lib/nanoid";

export async function createEventAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const templateSlug = formData.get("templateSlug") as string;
  const title = formData.get("title") as string;

  if (!templateSlug || !title) return;

  const template = await prisma.template.findUnique({
    where: { slug: templateSlug },
  });
  if (!template) return;

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${nanoid(6)}`;

  const event = await prisma.event.create({
    data: {
      userId: session.user.id,
      templateId: template.id,
      slug,
      title,
      customizationJson: {},
    },
  });

  redirect(`/dashboard/events/${event.id}/edit`);
}

export async function updateEventAction(
  eventId: string,
  data: {
    title?: string;
    eventDate?: string | null;
    venueAddress?: string | null;
    venueLat?: number | null;
    venueLng?: number | null;
    musicUrl?: string | null;
    kaspiQrUrl?: string | null;
    customizationJson?: Record<string, unknown>;
  }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const event = await prisma.event.findFirst({
    where: { id: eventId, userId: session.user.id },
  });
  if (!event) return { error: "Event not found" };

  const updateData: Prisma.EventUpdateInput = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.eventDate !== undefined)
    updateData.eventDate = data.eventDate ? new Date(data.eventDate) : null;
  if (data.venueAddress !== undefined)
    updateData.venueAddress = data.venueAddress;
  if (data.venueLat !== undefined) updateData.venueLat = data.venueLat;
  if (data.venueLng !== undefined) updateData.venueLng = data.venueLng;
  if (data.musicUrl !== undefined) updateData.musicUrl = data.musicUrl;
  if (data.kaspiQrUrl !== undefined) updateData.kaspiQrUrl = data.kaspiQrUrl;
  if (data.customizationJson !== undefined)
    updateData.customizationJson =
      data.customizationJson as Prisma.InputJsonValue;

  await prisma.event.update({
    where: { id: eventId },
    data: updateData,
  });

  return { success: true };
}

export async function deleteEventAction(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const event = await prisma.event.findFirst({
    where: { id: eventId, userId: session.user.id },
  });
  if (!event) return { error: "Event not found" };

  await prisma.event.delete({ where: { id: eventId } });
  return { success: true };
}

export async function getEventAction(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.event.findFirst({
    where: { id: eventId, userId: session.user.id },
    include: { template: true, media: true },
  });
}
