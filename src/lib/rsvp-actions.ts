"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import type { RsvpStatus } from "@prisma/client";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 10) return false;

  entry.count++;
  return true;
}

const VALID_STATUSES: RsvpStatus[] = ["CONFIRMED", "DECLINED", "MAYBE"];

export async function submitRsvpAction(data: {
  eventId: string;
  guestToken?: string;
  guestName: string;
  status: string;
  guestCount: number;
  message?: string;
}) {
  // Rate limit
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return { error: "Too many requests. Please try again later." };
  }

  // Validate status
  if (!VALID_STATUSES.includes(data.status as RsvpStatus)) {
    return { error: "Invalid RSVP status" };
  }

  // Validate guest count
  const guestCount = Math.min(20, Math.max(1, data.guestCount || 1));

  // Validate message
  const message = data.message?.slice(0, 500) || null;

  // Validate guest name
  const guestName = data.guestName?.trim();
  if (!guestName) {
    return { error: "Guest name is required" };
  }

  // Verify event exists and is published
  const event = await prisma.event.findFirst({
    where: { id: data.eventId, status: "PUBLISHED" },
  });
  if (!event) return { error: "Event not found" };

  let guestId: string;

  if (data.guestToken) {
    // Personalized link — find existing guest
    const guest = await prisma.guest.findUnique({
      where: { token: data.guestToken },
    });
    if (!guest || guest.eventId !== data.eventId) {
      return { error: "Invalid guest link" };
    }
    guestId = guest.id;
  } else {
    // Anonymous — create guest record
    const guest = await prisma.guest.create({
      data: {
        eventId: data.eventId,
        name: guestName,
      },
    });
    guestId = guest.id;
  }

  // Upsert RSVP
  await prisma.rsvp.upsert({
    where: { guestId },
    create: {
      guestId,
      status: data.status as RsvpStatus,
      guestCount,
      message,
      respondedAt: new Date(),
    },
    update: {
      status: data.status as RsvpStatus,
      guestCount,
      message,
      respondedAt: new Date(),
    },
  });

  return { success: true };
}
