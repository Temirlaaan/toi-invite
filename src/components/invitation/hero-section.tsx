import type { TemplateConfig } from "@/types/template";

interface Props {
  config: TemplateConfig;
  customization: Record<string, unknown>;
  title: string;
}

export function HeroSection({ config, customization, title }: Props) {
  const theme = config.theme;
  const heroTitle = (customization.heroTitle as string) || title;
  const heroSubtitle = (customization.heroSubtitle as string) || "";

  return (
    <section
      className="flex min-h-[80vh] flex-col items-center justify-center p-8 text-center text-white"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <h1
        className="text-4xl font-bold leading-tight md:text-5xl"
        style={{ fontFamily: theme.accentFont || theme.fontFamily }}
      >
        {heroTitle}
      </h1>
      {heroSubtitle && (
        <p className="mt-4 text-lg text-white/80 md:text-xl">{heroSubtitle}</p>
      )}
    </section>
  );
}
