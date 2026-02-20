---
name: toi-invite
status: backlog
created: 2026-02-20T15:23:15Z
progress: 0%
prd: .claude/prds/toi-invite.md
github: https://github.com/Temirlaaan/toi-invite/issues/1
---

# Epic: toi-invite

## Overview

Build a template-based SaaS platform for digital event invitations targeting Kazakhstan. The app is a Next.js (App Router) + TypeScript monolith with PostgreSQL (Prisma ORM), MinIO for media storage, Auth.js for authentication, and Kaspi Pay for payments. Deployed as a Docker container behind Nginx.

The architecture follows a standard Next.js full-stack pattern: server components for SSR invitation pages (performance + SEO), server actions / route handlers for API logic, and client components for the builder and dashboard. Templates are stored as JSON configuration in the database — each template defines sections, layout, and customizable fields. The builder renders templates dynamically based on this config.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js App Router | SSR for guest pages, server actions for API, single deployable |
| Database | PostgreSQL + Prisma | Relational fits multi-tenant model, Prisma for type-safe queries |
| Auth | Auth.js (NextAuth v5) | Built-in Next.js integration, credential + OAuth support |
| Storage | MinIO (S3 SDK) | Self-hosted, S3-compatible, Docker-friendly |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design system |
| i18n | next-intl | Mature Next.js i18n library, supports kk/ru locales |
| Template engine | JSON config + dynamic renderer | Templates as data, not code — easier to add new templates without deploys |
| Payment | Kaspi Pay API | Only option for KZ market, merchant account required |

## Technical Approach

### Data Model (Prisma)

Core tables:
- **User** — id, email, passwordHash, name, phone, createdAt
- **Template** — id, name, slug, eventType (wedding/anniversary/kids), category (free/standard/premium), configJson, thumbnailUrl, previewImages
- **Event** — id, userId, templateId, slug, title, eventDate, venueAddress, venueLat, venueLng, customizationJson, musicUrl, kaspiQrUrl, status (draft/published/archived), publishedAt
- **Guest** — id, eventId, name, phone, token (unique), viewCount, lastViewedAt
- **Rsvp** — id, guestId, status (pending/confirmed/declined/maybe), guestCount, message, respondedAt
- **Payment** — id, userId, eventId, amount, currency, kaspiRef, status (pending/completed/failed), createdAt
- **Media** — id, eventId, type (photo/video/music), s3Key, originalName, size, mimeType

### Frontend Architecture

- **Guest invitation page** (`/[locale]/e/[slug]` and `/[locale]/e/[slug]/g/[token]`): Server-rendered, dynamic OG images, mobile-first. Sections: hero, event details, countdown, gallery, map, RSVP form, Kaspi QR gift.
- **Template gallery** (`/[locale]/templates`): Server-rendered grid with filters by event type.
- **Builder** (`/[locale]/dashboard/events/[id]/edit`): Client-side interactive editor with live preview panel. Form-based customization (not drag-and-drop).
- **Dashboard** (`/[locale]/dashboard`): Event list, RSVP table, guest management, analytics summary.

### API Layer (Route Handlers + Server Actions)

- Auth: sign-up, sign-in, password reset (Auth.js)
- Events: CRUD, publish (requires payment check)
- Guests: CRUD, bulk import (CSV), generate tokens
- RSVPs: submit (public, rate-limited), list (authenticated)
- Media: presigned upload URLs to MinIO, delete
- Payments: create Kaspi Pay order, webhook callback for confirmation
- Analytics: view counts, RSVP stats (aggregated queries)

### Infrastructure

```
[Nginx] → [Next.js Docker Container (standalone)] → [PostgreSQL]
                                                   → [MinIO]
```

- `docker-compose.yml` with services: app, postgres, minio, nginx
- Nginx handles SSL termination, static file caching, reverse proxy
- Next.js standalone output for minimal Docker image
- MinIO with a single bucket for all media, organized by `events/{eventId}/`

## Implementation Strategy

Development follows a bottom-up approach: database → core API → guest page → builder → dashboard → payments → deployment.

### Risk Mitigation
- **Kaspi Pay API access:** Start with a mock payment flow; swap in real API when merchant account is approved
- **Template design:** Ship with 3 wedding templates initially; more templates can be added as JSON config without code changes
- **Performance:** SSR + image optimization (next/image with MinIO loader) ensures fast guest pages from day one

### Testing Approach
- Prisma with test database for integration tests
- Playwright for critical flows (create event → customize → publish → guest RSVP)
- Unit tests for business logic (payment validation, slug generation, RSVP rules)

## Task Breakdown Preview

