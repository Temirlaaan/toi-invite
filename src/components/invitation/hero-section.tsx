"use client";

import { motion } from "framer-motion";
import type { TemplateConfig } from "@/types/template";

interface Props {
  config: TemplateConfig;
  customization: Record<string, unknown>;
  title: string;
  guestName?: string;
}

function OrnamentalDivider({ color }: { color: string }) {
  return (
    <svg
      className="mx-auto my-4"
      width="120"
      height="20"
      viewBox="0 0 120 20"
      fill="none"
    >
      <path
        d="M0 10H45M75 10H120"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.6"
      />
      <path
        d="M50 10C50 7 53 4 56 4C59 4 60 7 60 10C60 7 61 4 64 4C67 4 70 7 70 10C70 13 67 16 64 16C61 16 60 13 60 10C60 13 59 16 56 16C53 16 50 13 50 10Z"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.5"
        fill="none"
      />
    </svg>
  );
}

function ScrollIndicator({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 5V19M12 19L5 12M12 19L19 12"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );
}

export function HeroSection({ config, customization, title, guestName }: Props) {
  const theme = config.theme;
  const heroTitle = (customization.heroTitle as string) || title;
  const heroSubtitle = (customization.heroSubtitle as string) || "";
  const bgImage = customization.heroBackgroundImage as string | undefined;

  const dearLabel = guestName
    ? config.theme.fontFamily // just check locale from subtitle hints
      ? `${guestName}`
      : guestName
    : null;

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center p-8 text-center text-white"
      style={{
        backgroundColor: theme.primaryColor,
        ...(bgImage && {
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }),
      }}
    >
      {/* Overlay gradient when background image exists */}
      {bgImage && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${theme.primaryColor}CC, ${theme.primaryColor}99)`,
          }}
        />
      )}

      <div className="relative z-10">
        {dearLabel && (
          <motion.p
            className="mb-4 text-base font-light tracking-wide text-white/80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {dearLabel}
          </motion.p>
        )}

        <motion.h1
          className="text-4xl font-bold leading-tight md:text-5xl"
          style={{ fontFamily: theme.accentFont || theme.fontFamily }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {heroTitle}
        </motion.h1>

        {heroSubtitle && (
          <>
            <OrnamentalDivider color="rgba(255,255,255,0.6)" />
            <motion.p
              className="text-lg text-white/80 md:text-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {heroSubtitle}
            </motion.p>
          </>
        )}
      </div>

      <ScrollIndicator color="rgba(255,255,255,0.6)" />
    </section>
  );
}
