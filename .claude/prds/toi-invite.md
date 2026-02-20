---
name: toi-invite
description: Template-based SaaS platform for creating digital invitations targeting the Central Asian (Kazakhstan) market
status: backlog
created: 2026-02-20T15:01:00Z
---

# PRD: toi-invite

## Executive Summary

**toi-invite** is a template-based SaaS website builder for creating premium digital invitations, targeting the Central Asian market (Kazakhstan). Users select pre-made layouts, customize them with personal media and text, and publish shareable invitation links. The platform supports weddings, anniversaries, and kids' parties with a freemium monetization model — build and preview for free, pay to publish.

The product is mobile-first with multi-language support (Kazakh and Russian), integrates with local services (Kaspi Pay, Kaspi QR, 2GIS/Yandex Maps), and provides organizers with a dashboard to manage RSVPs and guest analytics.

## Problem Statement

In Kazakhstan and Central Asia, event organizers (especially for weddings) still rely on paper invitations, generic WhatsApp messages, or basic social media posts to invite guests. Existing international digital invitation platforms (e.g., Zola, Paperless Post) do not cater to the local market — they lack Kazakh/Russian language support, local payment integration (Kaspi), and culturally relevant templates.

**Why now:** Digital adoption in Kazakhstan is accelerating rapidly. Kaspi has become the dominant payment and lifestyle app. There is a gap for a locally-focused, premium digital invitation platform that feels native to the market.

## User Personas

### Persona 1: Event Organizer (Primary)
- **Who:** Couples planning weddings, parents organizing kids' parties, families celebrating anniversaries
- **Age:** 22–45
- **Tech comfort:** Moderate — uses smartphones daily, comfortable with Kaspi and messaging apps
- **Goal:** Create a beautiful, shareable digital invitation quickly without design skills
- **Pain points:** Paper invitations are expensive and slow; tracking RSVPs manually is tedious; existing tools are not in Kazakh/Russian

### Persona 2: Guest (End User)
- **Who:** Friends and family members receiving invitations
- **Age:** 18–65
- **Tech comfort:** Low to moderate — primarily mobile, may not install apps
- **Goal:** View invitation details, RSVP easily, find venue location, optionally send a gift
- **Pain points:** Confusing RSVP processes, unclear event details, can't find venue on local maps

## User Stories

### Organizer Stories

