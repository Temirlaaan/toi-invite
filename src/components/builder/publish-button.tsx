"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { publishEventAction } from "@/lib/payment-actions";
import { Button } from "@/components/ui/button";

interface Props {
  eventId: string;
  status: string;
  templateCategory: string;
  price: number;
}

export function PublishButton({ eventId, status, templateCategory, price }: Props) {
  const t = useTranslations("publish");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "PUBLISHED") {
    return (
      <span className="text-sm font-medium text-green-600">
        {t("published")}
      </span>
    );
  }

  const handlePublish = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await publishEventAction(eventId);

      if (result && "error" in result && result.error) {
        setError(result.error);
        return;
      }

      if (result && "payUrl" in result && result.payUrl) {
        window.location.href = result.payUrl;
        return;
      }

      // Published directly (free or mock) — reload to reflect status
      window.location.reload();
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button onClick={handlePublish} disabled={loading} size="sm">
        {loading
          ? t("processing")
          : price > 0
            ? t("publishPaid", { price: price.toLocaleString() })
            : t("publishFree")}
      </Button>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
