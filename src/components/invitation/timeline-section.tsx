import type { TemplateConfig } from "@/types/template";

interface TimelineItem {
  time: string;
  icon: string;
  title: string;
  description?: string;
}

interface Props {
  config: TemplateConfig;
  customization: Record<string, unknown>;
  locale: string;
}

export function TimelineSection({ config, customization, locale }: Props) {
  const theme = config.theme;

  let items: TimelineItem[] = [];
  try {
    const raw = customization.timeline;
    if (typeof raw === "string") {
      items = JSON.parse(raw);
    } else if (Array.isArray(raw)) {
      items = raw as TimelineItem[];
    }
  } catch {
    return null;
  }

  if (!items.length) return null;

  const heading = locale === "kk" ? "Бағдарлама" : "Программа";

  return (
    <section className="px-6 py-12 md:py-16" style={{ color: theme.textColor }}>
      <h2 className="mb-8 text-center text-xl font-semibold">{heading}</h2>

      <div className="relative mx-auto max-w-sm">
        {/* Vertical line */}
        <div
          className="absolute left-5 top-0 bottom-0 w-px"
          style={{ backgroundColor: `${theme.primaryColor}30` }}
        />

        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="relative flex items-start gap-4 pl-2">
              {/* Dot on the line */}
              <div
                className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
                style={{
                  backgroundColor: `${theme.primaryColor}15`,
                  border: `2px solid ${theme.primaryColor}`,
                }}
              >
                {item.icon || "•"}
              </div>

              <div className="flex-1 pt-0.5">
                <p
                  className="text-xs font-medium uppercase tracking-wider opacity-60"
                >
                  {item.time}
                </p>
                <p className="mt-0.5 font-semibold">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm opacity-70">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
