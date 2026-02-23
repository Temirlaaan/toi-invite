---
name: phase2-commercial-readiness
description: Commercial Readiness & UX Polish
status: in-progress
created: 2026-02-22T10:32:05Z
updated: 2026-02-22T10:32:05Z
---

# Epic: Phase 2 — Commercial Readiness & UX Polish

## Issues

1. **Issue #12**: Landing Page & Platform Core
2. **Issue #13**: Template Config Expansion & New Templates
3. **Issue #14**: Envelope Animation & Music Autoplay
4. **Issue #15**: Scroll Animations & Sticky Mobile Bar
5. **Issue #16**: Dynamic OpenGraph Images
6. **Issue #17**: Seating Chart & Dashboard Enhancements
7. **Issue #18**: Password Reset Flow

## Dependency Graph
```
#12 (Landing Page) ──────────────────────┐
#13 (Templates) ─── #14 (Envelope) ──┐   │
                                      ├── all done
#15 (Animations) ─────────────────────┤
#16 (OG Images) ──────────────────────┤
#17 (Seating) ────────────────────────┤
#18 (Password Reset) ─────────────────┘
```

Most issues can run in parallel. #14 depends on #13 (template config).
