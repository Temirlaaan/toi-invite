"use client";

import { useState, useEffect } from "react";
import type { TemplateConfig } from "@/types/template";

interface Props {
  config: TemplateConfig;
  eventDate: string;
  locale: string;
}

export function CountdownSection({ config, eventDate, locale }: Props) {
  const theme = config.theme;
  const target = new Date(eventDate).getTime();

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const labels =
    locale === "kk"
      ? { d: "күн", h: "сағат", m: "мин", s: "сек" }
      : { d: "дней", h: "часов", m: "мин", s: "сек" };

  if (diff === 0) return null;

  return (
    <section
      className="px-6 py-10 text-center"
      style={{ backgroundColor: theme.secondaryColor + "20" }}
    >
      <div className="flex justify-center gap-6">
        {[
          { value: days, label: labels.d },
          { value: hours, label: labels.h },
          { value: minutes, label: labels.m },
          { value: seconds, label: labels.s },
        ].map((item) => (
          <div key={item.label}>
            <p
              className="text-3xl font-bold md:text-4xl"
              style={{ color: theme.primaryColor }}
            >
              {String(item.value).padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider opacity-60">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