- [ ] **Task 1: Project Setup & Infrastructure** — Initialize Next.js + TypeScript project, configure Tailwind/shadcn, Prisma + PostgreSQL, MinIO SDK, docker-compose, Nginx config, next-intl for kk/ru
- [ ] **Task 2: Database Schema & Auth** — Prisma schema for all models, migrations, Auth.js setup with credentials provider, sign-up/sign-in/password-reset pages
- [ ] **Task 3: Template System** — Template data model, seed database with 3 wedding templates (JSON config), template gallery page with event type filters, template preview page
- [ ] **Task 4: Event Builder** — Event CRUD API, builder page with form-based customization (text, colors, date, venue), media upload to MinIO, live preview panel, auto-save drafts
- [ ] **Task 5: Guest Invitation Page** — SSR invitation page rendering from template config + event customization, countdown timer, photo gallery, background music player, map section (2GIS/Yandex links), Kaspi QR section, dynamic OG meta tags
- [ ] **Task 6: RSVP System** — RSVP form on guest page (status, guest count, message), personalized guest links with token, RSVP API with rate limiting, guest name pre-fill
- [ ] **Task 7: Guest Management & Dashboard** — Organizer dashboard with event list, guest list management (add/import CSV/generate links), RSVP tracking table, CSV export, view analytics (counts, conversion)
- [ ] **Task 8: Payment & Publishing** — Kaspi Pay integration (create order, webhook callback), paywall enforcement on publish, event URL activation after payment, payment history
- [ ] **Task 9: Polish & Optimization** — Image optimization pipeline, responsive design QA, i18n string completion (kk/ru), SEO (JSON-LD, sitemap), accessibility pass (WCAG 2.1 AA on guest pages)
- [ ] **Task 10: Docker Deployment** — Dockerfile (standalone build), docker-compose with all services, Nginx config (SSL, caching, proxy), environment variable management, health checks, deployment documentation

## Dependencies

### External (Blocking)
- **Kaspi Pay merchant account** — Required for real payments (can mock until approved)
- **Template design assets** — At least 3 wedding templates needed before Task 3 can fully complete

### External (Non-Blocking)
- **2GIS/Yandex Maps APIs** — Used as external links, no API key needed for basic integration
- **Domain registration** — Needed for production deployment (Task 10)

### Internal
- Tasks are sequential: each builds on the previous
- Task 4 (Builder) depends on Task 3 (Templates)
- Task 8 (Payments) depends on Task 4 (Builder) + external Kaspi account

## Success Criteria (Technical)

| Criteria | Target |
|----------|--------|
| Guest page load time (Lighthouse mobile) | < 3s FCP, > 90 performance score |
| Builder save latency | < 500ms |
| RSVP submission latency | < 300ms |
| Docker image size | < 500MB |
| Database query time (p95) | < 100ms |
| Test coverage (critical paths) | > 80% |
| Lighthouse accessibility (guest page) | > 90 |
| Zero downtime deployment | Supported via Docker rolling update |

## Estimated Effort

| Task | Estimate |
|------|----------|
| 1. Project Setup & Infrastructure | 1 day |
| 2. Database Schema & Auth | 1 day |
| 3. Template System | 1–2 days |
| 4. Event Builder | 2–3 days |
| 5. Guest Invitation Page | 2 days |
| 6. RSVP System | 1 day |
| 7. Guest Management & Dashboard | 2 days |
| 8. Payment & Publishing | 1–2 days |
| 9. Polish & Optimization | 1–2 days |
| 10. Docker Deployment | 1 day |
| **Total** | **~13–17 days** |

Critical path: Tasks 1 → 2 → 3 → 4 → 5 → 8 → 10

## Tasks Created
- [ ] #2 - Project Setup & Infrastructure (parallel: false)
- [ ] #4 - Database Schema & Authentication (parallel: false)
- [ ] #6 - Template System & Gallery (parallel: false)
- [ ] #8 - Event Builder & Media Upload (parallel: false)
- [ ] #10 - Guest Invitation Page (parallel: true)
- [ ] #3 - RSVP System (parallel: true)
- [ ] #5 - Guest Management & Dashboard (parallel: true)
- [ ] #7 - Payment & Publishing / Kaspi Pay (parallel: true)
- [ ] #9 - Polish, i18n & Optimization (parallel: false)
- [ ] #11 - Docker Deployment & Production Config (parallel: false)

Total tasks: 10
Parallel tasks: 4 (#10, #3, #5, #7 — can run concurrently after #8)
Sequential tasks: 6 (#2 → #4 → #6 → #8, then #9 → #11)
Estimated total effort: 118 hours (~15 working days)
