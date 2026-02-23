"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedDiv({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target);
    if (isNaN(num)) {
      setDisplay(target);
      return;
    }
    let current = 0;
    const step = Math.ceil(num / 30);
    const interval = setInterval(() => {
      current += step;
      if (current >= num) {
        current = num;
        clearInterval(interval);
      }
      setDisplay(current + suffix);
    }, 30);
    return () => clearInterval(interval);
  }, [inView, target, suffix]);

  return <span ref={ref}>{inView ? display : "0" + suffix}</span>;
}

export default function Home() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold tracking-tight">Toi Invite</span>
          <div className="flex items-center gap-4">
            <Link
              href="/templates"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {tc("templates")}
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {tc("signIn")}
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {tc("signUp")}
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            {t("badge")}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href="/templates"
              className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              {t("cta")}
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center rounded-full border px-6 text-sm font-medium hover:bg-muted"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </div>

        {/* Phone Frame Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mx-auto mt-16 w-full max-w-sm"
          style={{
            perspective: "1000px",
          }}
        >
          <div
            className="relative mx-auto w-[280px] rounded-[2.5rem] border-[6px] border-gray-900 bg-gray-900 p-2 shadow-2xl"
            style={{
              transform: "rotateY(-5deg) rotateX(2deg)",
            }}
          >
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-3 z-10 h-[22px] w-[80px] -translate-x-1/2 rounded-full bg-gray-900" />

            {/* Screen */}
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-rose-50 to-amber-50">
              <div className="flex flex-col items-center px-5 pb-8 pt-12">
                <p className="text-3xl">💌</p>
                <p className="mt-4 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  {t("mockupButton")}
                </p>
                <div className="my-4 h-px w-12 bg-rose-300/60" />
                <p className="text-center text-lg font-semibold text-gray-900">
                  {t("mockupTitle")}
                </p>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {t("mockupDate")}
                </p>
                <div className="mt-6 inline-flex h-9 items-center rounded-full bg-primary px-5 text-xs font-medium text-primary-foreground shadow-sm">
                  RSVP
                </div>
                <div className="mt-4 flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-xs">
                    📍
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-xs">
                    💳
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-xs">
                    🎵
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="border-t px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <AnimatedDiv className="text-center">
            <h2 className="text-3xl font-bold">{t("howItWorksTitle")}</h2>
            <p className="mt-3 text-muted-foreground">
              {t("howItWorksSubtitle")}
            </p>
          </AnimatedDiv>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {(["step1", "step2", "step3"] as const).map((step, i) => (
              <AnimatedDiv key={step} delay={i * 0.15} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {t(`${step}_number`)}
                </div>
                {i < 2 && (
                  <div className="mx-auto mt-2 hidden h-0.5 w-full max-w-[80px] bg-gradient-to-r from-primary/40 to-transparent sm:block" />
                )}
                <h3 className="mt-4 text-lg font-semibold">
                  {t(`${step}_title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`${step}_desc`)}
                </p>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <AnimatedDiv className="text-center">
            <h2 className="text-3xl font-bold">{t("featuresTitle")}</h2>
            <p className="mt-3 text-muted-foreground">
              {t("featuresSubtitle")}
            </p>
          </AnimatedDiv>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(["templates", "rsvp", "kaspi", "maps"] as const).map(
              (key, i) => {
                const colors = [
                  "bg-rose-100 text-rose-600",
                  "bg-emerald-100 text-emerald-600",
                  "bg-blue-100 text-blue-600",
                  "bg-amber-100 text-amber-600",
                ];
                return (
                  <AnimatedDiv key={key} delay={i * 0.1}>
                    <div className="group rounded-lg border bg-background p-6 transition-shadow hover:shadow-lg hover:-translate-y-1 duration-300">
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-xl ${colors[i]}`}
                      >
                        {t(`feature_${key}_icon`)}
                      </div>
                      <h3 className="mt-4 font-semibold">
                        {t(`feature_${key}_title`)}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t(`feature_${key}_desc`)}
                      </p>
                    </div>
                  </AnimatedDiv>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t px-4 py-20">
        <div className="mx-auto grid max-w-4xl gap-8 text-center sm:grid-cols-3">
          {(["templatesCount", "eventsCount", "languages"] as const).map(
            (key, i) => {
              const value = t(`stat_${key}_value`);
              const hasNum = /^\d+/.test(value);
              const num = hasNum ? value.replace(/[^\d]/g, "") : "";
              const suffix = hasNum ? value.replace(/^\d+/, "") : "";

              return (
                <AnimatedDiv key={key} delay={i * 0.1}>
                  <p className="text-4xl font-bold">
                    {hasNum ? (
                      <CountUp target={num} suffix={suffix} />
                    ) : (
                      value
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(`stat_${key}_label`)}
                  </p>
                </AnimatedDiv>
              );
            }
          )}
        </div>
      </section>

      {/* Trust / Built for Kazakhstan */}
      <section className="border-t bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <AnimatedDiv className="text-center">
            <h2 className="text-2xl font-bold">{t("trustTitle")}</h2>
          </AnimatedDiv>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {(["kazakh", "kaspi", "maps", "templates"] as const).map(
              (key, i) => (
                <AnimatedDiv key={key} delay={i * 0.1}>
                  <div className="inline-flex items-center gap-2 rounded-full border bg-background px-5 py-2.5 text-sm font-medium shadow-sm">
                    {key === "kazakh" && "🇰🇿"}
                    {key === "kaspi" && "💳"}
                    {key === "maps" && "📍"}
                    {key === "templates" && "🎨"}
                    <span>{t(`trust_${key}`)}</span>
                  </div>
                </AnimatedDiv>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimatedDiv>
        <section className="border-t bg-primary px-4 py-20 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md opacity-90">
            {t("ctaSubtitle")}
          </p>
          <Link
            href="/templates"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-background px-6 text-sm font-medium text-foreground shadow hover:bg-background/90"
          >
            {t("ctaButton")}
          </Link>
        </section>
      </AnimatedDiv>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>&copy; 2026 Toi Invite. {t("footer")}</span>
          <div className="flex items-center gap-4">
            <Link href="/templates" className="hover:text-foreground">
              {tc("templates")}
            </Link>
            <Link href="/auth/signin" className="hover:text-foreground">
              {tc("signIn")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
