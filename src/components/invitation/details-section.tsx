import type { TemplateConfig } from "@/types/template";

interface Props {
  config: TemplateConfig;
  customization: Record<string, unknown>;
  eventDate: Date | null;
  venueAddress: string | null;
  locale: string;
}

export function DetailsSection({
  config,
  customization,
  eventDate,
  venueAddress,
  locale,
}: Props) {
  const theme = config.theme;

  const dateStr = eventDate
    ? eventDate.toLocaleDateString(locale === "kk" ? "kk-KZ" : "ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const timeStr = eventDate
    ? eventDate.toLocaleTimeString(locale === "kk" ? "kk-KZ" : "ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const dressCode =
    typeof customization.dressCode === "string"
      ? customization.dressCode
      : null;

  return (
    <section
      className="px-6 py-12 text-center md:py-16"
      style={{ color: theme.textColor }}
    >
      {dateStr && (
        <p className="text-2xl font-semibold md:text-3xl">{dateStr}</p>
      )}
      {timeStr && (
        <p className="mt-2 text-lg text-muted-foreground">{timeStr}</p>
      )}
      {venueAddress && <p className="mt-4 text-lg">{venueAddress}</p>}
      {dressCode && (
        <p className="mt-4 text-sm italic opacity-70">
          Dress code: {dressCode}
        </p>
      )}
    </section>
  );
}
