import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { createEventAction } from "@/lib/event-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const t = await getTranslations("newEvent");
  const { template: templateSlug } = await searchParams;

  const templates = await prisma.template.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <form action={createEventAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateSlug">{t("selectTemplate")}</Label>
              <select
                id="templateSlug"
                name="templateSlug"
                defaultValue={templateSlug || ""}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="" disabled>
                  {t("selectTemplate")}
                </option>
                {templates.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.slug}>
                    {tmpl.name} ({tmpl.category.toLowerCase()})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">{t("eventName")}</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder={t("eventNamePlaceholder")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {t("create")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
