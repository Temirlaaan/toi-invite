"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { s3, S3_BUCKET } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { MediaType } from "@prisma/client";

export async function createMediaAction(data: {
  eventId: string;
  type: MediaType;
  s3Key: string;
  originalName: string;
  size: number;
  mimeType: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const event = await prisma.event.findFirst({
    where: { id: data.eventId, userId: session.user.id },
  });
  if (!event) return { error: "Event not found" };

  const media = await prisma.media.create({ data });
  return { success: true, media };
}

export async function deleteMediaAction(mediaId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    include: { event: true },
  });

  if (!media || media.event.userId !== session.user.id) {
    return { error: "Media not found" };
  }

  // Delete from S3
  try {
    await s3.send(
      new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: media.s3Key })
    );
  } catch {
    // Continue even if S3 delete fails
  }

  await prisma.media.delete({ where: { id: mediaId } });
  return { success: true };
}

export async function listMediaAction(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.media.findMany({
    where: {
      eventId,
      event: { userId: session.user.id },
    },
    orderBy: { createdAt: "asc" },
  });
}
