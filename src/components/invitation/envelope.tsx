"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  title: string;
  musicUrl?: string | null;
  locale: string;
  children: React.ReactNode;
}

export function Envelope({
  primaryColor,
  backgroundColor,
  textColor,
  title,
  musicUrl,
  locale,
  children,
}: Props) {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = useCallback(() => {
    setOpened(true);
    // Start music on user interaction — bypasses autoplay restrictions
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(() => {});
    }
  }, [musicUrl]);

  const t = {
    open: locale === "kk" ? "Ашу" : "Открыть",
    invitation: locale === "kk" ? "Сізге шақыру" : "Вам приглашение",
  };

  return (
    <>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="envelope"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
            style={{ backgroundColor }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Envelope body */}
            <motion.div
              className="relative w-full max-w-xs"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Envelope shape */}
              <div
                className="relative overflow-hidden rounded-lg shadow-2xl"
                style={{ border: `2px solid ${primaryColor}30` }}
              >
                {/* Flap */}
                <div
                  className="h-20"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}10 100%)`,
                    clipPath: "polygon(0 0, 50% 70%, 100% 0)",
                  }}
                />

                {/* Body */}
                <div className="px-8 pb-8 pt-4 text-center" style={{ backgroundColor }}>
                  <p className="text-3xl">💌</p>
                  <p
                    className="mt-3 text-sm font-medium uppercase tracking-widest opacity-60"
                    style={{ color: textColor }}
                  >
                    {t.invitation}
                  </p>
                  <p
                    className="mt-2 text-xl font-semibold"
                    style={{ color: textColor }}
                  >
                    {title}
                  </p>

                  <motion.button
                    onClick={handleOpen}
                    className="mt-6 inline-flex h-11 items-center rounded-full px-8 text-sm font-medium text-white shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.open}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
