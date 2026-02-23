import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import type { EventType } from "@prisma/client";

const EVENT_TYPE_KEYS: Record<EventType, string> = {
  WEDDING: "wedding",
  ANNIVERSARY: "anniversary",
  KIDS: "kids",
  ENGAGEMENT: "engagement",
  CORPORATE: "corporate",
};

const CATEGORY_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  FREE: "outline",
  STANDARD: "secondary",
  PREMIUM: "default",
};

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const t = await getTranslations("templates");
  const { type } = await searchParams;

  const where = type && type !== "all" ? { eventType: type as EventType } : {};

  const templates = await prisma.template.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const filterTypes = ["all", "WEDDING", "ANNIVERSARY", "KIDS", "ENGAGEMENT", "CORPORATE"] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {filterTypes.map((filterType) => {
          const isActive =
            filterType === (type || "all") ||
            (!type && filterType === "all");
          const key =
            filterType === "all"
              ? "all"
              : EVENT_TYPE_KEYS[filterType as EventType];
          return (
            <Link
              key={filterType}
              href={`/templates${filterType !== "all" ? `?type=${filterType}` : ""}`}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
              }`}
            >
              {t(key)}
            </Link>
          );
        })}
      </div>

      {/* Grid */}
      {templates.length === 0 ? (
        <p className="text-center text-muted-foreground">{t("noTemplates")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/templates/${template.slug}`}
              className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[4/5] bg-muted">
                {template.thumbnailUrl && (
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundColor:
                        (template.configJson as Record<string, unknown>)
                          ?.theme &&
                        typeof (template.configJson as Record<string, unknown>)
                          .theme === "object"
                          ? (
                              (
                                template.configJson as Record<string, unknown>
                              ).theme as Record<string, string>
                            ).primaryColor
                          : "#ccc",
                    }}
                  >
                    <div className="flex h-full items-center justify-center text-white/80">
                      <span className="text-lg font-medium">
                        {template.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold group-hover:text-primary">
                    {template.name}
                  </h3>
                  <Badge variant={CATEGORY_VARIANT[template.category]}>
                    {t(template.category.toLowerCase())}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(EVENT_TYPE_KEYS[template.eventType])}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
