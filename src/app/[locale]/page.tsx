import Link from "next/link";
import { useTranslations } from "next-intl";

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
          <div className="mb-6 inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {t("badge")}
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
          </div>
        </div>

        {/* Mockup preview */}
        <div className="mx-auto mt-16 w-full max-w-4xl">
          <div className="overflow-hidden rounded-xl border bg-gradient-to-b from-muted/50 to-muted shadow-2xl">
            <div className="flex items-center gap-1.5 border-b px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-muted-foreground">toi-invite.kz</span>
            </div>
            <div className="p-8 text-center">
              <div className="mx-auto max-w-sm rounded-lg border bg-background p-6 shadow-sm">
                <p className="text-2xl">💌</p>
                <p className="mt-3 text-lg font-semibold">{t("mockupTitle")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("mockupDate")}</p>
                <div className="mt-4 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm text-primary-foreground">
                  {t("mockupButton")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold">{t("featuresTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("featuresSubtitle")}</p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(["templates", "rsvp", "kaspi", "maps"] as const).map((key) => (
              <div key={key} className="rounded-lg border bg-background p-6">
                <div className="text-3xl">{t(`feature_${key}_icon`)}</div>
                <h3 className="mt-4 font-semibold">{t(`feature_${key}_title`)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`feature_${key}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t px-4 py-20">
        <div className="mx-auto grid max-w-4xl gap-8 text-center sm:grid-cols-3">
          {(["templatesCount", "eventsCount", "languages"] as const).map((key) => (
            <div key={key}>
              <p className="text-4xl font-bold">{t(`stat_${key}_value`)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t(`stat_${key}_label`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary px-4 py-20 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold">{t("ctaTitle")}</h2>
        <p className="mx-auto mt-3 max-w-md opacity-90">{t("ctaSubtitle")}</p>
        <Link
          href="/templates"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-background px-6 text-sm font-medium text-foreground shadow hover:bg-background/90"
        >
          {t("ctaButton")}
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 text-center text-sm text-muted-foreground">
        &copy; 2026 Toi Invite. {t("footer")}
      </footer>
    </div>
  );
}
