"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { nanoid } from "@/lib/nanoid";
import {
  createKaspiOrder,
  isMockMode,
  TEMPLATE_PRICING,
} from "@/lib/kaspi";
import { redirect } from "next/navigation";

export async function publishEventAction(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const event = await prisma.event.findFirst({
    where: { id: eventId, userId: session.user.id },
    include: { template: true },
  });
  if (!event) return { error: "Event not found" };
  if (event.status === "PUBLISHED") return { error: "Already published" };

  const price = TEMPLATE_PRICING[event.template.category] ?? 0;

  // Free templates — publish directly
  if (price === 0) {
    await prisma.event.update({
      where: { id: eventId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
    return { success: true, published: true };
  }

  // Check for existing completed payment
  const existingPayment = await prisma.payment.findFirst({
    where: { eventId, status: "COMPLETED" },
  });

  if (existingPayment) {
    await prisma.event.update({
      where: { id: eventId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
    return { success: true, published: true };
  }

  // Mock mode — auto-complete payment
  if (isMockMode()) {
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        eventId,
        amount: price,
        currency: "KZT",
        kaspiRef: `mock-${nanoid(8)}`,
        status: "COMPLETED",
      },
    });
    await prisma.event.update({
      where: { id: eventId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
    return { success: true, published: true };
  }

  // Create Kaspi Pay order
  const orderId = nanoid(12);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      eventId,
      amount: price,
      currency: "KZT",
      kaspiRef: orderId,
      status: "PENDING",
    },
  });

  const order = await createKaspiOrder({
    amount: price,
    description: `Toi Invite: ${event.title}`,
    orderId,
    callbackUrl: `${appUrl}/api/payments/kaspi/webhook`,
    returnUrl: `${appUrl}/dashboard/events/${eventId}/edit?payment=pending`,
  });

  return { success: true, payUrl: order.payUrl };
}

export async function getPaymentHistory(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.payment.findMany({
    where: { eventId, userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserPayments() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.payment.findMany({
    where: { userId: session.user.id },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });
}
