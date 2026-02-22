"use client";

import { useState } from "react";
import { submitRsvpAction } from "@/lib/rsvp-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TemplateConfig } from "@/types/template";

interface Props {
  config: TemplateConfig;
  eventId: string;
  guestToken?: string;
  guestName?: string;
  locale: string;
}

const STATUS_OPTIONS = [
  { value: "CONFIRMED", ru: "Приду", kk: "Келемін" },
  { value: "DECLINED", ru: "Не приду", kk: "Келе алмаймын" },
  { value: "MAYBE", ru: "Не уверен(а)", kk: "Белгісіз" },
];

export function RsvpSection({
  config,
  eventId,
  guestToken,
  guestName: initialName,
  locale,
}: Props) {
  const theme = config.theme;
  const [name, setName] = useState(initialName || "");
  const [status, setStatus] = useState("CONFIRMED");
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const t = {
    title: locale === "kk" ? "Қатысасыз ба?" : "Вы придёте?",
    name: locale === "kk" ? "Аты-жөніңіз" : "Ваше имя",
    guests: locale === "kk" ? "Қонақ саны" : "Количество гостей",
    message: locale === "kk" ? "Хабарлама (міндетті емес)" : "Сообщение (необязательно)",
    submit: locale === "kk" ? "Жіберу" : "Отправить",
    thanks: locale === "kk" ? "Рахмет! Жауабыңыз қабылданды." : "Спасибо! Ваш ответ принят.",
    change: locale === "kk" ? "Өзгерту" : "Изменить ответ",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);

    const result = await submitRsvpAction({
      eventId,
      guestToken,
      guestName: name,
      status,
      guestCount,
      message: message || undefined,
    });

    setPending(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <section
        className="px-6 py-12 text-center md:py-16"
        style={{ backgroundColor: theme.secondaryColor + "10" }}
      >
        <div className="mx-auto max-w-md">
          <div
            className="mb-4 text-4xl"
            style={{ color: theme.primaryColor }}
          >
            ✓
          </div>
          <p
            className="text-lg font-medium"
            style={{ color: theme.textColor }}
          >
            {t.thanks}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-sm underline opacity-60"
            style={{ color: theme.textColor }}
          >
            {t.change}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="px-6 py-12 md:py-16"
      style={{ backgroundColor: theme.secondaryColor + "10" }}
    >
      <div className="mx-auto max-w-md">
        <h2
          className="mb-6 text-center text-xl font-semibold"
          style={{ color: theme.textColor }}
        >
          {t.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" aria-label={t.title}>
          {error && (
            <p className="text-center text-sm text-red-500" role="alert">{error}</p>
          )}

          {/* Status selection */}
          <fieldset>
            <legend className="sr-only">{t.title}</legend>
            <div className="flex justify-center gap-2" role="radiogroup">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={status === opt.value}
                onClick={() => setStatus(opt.value)}
                className="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                style={
                  status === opt.value
                    ? {
                        backgroundColor: theme.primaryColor,
                        borderColor: theme.primaryColor,
                        color: "#fff",
                      }
                    : {
                        borderColor: theme.primaryColor + "40",
                        color: theme.textColor,
                      }
                }
              >
                {locale === "kk" ? opt.kk : opt.ru}
              </button>
            ))}
            </div>
          </fieldset>

          {/* Name (editable only for anonymous) */}
          {!guestToken && (
            <div className="space-y-2">
              <Label style={{ color: theme.textColor }}>{t.name}</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Guest count */}
          {status === "CONFIRMED" && (
            <div className="space-y-2">
              <Label style={{ color: theme.textColor }}>{t.guests}</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={guestCount}
                onChange={(e) =>
                  setGuestCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))
                }
              />
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label style={{ color: theme.textColor }}>{t.message}</Label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              maxLength={500}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full rounded-full"
            style={{
              backgroundColor: theme.primaryColor,
              color: "#fff",
            }}
          >
            {pending ? "..." : t.submit}
          </Button>
        </form>
      </div>
    </section>
  );
}
