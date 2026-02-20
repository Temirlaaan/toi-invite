"use client";

import { useState } from "react";
import type { TemplateConfig } from "@/types/template";

interface MediaItem {
  id: string;
  s3Key: string;
  originalName: string;
}

interface Props {
  config: TemplateConfig;
  photos: MediaItem[];
  s3Endpoint: string;
  s3Bucket: string;
}

export function GallerySection({
  config,
  photos,
  s3Endpoint,
  s3Bucket,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const theme = config.theme;

  if (photos.length === 0) return null;

  const getUrl = (key: string) => `${s3Endpoint}/${s3Bucket}/${key}`;

  return (
    <section className="px-4 py-12 md:px-6 md:py-16">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            className="aspect-square overflow-hidden rounded-lg"
          >
            <img
              src={getUrl(photo.s3Key)}
              alt={photo.originalName}
              className="h-full w-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute right-4 top-4 text-3xl text-white"
            onClick={() => setLightboxIndex(null)}
          >
            &times;
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 text-3xl text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
            >
              &lsaquo;
            </button>
          )}

          <img
            src={getUrl(photos[lightboxIndex].s3Key)}
            alt={photos[lightboxIndex].originalName}
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {lightboxIndex < photos.length - 1 && (
            <button
              className="absolute right-4 text-3xl text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              style={{ right: "4rem" }}
            >
              &rsaquo;
            </button>
          )}
        </div>
      )}
    </section>
  );
}
