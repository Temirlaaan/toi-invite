---
name: phase2-commercial-readiness
description: Commercial Readiness & UX Polish - Transform MVP into launch-ready product
status: in-progress
created: 2026-02-22T10:32:05Z
updated: 2026-02-22T10:32:05Z
---

# Phase 2: Commercial Readiness & UX Polish

## Overview
Transform the working MVP into a commercially viable, visually impressive product. Focus on guest-facing "wow" factor, expanded template library, organizer workflow improvements, and core platform polish.

## Goals
1. Create a memorable guest experience with animations and interactions
2. Expand template variety to cover weddings, kids parties, and cinematic events
3. Improve organizer tools (seating, exports)
4. Build a premium landing page that converts visitors
5. Complete auth flows

## Requirements

### 1. Guest UI & "Wow" Factor

#### 1.1 Envelope Animation
- Guests land on a digital envelope with an "Open" button
- Clicking plays an opening animation (CSS/Framer Motion)
- Automatically starts background music on click (bypasses autoplay)
- Envelope design adapts to template theme colors

#### 1.2 Scroll Animations
- Fade-up/slide-in animations for all invitation sections
- Staggered animation timing for visual flow
- Respect `prefers-reduced-motion` for accessibility

#### 1.3 Sticky Bottom Bar (Mobile)
- Fixed bottom bar on guest pages (mobile only)
- Quick "RSVP" and "Send Gift" buttons
- Smooth scroll to respective sections on tap
- Auto-hides when RSVP section is visible

#### 1.4 Dynamic OpenGraph Images
- `opengraph-image.tsx` using `@vercel/og` or `ImageResponse`
- Shows couple names, event date, and hero image
- Beautiful WhatsApp/Telegram preview cards
- Per-event dynamic generation at `/e/[slug]/opengraph-image`

### 2. Expanded Templates & Config

#### 2.1 Template Config Expansion
- Add to `TemplateConfig`: `hasEnvelope: boolean`, `animationStyle: string`, `heroVideoSupport: boolean`
- Backward compatible with existing templates

#### 2.2 New Templates
- **"Ұлттық" (National)**: Emerald/gold theme, Kazakh ornaments, for Kyz Uzatu / Syrga Salu ceremonies
- **"Kids Party / Timeline"**: Pastel blue/pink, rounded fonts, vertical timeline section for 1 Zhas / Tusau Keser
- **"Cinematic"**: Dark theme, bold modern typography, video background support

### 3. Organizer Dashboard Enhancements

#### 3.1 Seating Chart
- Assign table numbers to confirmed RSVPs
- Editable table number field in guest list
- Filter/group guests by table number

#### 3.2 CSV Export Enhancement
- Already exists — verify it works correctly with table numbers included

### 4. Platform Core

#### 4.1 Landing Page
- Premium SaaS landing page at `src/app/[locale]/page.tsx`
- Hero section with animated mockup/preview
- Features grid: Kaspi Pay integration, Maps, RSVP tracking, Templates
- Social proof / stats section
- Clear CTA buttons → templates gallery

#### 4.2 Password Reset Flow
- Implement reset token generation and validation
- Mock email sending via `console.log` (prepare for Resend integration)
- Token expiry (1 hour)
- Complete the existing reset-password page flow

## Technical Notes
- Use Framer Motion for animations (lightweight, React-native)
- `@vercel/og` for OG image generation
- Template config changes must be backward compatible
- All new UI strings in both kk and ru
