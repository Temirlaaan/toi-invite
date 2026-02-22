import type { TemplateConfig } from "@/types/template";

interface Props {
  config: TemplateConfig;
  customization: Record<string, unknown>;
  venueAddress: string | null;
  venueLat: number | null;
  venueLng: number | null;
  locale: string;
}

export function MapSection({
  config,
  customization,
  venueAddress,
  venueLat,
  venueLng,
  locale,
}: Props) {
  if (!venueLat || !venueLng) return null;

  const theme = config.theme;
  const venueName =
    typeof customization.venueName === "string"
      ? customization.venueName
      : null;

  const dgisUrl = `https://2gis.kz/almaty/geo/${venueLng},${venueLat}`;
  const yandexUrl = `https://yandex.kz/maps/?pt=${venueLng},${venueLat}&z=16&l=map`;
  const googleUrl = `https://www.google.com/maps?q=${venueLat},${venueLng}`;

  const mapLinks = [
    {
      label: "2GIS",
      href: dgisUrl,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 6V14M7 10H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Yandex Maps",
      href: yandexUrl,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2C6.686 2 4 4.686 4 8C4 12.5 10 18 10 18S16 12.5 16 8C16 4.686 13.314 2 10 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      label: "Google Maps",
      href: googleUrl,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2C6.686 2 4 4.686 4 8C4 12.5 10 18 10 18S16 12.5 16 8C16 4.686 13.314 2 10 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill={`currentColor`}
            fillOpacity="0.1"
          />
          <circle cx="10" cy="8" r="2" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <section
      className="px-6 py-12 text-center md:py-16"
      style={{ backgroundColor: theme.secondaryColor + "15" }}
    >
      {/* Location pin SVG */}
      <svg
        className="mx-auto mb-3"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 3C10.477 3 6 7.477 6 13C6 20 16 29 16 29S26 20 26 13C26 7.477 21.523 3 16 3Z"
          stroke={theme.primaryColor}
          strokeWidth="1.5"
          fill={`${theme.primaryColor}15`}
        />
        <circle cx="16" cy="13" r="3" stroke={theme.primaryColor} strokeWidth="1.5" />
      </svg>

      <h2
        className="mb-1 text-xl font-semibold"
        style={{ color: theme.textColor }}
      >
        {locale === "kk" ? "Мекенжай" : "Место проведения"}
      </h2>

      {venueName && (
        <p
          className="mb-1 text-2xl font-bold"
          style={{ color: theme.textColor }}
        >
          {venueName}
        </p>
      )}

      {venueAddress && (
        <p className="mb-6 opacity-70" style={{ color: theme.textColor }}>
          {venueAddress}
        </p>
      )}

      <div className="mx-auto flex max-w-xs flex-col gap-3">
        {mapLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-medium transition-all hover:shadow-md active:scale-[0.98]"
            style={{
              borderColor: `${theme.primaryColor}40`,
              color: theme.primaryColor,
            }}
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