**US-1: Template Selection**
As an organizer, I want to browse and preview invitation templates so I can choose one that matches my event style.
- Acceptance: Can filter templates by event type (wedding, anniversary, kids' party). Can preview templates before selecting. Templates show visual thumbnail and description.

**US-2: Invitation Customization**
As an organizer, I want to customize the selected template with my event details, photos, videos, and background music so the invitation feels personal.
- Acceptance: Can edit text fields (names, date, venue, message) in Kazakh or Russian. Can upload photos and videos. Can upload or select background music. Can customize colors/accent themes. Live preview of changes.

**US-3: Free Preview**
As an organizer, I want to preview my completed invitation for free before deciding to publish.
- Acceptance: Full interactive preview available without payment. Clear indication that publishing requires purchase. No watermarks on preview (paywall is on link generation only).

**US-4: Template Purchase & Publishing**
As an organizer, I want to pay for a template via Kaspi Pay to publish my invitation and get shareable links.
- Acceptance: Kaspi Pay integration for one-time template purchase. After payment, a unique event URL is generated. Personalized guest links are available. Event URL follows format: `domain.kz/event-slug`.

**US-5: Guest Link Sharing**
As an organizer, I want to share invitation links via WhatsApp, Telegram, and other messaging apps with rich previews.
- Acceptance: Open Graph meta tags for rich link previews. Personalized links with guest name pre-filled. Bulk link generation for guest list. Copy-to-clipboard functionality.

**US-6: RSVP Tracking Dashboard**
As an organizer, I want to view and manage guest RSVPs from a dashboard so I can plan accordingly.
- Acceptance: Dashboard shows total invited, confirmed, declined, pending. Guest list with individual RSVP status and guest count. Export guest list (CSV). Real-time updates.

**US-7: Event Analytics**
As an organizer, I want to see how many people viewed my invitation so I can follow up with non-responders.
- Acceptance: View count per invitation link. RSVP conversion rate. Last viewed timestamp per guest.

### Guest Stories

**US-8: View Invitation**
As a guest, I want to open the invitation link on my phone and see a beautiful, fast-loading event page.
- Acceptance: Mobile-first responsive design. Loads in under 3 seconds on 4G. Event details clearly displayed (date, time, venue, dress code). Countdown timer to event.

**US-9: RSVP Submission**
As a guest, I want to RSVP with my attendance status and number of guests.
- Acceptance: Simple form: attending (yes/no/maybe), number of guests, optional message. Name pre-filled if using personalized link. Confirmation shown after submission. Can update RSVP later.

**US-10: Venue Navigation**
As a guest, I want to tap on the venue location and open it in 2GIS or Yandex Maps for navigation.
- Acceptance: Embedded map preview on invitation. "Open in 2GIS" and "Open in Yandex Maps" buttons. Fallback to Google Maps if others unavailable.

**US-11: Digital Gift (Kaspi QR)**
As a guest, I want to send a monetary gift via Kaspi QR directly from the invitation.
- Acceptance: Organizer can add their Kaspi QR code. Guest sees "Send Gift via Kaspi" button. Opens Kaspi app or shows QR code for scanning.

## Requirements

### Functional Requirements

#### FR-1: Template System
- Pre-built invitation templates categorized by event type
- Template marketplace with thumbnail previews
- Template customization engine (text, colors, media)
- Template versioning and updates

#### FR-2: Invitation Builder (Constructor)
- WYSIWYG-style editor for customizing templates
- Media upload: photos, videos, background music
- Text editing with Kazakh and Russian input support
- Color/theme picker
- Live preview mode
- Auto-save drafts

#### FR-3: Multi-Language Support
- Full UI in Kazakh and Russian
- Invitation content editable in both languages
- Language switcher for guests viewing invitations

#### FR-4: RSVP System
- Customizable RSVP form fields (attendance, guest count, dietary needs, message)
- Unique guest links with pre-filled names
- RSVP status tracking (confirmed, declined, pending)
- RSVP update capability for guests

#### FR-5: Payment & Publishing
- Kaspi Pay integration for template purchases
- Freemium model: free build + preview, paid publish
- Unique event URL generation upon purchase
- Personalized guest link generation

#### FR-6: Organizer Dashboard
- Event management (create, edit, archive)
- RSVP analytics and guest list management
- Guest list import/export (CSV)
- Event view/click analytics
- Multi-event support per user

#### FR-7: Guest-Facing Invitation Page
- Mobile-first responsive design
- Countdown timer
- Photo/video gallery section
- Background music player
- Venue map with 2GIS/Yandex Maps integration
- Kaspi QR gift section
- Social sharing optimization (Open Graph tags)

#### FR-8: Authentication
- User registration and login for organizers
- Session management
- Password reset flow

### Non-Functional Requirements

#### NFR-1: Performance
- Guest invitation page loads in < 3 seconds on 4G
- Image optimization and lazy loading
- CDN for static assets
- Server-side rendering for invitation pages (SEO + performance)

#### NFR-2: Security
- HTTPS everywhere
- Input sanitization for all user content
- Rate limiting on RSVP submissions
- Secure file upload validation (type, size limits)
- Authentication tokens with proper expiration
- Multi-tenant data isolation

#### NFR-3: Scalability
- Multi-tenant database architecture (Users, Templates, Events, Guests)
- Stateless application design for horizontal scaling
- Media storage on S3-compatible storage (MinIO)

#### NFR-4: Infrastructure
- Docker containerized Next.js standalone build
- Nginx reverse proxy
- Self-hosted deployment
- S3-compatible storage (MinIO in Docker) for user media
- Relational database (PostgreSQL)

#### NFR-5: SEO & Social
- Open Graph meta tags for invitation link previews
- Dynamic OG images per event
- Structured data for events (JSON-LD)

#### NFR-6: Accessibility
- Minimum WCAG 2.1 AA compliance on guest-facing pages
- Screen reader compatible RSVP forms
- Sufficient color contrast ratios

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js / Auth.js |
| Storage | MinIO (S3-compatible, Docker) |
| Payment | Kaspi Pay API |
| Maps | 2GIS API, Yandex Maps API |
| Deployment | Docker + Nginx reverse proxy |
| CI/CD | GitHub Actions |

## Database Schema (High-Level)

- **Users** — organizer accounts
- **Templates** — invitation template definitions and assets
- **Events** — created events linked to user + template
- **EventCustomizations** — per-event customization data (text, colors, media references)
- **Guests** — guest list per event with unique link tokens
- **RSVPs** — guest responses linked to guest records
- **Payments** — payment records for template purchases
- **Media** — uploaded files metadata (S3 keys)

## Success Criteria

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Published invitations | 100 | First 3 months |
| RSVP completion rate | > 60% | Per event average |
| Page load time (mobile) | < 3 seconds | At launch |
| Payment conversion (preview → purchase) | > 15% | First 3 months |
| Template catalog | 10+ templates | At launch |
| User satisfaction (NPS) | > 40 | First 6 months |

## Constraints & Assumptions

### Constraints
- **Payment:** Kaspi Pay is the only payment provider at launch (dominant in KZ market)
- **Languages:** Kazakh and Russian only at launch
- **Infrastructure:** Self-hosted (no cloud provider dependency)
- **Market:** Kazakhstan-focused initially
- **Templates:** Must be pre-built by design team; no user-created templates at launch

### Assumptions
- Users have smartphones with stable 4G/Wi-Fi
- Kaspi Pay API is accessible for integration
- 2GIS and Yandex Maps APIs are available for Kazakhstan
- Users are comfortable sharing links via WhatsApp/Telegram
- Average event has 50–200 guests

## Out of Scope (V1)

- Native mobile app (iOS/Android)
- User-generated templates / drag-and-drop builder
- Multi-country support beyond Kazakhstan
- Languages beyond Kazakh and Russian
- Physical invitation printing
- Video call / livestream integration
- Email invitation delivery system
- Advanced analytics (heatmaps, A/B testing)
- Marketplace for third-party template designers
- Guest-to-guest social features

## Dependencies

### External
- **Kaspi Pay API** — payment processing (requires merchant account)
- **2GIS API** — venue map integration
- **Yandex Maps API** — alternative map integration
- **MinIO** — S3-compatible object storage (self-hosted)

### Internal
- Template design assets (requires design work before development)
- Content translation (Kazakh + Russian) for UI strings
- Legal: Terms of service, privacy policy (GDPR-like compliance for KZ)

## Monetization Model

| Tier | Price | Features |
|------|-------|----------|
| Free | 0 KZT | Build + preview invitation, unlimited drafts |
| Standard | ~2,000–5,000 KZT | Publish 1 event, shareable links, RSVP, basic analytics |
| Premium | ~5,000–10,000 KZT | All Standard + premium templates, advanced analytics, priority support |

*Pricing to be validated through market research.*

## Rollout Plan

1. **Phase 1 — MVP:** Template selection, builder, RSVP, Kaspi Pay, basic dashboard (weddings only)
2. **Phase 2 — Expansion:** Anniversary + kids' party templates, analytics, Kaspi QR gifts
3. **Phase 3 — Growth:** Additional templates, referral system, advanced dashboard features
