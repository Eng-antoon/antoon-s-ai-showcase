# Antoon Kamel — AI Technical PM Portfolio

A premium minimal-dark, fully interactive single-site portfolio with scroll-driven 3D parallax storytelling, AI-generated imagery, and a roadmap of every project.

## Design direction

- **Style**: Premium minimal dark (Apple-like). Deep slate background (`oklch(0.14 0.02 260)`), off-white type, single accent (electric cyan `oklch(0.78 0.15 220)`) plus a soft violet for highlights. Generous whitespace, large display type (Inter Tight / Geist), thin captions, hairline borders.
- **Motion**: Framer Motion + scroll-linked transforms. Subtle, never gimmicky — fades, slow parallax depth, sticky pin-and-reveal, magnetic hover, marquee of skills, animated SVG path connecting roadmap nodes.
- **AI imagery (Gemini nano-banana via Lovable AI)**: generated at build-time by a script and saved into `src/assets/`:
  1. Stylized portrait of Antoon (derived from resume photo) — hero
  2. Abstract atmospheric backgrounds (3 variants used as parallax layers)
  3. One hero scene per project (logistics, catering, delivery AR, dashboard, finance, AI agent, nutrition, telesales) — 8 images

## Sections (single page, smooth scroll)

1. **Hero** — Animated grain + parallax orbs, large name "Antoon Kamel", role "AI Technical Product Manager", AI portrait floating right with subtle 3D tilt, scroll cue.
2. **About** — Short manifesto pulled from resume profile, quick stat counters (Years, Projects shipped, AI agents deployed, Tools mastered).
3. **Toolkit** — Animated grid of capabilities grouped: Product, Growth & Analytics, AI-Powered Dev, Automation. Logos/tags with hover lift.
4. **Projects Roadmap (the centerpiece)** — Pinned section using stacked depth layers: as the user scrolls, project cards rise from depth (z-translate + scale + blur fade) one after another. A faint connecting line ties them. 8 projects:
   - ILLA Trucking — AI Logistics PM
   - CaterHub — Bilingual catering marketplace
   - Frontdoor AR Tracker — Last-mile proof-of-attempt PWA
   - Frontdoor Issues Admin — Ops dashboard
   - Capacity Tracker Pro — 3PL planning & costing
   - ILLA Finance — AR / FIFO reconciliation
   - Mohsen — Autonomous AI agent on OpenClaw
   - NutriTrack — AI vision nutrition app
   - ILLA Telesales CRM — Arabic FMCG CRM
   
   Each project reveals in stages on scroll: **Context → Role → Stack → Impact**, with the AI hero image as a parallax backdrop.
5. **Experience timeline** — Vertical timeline with the 5 roles from the resume, dates, one-line outcome each.
6. **Recognition** — Graduation project + press mentions (Youm7, Ahram Gate, DMC TV, etc.) as a horizontal marquee.
7. **Contact** — Email, LinkedIn, GitHub, downloadable CV (the uploaded PDF copied to public).

## Technical plan

- TanStack Start, single `src/routes/index.tsx` (long-scroll narrative — appropriate here since the whole portfolio is one experience). All section components in `src/components/portfolio/`.
- Add deps: `framer-motion`, `lenis` (smooth scroll).
- One-shot Node script `scripts/generate-images.ts` calling Lovable AI Gateway with `google/gemini-2.5-flash-image` to produce all images into `src/assets/portfolio/`. Run once via exec; images are committed as static assets.
- Resume PDF copied to `public/antoon-kamel-resume.pdf` for download.
- Project content lives in a typed array `src/data/projects.ts` so adding/editing is trivial.
- Update `__root.tsx` head with proper title, description, og tags, fonts (Inter Tight + Geist Mono).
- All animations respect `prefers-reduced-motion`.

## File map

```
src/
  routes/index.tsx              (composes sections)
  components/portfolio/
    Hero.tsx
    About.tsx
    Toolkit.tsx
    RoadmapParallax.tsx         (pinned 3D-depth scroll)
    ProjectLayer.tsx
    ExperienceTimeline.tsx
    Recognition.tsx
    Contact.tsx
    Noise.tsx, Orb.tsx          (atmosphere)
  data/projects.ts
  data/experience.ts
  assets/portfolio/*.png        (AI generated)
  styles.css                    (dark tokens, accents, fonts)
public/
  antoon-kamel-resume.pdf
scripts/
  generate-images.ts
```

## Out of scope (this pass)

- No CMS / backend; content is static.
- No separate case-study routes — detail is revealed in-place on scroll (matches your "detailed reveal per project" choice).
- No multi-language toggle.

Approve and I'll build it end-to-end, including generating the AI imagery.
