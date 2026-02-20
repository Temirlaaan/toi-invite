import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "secondary",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const t = await getTranslations("dashboard");

  const events = await prisma.event.findMany({
    where: { userId: session.user.id },
    include: { template: true, _count: { select: { guests: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/dashboard/events/new">{t("createEvent")}</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg text-muted-foreground">{t("noEvents")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("noEventsHint")}
          </p>
          <Button asChild className="mt-4">
            <Link href="/templates">{t("createEvent")}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium">{event.title}</h3>
                  <Badge variant={STATUS_VARIANT[event.status]}>
                    {t(event.status.toLowerCase())}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.template.name} &middot;{" "}
                  {event._count.guests} guests &middot;{" "}
                  {event.updatedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="ml-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/events/${event.id}/edit`}>
                    {t("edit")}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
