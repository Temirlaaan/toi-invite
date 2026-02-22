import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getUserPayments } from "@/lib/payment-actions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  COMPLETED: "default",
  FAILED: "destructive",
};

export default async function PaymentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const t = await getTranslations("payments");
  const payments = await getUserPayments();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">{t("back")}</Link>
        </Button>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t("noPayments")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">
                  {payment.event.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {payment.createdAt.toLocaleDateString()} &middot;{" "}
                  {payment.amount.toLocaleString()} {payment.currency}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[payment.status]}>
                {t(payment.status.toLowerCase())}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
