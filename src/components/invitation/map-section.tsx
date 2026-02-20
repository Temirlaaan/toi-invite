import type { TemplateConfig } from "@/types/template";

interface Props {
  config: TemplateConfig;
  venueAddress: string | null;
  venueLat: number | null;
  venueLng: number | null;
  locale: string;
}

export function MapSection({
  config,
  venueAddress,
  venueLat,
  venueLng,
  locale,
}: Props) {
  if (!venueLat || !venueLng) return null;

  const theme = config.theme;
  const label = locale === "kk" ? "Картадан ашу" : "Открыть на карте";

  const dgisUrl = `https://2gis.kz/almaty/geo/${venueLng},${venueLat}`;
  const yandexUrl = `https://yandex.kz/maps/?pt=${venueLng},${venueLat}&z=16&l=map`;
  const googleUrl = `https://www.google.com/maps?q=${venueLat},${venueLng}`;

  return (
    <section
      className="px-6 py-12 text-center md:py-16"
      style={{ backgroundColor: theme.secondaryColor + "15" }}
    >
      <h2
        className="mb-6 text-xl font-semibold"
        style={{ color: theme.textColor }}
      >
        {locale === "kk" ? "Мекенжай" : "Место проведения"}
      </h2>
      {venueAddress && (
        <p className="mb-6" style={{ color: theme.textColor }}>
          {venueAddress}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href={dgisUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:opacity-80"
          style={{
            borderColor: theme.primaryColor,
            color: theme.primaryColor,
          }}
        >
          2GIS
        </a>
        <a
          href={yandexUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:opacity-80"
          style={{
            borderColor: theme.primaryColor,
            color: theme.primaryColor,
          }}
        >
          Yandex Maps
        </a>
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:opacity-80"
          style={{
            borderColor: theme.primaryColor,
            color: theme.primaryColor,
          }}
        >
          Google Maps
        </a>
      </div>
    </section>
  );
}
