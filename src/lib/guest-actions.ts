"use server";

import { prisma } from "@/lib/db";

export async function trackGuestView(token: string) {
  await prisma.guest.update({
    where: { token },
    data: {
      viewCount: { increment: 1 },
      lastViewedAt: new Date(),
    },
  });
}
