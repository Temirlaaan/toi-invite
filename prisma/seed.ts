import { PrismaClient } from "@prisma/client";
import type { TemplateConfig } from "../src/types/template";

const prisma = new PrismaClient();

const classicWedding: TemplateConfig = {
  sections: ["hero", "details", "countdown", "gallery", "map", "rsvp", "gift"],
  theme: {
    primaryColor: "#8B7355",
    secondaryColor: "#D4C5A9",
    backgroundColor: "#FDF8F0",
    textColor: "#3D3229",
    fontFamily: "Playfair Display",
    accentFont: "Great Vibes",
  },
  fields: {
    hero: { backgroundImage: true, title: true, subtitle: true, overlay: true },
    details: { date: true, time: true, venue: true, dressCode: true },
    gallery: { maxPhotos: 12 },
    gift: { kaspiQr: true },
  },
  layout: "scroll-vertical",
};

const modernWedding: TemplateConfig = {
  sections: ["hero", "details", "countdown", "gallery", "map", "rsvp", "gift"],
  theme: {
    primaryColor: "#1A1A2E",
    secondaryColor: "#E94560",
    backgroundColor: "#FFFFFF",
    textColor: "#16213E",
    fontFamily: "Inter",
    accentFont: "Cormorant Garamond",
  },
  fields: {
    hero: {
      backgroundImage: true,
      title: true,
      subtitle: true,
      overlay: false,
    },
    details: { date: true, time: true, venue: true, dressCode: false },
    gallery: { maxPhotos: 8 },
    gift: { kaspiQr: true },
  },
  layout: "scroll-vertical",
};

const minimalWedding: TemplateConfig = {
  sections: ["hero", "details", "countdown", "gallery", "rsvp"],
  theme: {
    primaryColor: "#2D2D2D",
    secondaryColor: "#A8A8A8",
    backgroundColor: "#FAFAFA",
    textColor: "#333333",
    fontFamily: "DM Sans",
  },
  fields: {
    hero: {
      backgroundImage: false,
      title: true,
      subtitle: true,
      overlay: false,
    },
    details: { date: true, time: true, venue: true, dressCode: false },
    gallery: { maxPhotos: 6 },
    gift: { kaspiQr: false },
  },
  layout: "scroll-vertical",
};

async function main() {
  console.log("Seeding templates...");

  await prisma.template.upsert({
    where: { slug: "classic-wedding" },
    update: { configJson: classicWedding as unknown as Record<string, unknown> },
    create: {
      name: "Classic Elegance",
      slug: "classic-wedding",
      eventType: "WEDDING",
      category: "PREMIUM",
      configJson: classicWedding as unknown as Record<string, unknown>,
      thumbnailUrl: "/templates/classic-wedding-thumb.jpg",
      previewImages: [
        "/templates/classic-wedding-1.jpg",
        "/templates/classic-wedding-2.jpg",
      ],
    },
  });

  await prisma.template.upsert({
    where: { slug: "modern-wedding" },
    update: { configJson: modernWedding as unknown as Record<string, unknown> },
    create: {
      name: "Modern Love",
      slug: "modern-wedding",
      eventType: "WEDDING",
      category: "STANDARD",
      configJson: modernWedding as unknown as Record<string, unknown>,
      thumbnailUrl: "/templates/modern-wedding-thumb.jpg",
      previewImages: [
        "/templates/modern-wedding-1.jpg",
        "/templates/modern-wedding-2.jpg",
      ],
    },
  });

  await prisma.template.upsert({
    where: { slug: "minimal-wedding" },
    update: {
      configJson: minimalWedding as unknown as Record<string, unknown>,
    },
    create: {
      name: "Minimal & Clean",
      slug: "minimal-wedding",
      eventType: "WEDDING",
      category: "FREE",
      configJson: minimalWedding as unknown as Record<string, unknown>,
      thumbnailUrl: "/templates/minimal-wedding-thumb.jpg",
      previewImages: [
        "/templates/minimal-wedding-1.jpg",
        "/templates/minimal-wedding-2.jpg",
      ],
    },
  });

  console.log("✅ Seeded 3 wedding templates");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
