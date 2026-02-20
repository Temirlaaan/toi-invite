import type { TemplateConfig } from "@/types/template";

interface Props {
  config: TemplateConfig;
  kaspiQrUrl: string | null;
  locale: string;
}

export function GiftSection({ config, kaspiQrUrl, locale }: Props) {
  if (!kaspiQrUrl) return null;

  const theme = config.theme;

  return (
    <section className="px-6 py-12 text-center md:py-16">
      <h2
        className="mb-2 text-xl font-semibold"
        style={{ color: theme.textColor }}
      >
        {locale === "kk" ? "Сыйлық" : "Подарок"}
      </h2>
      <p className="mb-6 text-sm opacity-70" style={{ color: theme.textColor }}>
        {locale === "kk"
          ? "Kaspi QR арқылы сыйлық жіберіңіз"
          : "Отправьте подарок через Kaspi QR"}
      </p>
      <a
        href={kaspiQrUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-full px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: theme.primaryColor }}
      >
        {locale === "kk" ? "Kaspi-де ашу" : "Открыть в Kaspi"}
      </a>
    </section>
  );
}
