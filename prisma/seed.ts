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
  hasEnvelope: true,
  animationStyle: "fade",
  heroVideoSupport: false,
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
    hero: { backgroundImage: true, title: true, subtitle: true, overlay: false },
    details: { date: true, time: true, venue: true, dressCode: false },
    gallery: { maxPhotos: 8 },
    gift: { kaspiQr: true },
  },
  layout: "scroll-vertical",
  hasEnvelope: true,
  animationStyle: "slide",
  heroVideoSupport: false,
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
    hero: { backgroundImage: false, title: true, subtitle: true, overlay: false },
    details: { date: true, time: true, venue: true, dressCode: false },
    gallery: { maxPhotos: 6 },
    gift: { kaspiQr: false },
  },
  layout: "scroll-vertical",
  hasEnvelope: false,
  animationStyle: "fade",
  heroVideoSupport: false,
};

const nationalWedding: TemplateConfig = {
  sections: ["hero", "details", "countdown", "gallery", "map", "rsvp", "gift"],
  theme: {
    primaryColor: "#1B6B4A",
    secondaryColor: "#D4A843",
    backgroundColor: "#FFFEF5",
    textColor: "#2C3E2D",
    fontFamily: "Noto Serif",
    accentFont: "Playfair Display",
  },
  fields: {
    hero: { backgroundImage: true, title: true, subtitle: true, overlay: true },
    details: { date: true, time: true, venue: true, dressCode: true },
    gallery: { maxPhotos: 16 },
    gift: { kaspiQr: true },
  },
  layout: "scroll-vertical",
  hasEnvelope: true,
  animationStyle: "scale",
  heroVideoSupport: false,
};

const kidsParty: TemplateConfig = {
  sections: ["hero", "details", "countdown", "timeline", "gallery", "map", "rsvp", "gift"],
  theme: {
    primaryColor: "#6C63FF",
    secondaryColor: "#FF6B9D",
    backgroundColor: "#FFF5F9",
    textColor: "#2D2B55",
    fontFamily: "Nunito",
    accentFont: "Baloo 2",
  },
  fields: {
    hero: { backgroundImage: true, title: true, subtitle: true, overlay: false },
    details: { date: true, time: true, venue: true, dressCode: false },
    gallery: { maxPhotos: 10 },
    gift: { kaspiQr: true },
  },
  layout: "scroll-vertical",
  hasEnvelope: false,
  animationStyle: "slide",
  heroVideoSupport: false,
};

const cinematic: TemplateConfig = {
  sections: ["hero", "details", "countdown", "gallery", "map", "rsvp", "gift"],
  theme: {
    primaryColor: "#C9A84C",
    secondaryColor: "#8B7D3C",
    backgroundColor: "#0D0D0D",
    textColor: "#F5F5F5",
    fontFamily: "Montserrat",
    accentFont: "Cinzel",
  },
  fields: {
    hero: { backgroundImage: true, title: true, subtitle: true, overlay: true },
    details: { date: true, time: true, venue: true, dressCode: true },
    gallery: { maxPhotos: 12 },
    gift: { kaspiQr: true },
  },
  layout: "scroll-vertical",
  hasEnvelope: true,
  animationStyle: "fade",
  heroVideoSupport: true,
};

