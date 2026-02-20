"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  locale: string;
}

export function LanguageSwitcher({ locale }: Props) {
  const pathname = usePathname();

  const switchTo = locale === "ru" ? "kk" : "ru";
  const switchLabel = locale === "ru" ? "ҚАЗ" : "РУС";

  // Replace the locale segment in the path
  const newPath = pathname.replace(`/${locale}/`, `/${switchTo}/`);

  return (
    <Link
      href={newPath}
      className="fixed left-6 top-6 z-50 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
    >
      {switchLabel}
    </Link>
  );
}
