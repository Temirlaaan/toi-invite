export type SectionType =
  | "hero"
  | "details"
  | "countdown"
  | "gallery"
  | "map"
  | "rsvp"
  | "gift"
  | "timeline";

export interface TemplateTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  accentFont?: string;
}

export interface HeroFields {
  backgroundImage: boolean;
  title: boolean;
  subtitle: boolean;
  overlay?: boolean;
}

export interface DetailsFields {
  date: boolean;
  time: boolean;
  venue: boolean;
  dressCode: boolean;
}

export interface GalleryFields {
  maxPhotos: number;
}

export interface GiftFields {
  kaspiQr: boolean;
}

export interface TemplateFields {
  hero: HeroFields;
  details: DetailsFields;
  gallery: GalleryFields;
  gift: GiftFields;
}

export type LayoutType = "scroll-vertical" | "scroll-horizontal" | "paginated";

export interface TemplateConfig {
  sections: SectionType[];
  theme: TemplateTheme;
  fields: TemplateFields;
  layout: LayoutType;
  hasEnvelope?: boolean;
  animationStyle?: "fade" | "slide" | "scale" | "none";
  heroVideoSupport?: boolean;
}