const goldenAnniversary: TemplateConfig = {
  sections: ["hero", "details", "countdown", "gallery", "map", "rsvp", "gift"],
  theme: {
    primaryColor: "#B8860B",
    secondaryColor: "#DAA520",
    backgroundColor: "#FFFDF5",
    textColor: "#3B2F1E",
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
  hasEnvelope: false,
  animationStyle: "fade",
  heroVideoSupport: false,
};

const romanticEngagement: TemplateConfig = {
  sections: ["hero", "details", "countdown", "gallery", "rsvp"],
  theme: {
    primaryColor: "#D4829C",
    secondaryColor: "#F2C6D4",
    backgroundColor: "#FFF5F8",
    textColor: "#4A2535",
    fontFamily: "Cormorant Garamond",
    accentFont: "Great Vibes",
  },
  fields: {
    hero: { backgroundImage: true, title: true, subtitle: true, overlay: false },
    details: { date: true, time: true, venue: true, dressCode: false },
    gallery: { maxPhotos: 8 },
  },
  layout: "scroll-vertical",
  hasEnvelope: true,
  animationStyle: "fade",
  heroVideoSupport: false,
};

const tusauKeser: TemplateConfig = {
  sections: ["hero", "details", "countdown", "timeline", "gallery", "map", "rsvp", "gift"],
  theme: {
    primaryColor: "#E8672A",
    secondaryColor: "#F4A63A",
    backgroundColor: "#FFFCF5",
    textColor: "#3A2312",
    fontFamily: "Nunito",
    accentFont: "Baloo 2",
  },
  fields: {
    hero: { backgroundImage: true, title: true, subtitle: true, overlay: false },
    details: { date: true, time: true, venue: true, dressCode: false },
    gallery: { maxPhotos: 10 },
    gift: { kaspiQr: true },
  },
  layout: "scroll-vertical",
  hasEnvelope: false,
  animationStyle: "slide",
  heroVideoSupport: false,
};

const corporateEvent: TemplateConfig = {
  sections: ["hero", "details", "countdown", "timeline", "map", "rsvp"],
  theme: {
    primaryColor: "#1B2A4A",
    secondaryColor: "#4A6FA5",
    backgroundColor: "#FFFFFF",
    textColor: "#1A1A1A",
    fontFamily: "Inter",
  },
  fields: {
    hero: { backgroundImage: false, title: true, subtitle: true, overlay: false },
    details: { date: true, time: true, venue: true, dressCode: false },
    gallery: { maxPhotos: 0 },
  },
  layout: "scroll-vertical",
  hasEnvelope: false,
  animationStyle: "fade",
  heroVideoSupport: false,
};

const templates = [
  {
    name: "Classic Elegance",
    slug: "classic-wedding",
    eventType: "WEDDING" as const,
    category: "PREMIUM" as const,
    config: classicWedding,
  },
  {
    name: "Modern Love",
    slug: "modern-wedding",
    eventType: "WEDDING" as const,
    category: "STANDARD" as const,
    config: modernWedding,
  },
  {
    name: "Minimal & Clean",
    slug: "minimal-wedding",
    eventType: "WEDDING" as const,
    category: "FREE" as const,
    config: minimalWedding,
  },
  {
    name: "Ұлттық / National",
    slug: "national-wedding",
    eventType: "WEDDING" as const,
    category: "PREMIUM" as const,
    config: nationalWedding,
  },
  {
    name: "Kids Party / Timeline",
    slug: "kids-party",
    eventType: "KIDS" as const,
    category: "STANDARD" as const,
    config: kidsParty,
  },
  {
    name: "Cinematic",
    slug: "cinematic",
    eventType: "WEDDING" as const,
    category: "PREMIUM" as const,
    config: cinematic,
  },
  {
    name: "Golden Anniversary",
    slug: "golden-anniversary",
    eventType: "ANNIVERSARY" as const,
    category: "STANDARD" as const,
    config: goldenAnniversary,
  },
  {
    name: "Romantic Engagement",
    slug: "romantic-engagement",
    eventType: "ENGAGEMENT" as const,
    category: "FREE" as const,
    config: romanticEngagement,
  },
  {
    name: "Тұсау Кесер",
    slug: "tusau-keser",
    eventType: "KIDS" as const,
    category: "STANDARD" as const,
    config: tusauKeser,
  },
  {
    name: "Business Event",
    slug: "corporate-event",
    eventType: "CORPORATE" as const,
    category: "STANDARD" as const,
    config: corporateEvent,
  },
];

async function main() {
  console.log("Seeding templates...");

  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: { configJson: t.config as unknown as Record<string, unknown> },
      create: {
        name: t.name,
        slug: t.slug,
        eventType: t.eventType,
        category: t.category,
        configJson: t.config as unknown as Record<string, unknown>,
        thumbnailUrl: `/templates/${t.slug}-thumb.jpg`,
        previewImages: [
          `/templates/${t.slug}-1.jpg`,
          `/templates/${t.slug}-2.jpg`,
        ],
      },
    });
  }

  console.log(`✅ Seeded ${templates.length} templates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
