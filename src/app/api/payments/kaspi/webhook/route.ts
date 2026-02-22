import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyKaspiWebhookSignature } from "@/lib/kaspi";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-kaspi-signature") ?? "";

  if (!verifyKaspiWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const data = JSON.parse(body) as {
    orderId: string;
    status: string;
    transactionId?: string;
  };

  const payment = await prisma.payment.findFirst({
    where: { kaspiRef: data.orderId },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  if (data.status === "completed" || data.status === "success") {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "COMPLETED" },
      }),
      prisma.event.update({
        where: { id: payment.eventId },
        data: { status: "PUBLISHED", publishedAt: new Date() },
      }),
    ]);
  } else if (data.status === "failed" || data.status === "cancelled") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.json({ ok: true });
}
