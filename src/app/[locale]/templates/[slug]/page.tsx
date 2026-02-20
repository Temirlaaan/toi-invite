import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TemplateConfig, SectionType } from "@/types/template";

const SECTION_LABELS: Record<SectionType, { ru: string; kk: string }> = {
  hero: { ru: "Главный баннер", kk: "Басты баннер" },
  details: { ru: "Детали", kk: "Мәліметтер" },
  countdown: { ru: "Обратный отсчёт", kk: "Кері санақ" },
  gallery: { ru: "Галерея", kk: "Галерея" },
  map: { ru: "Карта", kk: "Карта" },
  rsvp: { ru: "RSVP", kk: "RSVP" },
  gift: { ru: "Подарок", kk: "Сыйлық" },
};

const CATEGORY_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  FREE: "outline",
  STANDARD: "secondary",
  PREMIUM: "default",
};

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("templates");

  const template = await prisma.template.findUnique({
    where: { slug },
  });

  if (!template) notFound();

  const config = template.configJson as unknown as TemplateConfig;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/templates"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; {t("title")}
      </Link>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        {/* Preview */}
        <div
          className="overflow-hidden rounded-lg border"
          style={{ backgroundColor: config.theme.backgroundColor }}
        >
          {/* Hero section preview */}
          <div
            className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center"
            style={{ backgroundColor: config.theme.primaryColor }}
          >
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: config.theme.accentFont || config.theme.fontFamily }}
            >
              Айгерім & Нұрлан
            </h2>
            <p className="mt-2 text-lg text-white/80">
              Біздің тойға шақырамыз
            </p>
          </div>

          {/* Details preview */}
          <div className="space-y-4 p-8 text-center" style={{ color: config.theme.textColor }}>
            <h3 className="text-xl font-semibold">15 маусым, 2026</h3>
            <p>Алматы, Almaty Towers</p>
            <p className="text-sm text-muted-foreground">18:00</p>
          </div>

          {/* Sections indicator */}
          <div className="border-t p-6">
            <div className="flex flex-wrap justify-center gap-2">
              {config.sections.map((section) => (
                <span
                  key={section}
                  className="rounded-full border px-3 py-1 text-xs"
                  style={{
                    borderColor: config.theme.primaryColor,
                    color: config.theme.primaryColor,
                  }}
                >
                  {SECTION_LABELS[section]?.[locale as "ru" | "kk"] || section}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Info sidebar */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <div className="mt-2 flex gap-2">
              <Badge variant={CATEGORY_VARIANT[template.category]}>
                {t(template.category.toLowerCase())}
              </Badge>
              <Badge variant="outline">
                {t(template.eventType.toLowerCase())}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">{t("sections")}</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {config.sections.map((section) => (
                <li key={section}>
                  {SECTION_LABELS[section]?.[locale as "ru" | "kk"] || section}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Font:</span>
              <span className="text-muted-foreground">
                {config.theme.fontFamily}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Colors:</span>
              <div className="flex gap-1">
                <span
                  className="inline-block h-5 w-5 rounded-full border"
                  style={{ backgroundColor: config.theme.primaryColor }}
                />
                <span
                  className="inline-block h-5 w-5 rounded-full border"
                  style={{ backgroundColor: config.theme.secondaryColor }}
                />
                <span
                  className="inline-block h-5 w-5 rounded-full border"
                  style={{ backgroundColor: config.theme.backgroundColor }}
                />
              </div>
            </div>
          </div>

          <Button asChild className="w-full">
            <Link href={`/dashboard/events/new?template=${template.slug}`}>
              {t("useTemplate")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
