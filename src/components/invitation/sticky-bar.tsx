"use client";

import { useState, useEffect } from "react";

interface Props {
  primaryColor: string;
  locale: string;
  hasGift: boolean;
}

export function StickyBar({ primaryColor, locale, hasGift }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const rsvpSection = document.querySelector("section[data-section='rsvp']");
    if (!rsvpSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(rsvpSection);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(`section[data-section='${id}']`)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const t = {
    rsvp: locale === "kk" ? "RSVP" : "RSVP",
    gift: locale === "kk" ? "Сыйлық" : "Подарок",
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden">
      <div className="flex gap-3">
        <button
          onClick={() => scrollTo("rsvp")}
          className="flex-1 rounded-full py-2.5 text-center text-sm font-medium text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {t.rsvp}
        </button>
        {hasGift && (
          <button
            onClick={() => scrollTo("gift")}
            className="flex-1 rounded-full border py-2.5 text-center text-sm font-medium"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            {t.gift}
          </button>
        )}
      </div>
    </div>
  );
}
