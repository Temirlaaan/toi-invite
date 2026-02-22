"use client";

import { useState, useRef, useCallback, useMemo } from "react";
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

function FloatingParticles({ color }: { color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3,
        size: 3 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: -10,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: 0.3,
          }}
          animate={{ y: [0, -600], opacity: [0.3, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function WaxSeal({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
      style={{
        background: `radial-gradient(circle at 35% 35%, ${color}, ${color}CC)`,
      }}
    >
      <span className="text-lg font-bold text-white">{initials}</span>
    </div>
  );
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
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(() => {});
    }
  }, [musicUrl]);

  const initials = useMemo(() => {
    const words = title.split(/[\s&+,]+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return title.slice(0, 2).toUpperCase();
  }, [title]);

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
            <FloatingParticles color={primaryColor} />

            <motion.div
              className="relative w-full max-w-xs"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div
                className="relative overflow-hidden rounded-xl shadow-2xl"
                style={{ border: `2px solid ${primaryColor}30` }}
              >
                {/* 3D Envelope flap */}
                <motion.div
                  className="relative z-10 origin-top"
                  style={{ perspective: 800 }}
                >
                  <motion.div
                    className="h-24"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}25 0%, ${primaryColor}15 100%)`,
                      clipPath: "polygon(0 0, 50% 80%, 100% 0)",
                      transformOrigin: "top center",
                    }}
                    animate={{ rotateX: [0, 5, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                {/* Envelope body */}
                <div
                  className="px-8 pb-8 pt-2 text-center"
                  style={{ backgroundColor }}
                >
                  {/* SVG envelope icon */}
                  <svg
                    className="mx-auto mb-2"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <rect
                      x="4"
                      y="12"
                      width="40"
                      height="28"
                      rx="3"
                      stroke={primaryColor}
                      strokeWidth="2"
                      fill={`${primaryColor}10`}
                    />
                    <path
                      d="M4 15L24 30L44 15"
                      stroke={primaryColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 40L18 28"
                      stroke={primaryColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M44 40L30 28"
                      stroke={primaryColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <WaxSeal initials={initials} color={primaryColor} />

                  <p
                    className="mt-4 text-sm font-medium uppercase tracking-widest opacity-60"
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
                    className="mt-6 inline-flex h-12 items-center rounded-full px-10 text-sm font-medium text-white shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        `0 0 0 0 ${primaryColor}40`,
                        `0 0 0 12px ${primaryColor}00`,
                      ],
                    }}
                    transition={{
                      boxShadow: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      },
                    }}
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
