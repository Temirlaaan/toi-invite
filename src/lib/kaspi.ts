import crypto from "crypto";

const KASPI_API_URL = process.env.KASPI_API_URL || "https://pay.kaspi.kz/api";
const KASPI_MERCHANT_ID = process.env.KASPI_MERCHANT_ID || "";
const KASPI_SECRET = process.env.KASPI_SECRET || "";
const KASPI_MOCK = process.env.KASPI_MOCK === "true";

export const TEMPLATE_PRICING: Record<string, number> = {
  FREE: 0,
  STANDARD: 2990,
  PREMIUM: 5990,
};

export function isMockMode() {
  return KASPI_MOCK;
}

export interface KaspiOrder {
  orderId: string;
  payUrl: string;
  amount: number;
}

export async function createKaspiOrder(data: {
  amount: number;
  description: string;
  orderId: string;
  callbackUrl: string;
  returnUrl: string;
}): Promise<KaspiOrder> {
  if (KASPI_MOCK) {
    return {
      orderId: data.orderId,
      payUrl: `${data.returnUrl}?mock=true&orderId=${data.orderId}`,
      amount: data.amount,
    };
  }

  const res = await fetch(`${KASPI_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KASPI_SECRET}`,
    },
    body: JSON.stringify({
      merchantId: KASPI_MERCHANT_ID,
      amount: data.amount,
      currency: "KZT",
      description: data.description,
      orderId: data.orderId,
      callbackUrl: data.callbackUrl,
      returnUrl: data.returnUrl,
    }),
  });

  if (!res.ok) {
    throw new Error(`Kaspi API error: ${res.status}`);
  }

  const json = await res.json();
  return {
    orderId: json.orderId,
    payUrl: json.payUrl,
    amount: data.amount,
  };
}

export function verifyKaspiWebhookSignature(
  body: string,
  signature: string
): boolean {
  if (KASPI_MOCK) return true;

  const expected = crypto
    .createHmac("sha256", KASPI_SECRET)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
