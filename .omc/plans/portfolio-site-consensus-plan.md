# Consensus Plan: Personal Portfolio Site (jcweb)

**Status: PENDING APPROVAL** (execution not yet authorized)
Source spec: `.omc/specs/deep-interview-portfolio-site.md` (ambiguity 13%, PASSED)
Consensus: Planner → Architect (REVISE, fixes applied) → Critic (ACCEPT-WITH-RESERVATIONS, fixes applied) — 1 iteration
Date: 2026-07-03 | Agents ran on Sonnet per user request

## RALPLAN-DR Summary

**Principles**
1. Ship the smallest correct thing — no detail pages, no auth, no contact backend.
2. Content lives in Contentful; code never hardcodes editorial content.
3. Design is gated: nothing beyond mockups gets built until the user picks a direction.
4. Prefer platform defaults (Vercel + Next.js conventions) over custom infra.
5. Every acceptance criterion must map to a verifiable step.

**Decision Drivers (top 3)**
1. Editor experience — publish blog/project updates with zero code changes.
2. Time-to-first-mockup — user picks a design before full build investment.
3. Operational simplicity on Vercel hobby tier.

**Options**
- **A. Data freshness**: ISR-only (`revalidate: 3600`) vs on-demand webhook. **Chosen: ISR-only for Phases 1–5; webhook is optional decoupled Phase 5b** (Architect synthesis — decouples "ship a working site" from "instant refresh").
- **B. Styling**: Tailwind CSS (chosen — fastest to produce distinct variants, token config per mockup) vs CSS Modules.
- **C. Mockup delivery**: Static HTML files in `docs/mockups/` (chosen — fast, disposable, hard gate) vs Next.js theme routes. 2 variants acceptable if user has a strong preference; cap 3 + 1 revision round.

## Requirements Summary
- Next.js App Router (TypeScript, Tailwind, `src/`), Vercel deploy, English-only.
- Contentful = system of record for `project` AND `blogPost`.
- Home: project cards (thumbnail, name, one-line description, tech tags) → external live URL in new tab. No detail pages.
- Blog: list + `/blog/[slug]` rich-text posts.
- About: bio, skills, `mailto:` + SNS icon links (static-in-code, intentional per spec). No form, no i18n, no auth.
- **Out of scope (explicit)**: Contentful preview/draft mode; Lighthouse perf/SEO score targets (a11y ≥90 only).

## Implementation Phases

### Phase 0 — Design Mockups + Selection Gate
- `docs/mockups/variant-a.html` (minimal/mono), `variant-b.html` (bold color-block), `variant-c.html` (editorial/serif) — standalone HTML+CSS, each showing header, hero, project cards, blog snippet, about block, footer.
- **HARD GATE: stop until user names a variant.** Record choice + rationale in `docs/mockups/DECISION.md`.

### Phase 1 — Next.js Scaffold
- `create-next-app` (TS, App Router, Tailwind, src/, ESLint) at repo root; git init; `.gitignore`; `.env.local.example`.
- Port chosen mockup's tokens (colors, fonts via `next/font`, spacing) into `tailwind.config.ts` + `app/globals.css`.
- **Fidelity checkpoint**: side-by-side screenshot of mockup vs scaffolded page. **Failure path (Critic fix): if visibly off, redo token mapping once; if still failing, get explicit user sign-off with documented deviations before Phase 2.**

### Phase 2 — Contentful Content Model + Integration
- Content type `project`: title (required), slug (unique), thumbnail (media, required), description (short, required), techTags (short text list), externalUrl (URL-validated, required), order (int, optional).
- Content type `blogPost`: title, slug (unique → route), coverImage (optional), body (rich text), publishedDate, excerpt (optional).
- `src/lib/contentful.ts` typed client; `getProjects()`, `getBlogPosts()`, `getBlogPostBySlug()`.
- `@contentful/rich-text-react-renderer` with custom `EMBEDDED_ASSET` handler.
- Env: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`. Seed 1–2 real entries per type.

### Phase 3 — Pages & Components
- `app/page.tsx`: hero + `ProjectGrid`/`ProjectCard` (`next/image`, `target="_blank" rel="noopener noreferrer"`).
- `app/blog/page.tsx`, `app/blog/[slug]/page.tsx` (`generateStaticParams`, `generateMetadata`), `app/about/page.tsx`.
- `components/`: ProjectCard, BlogPostCard, Header, Footer.
- `next.config.js`: `images.remotePatterns` for `images.ctfassets.net`.
- **Empty-content behavior (Architect fix): build must NOT fail on zero entries; render explicit empty-state UI ("Projects coming soon" / "No posts yet"); `generateStaticParams` returns `[]` safely.**

### Phase 4 — Polish, Responsive, SEO
- Responsive at 375/768/1280px vs chosen mockup (no horizontal overflow).
- `app/sitemap.ts`, `app/robots.ts`, per-page metadata + OG, favicon. Lighthouse a11y ≥90.

### Phase 5 — Vercel Deploy
- Connect repo to Vercel; env vars in dashboard (never in git).
- `export const revalidate = 3600` on Contentful-backed pages.
- Prod smoke test: `/`, `/blog`, `/blog/[slug]`, `/about` all HTTP 200.

### Phase 5b — Optional: On-Demand Revalidation Webhook (decoupled)
- **Trigger decision (Critic note): build only if 1-hour publish latency is a felt pain after real use — post-launch discretion.**
- `app/api/revalidate/route.ts` verifying `CONTENTFUL_REVALIDATE_SECRET` **via header ONLY (e.g. `Authorization: Bearer`) — secret in query string explicitly disallowed (Critic fix; query params leak via access logs).**
- Handler idempotent (`revalidatePath` safe on duplicate/out-of-order webhooks).
- Explicit test in-phase: `curl -X POST` with wrong/missing header → 401/403; correct header → 200.
- Contentful webhook on publish/unpublish for both content types, secret sent as custom header.

## Acceptance Criteria
1. 2–3 mockup HTML files viewable in browser, visually distinct.
2. User's variant choice recorded in `docs/mockups/DECISION.md` before any component build.
3. `next build` passes with zero errors.
4. Contentful content types match the field spec above.
5. `/` renders project card(s) from live Contentful entries; adding an entry appears without code change.
6. Card links open external URL in new tab with `rel="noopener noreferrer"`.
7. `/blog` lists posts; `/blog/[slug]` renders rich text incl. headings/links/embedded images.
8. Publish in Contentful reflects on site ≤3600s (or <60s if 5b built).
9. About: bio, skills, working `mailto:` + SNS links.
10. No horizontal overflow at 375/768/1280px; layout matches chosen mockup.
11. Contentful images load via `images.ctfassets.net` remotePatterns, no broken images.
12. Prod Vercel URLs return 200 for all routes.
13. Env vars set in Vercel only; `.env.local` git-ignored (`git log --all -- .env.local` empty).
14. (5b only) Bad/missing secret header → 401/403; secret never accepted via query string.

## Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Contentful free-tier limits | Single locale; ISR caching (not per-request fetch); monitor dashboard |
| Empty content at first deploy | Empty-state UI + seed entries; `generateStaticParams` handles `[]` |
| Broken images | `remotePatterns` set in Phase 1, verified with real image in Phase 2 |
| Secret leak (5b) | Header-only transmission; env vars; never query string |
| Embedded assets in rich text | Custom renderer, tested with an embedded-image post |
| Mockup indecision | Cap 3 variants + 1 revision round; iterate closest variant |
| Build-time Contentful outage | try/catch → empty array + warning; build doesn't hard-fail |
| Broken/malicious external URLs | Contentful URL validation + `noopener noreferrer` |

## Verification Steps
1. Design-gate confirmation recorded before Phase 1.
2. `npm run build` + `npm run lint` per phase.
3. Contentful create/edit/delete reflected within revalidation window.
4. Playwright or manual click-through of card links, mailto, SNS.
5. Screenshots at 375/768/1280 compared to mockup (incl. Phase 1 fidelity checkpoint with defined failure path).
6. Rich-text test post: headings, link, bold, embedded image.
7. (5b) curl secret tests: wrong header 401/403, correct header 200, query-string secret rejected.
8. Prod smoke test on live URL, no console errors.
9. Network tab: no 4xx on `images.ctfassets.net`.
10. Env hygiene: `.env.local` never committed.

## ADR
- **Decision**: Next.js App Router + Tailwind on Vercel, Contentful as sole content source, ISR-3600 first with webhook as optional Phase 5b, design chosen via static-HTML mockup gate.
- **Drivers**: zero-code publishing, time-to-first-mockup, hobby-tier simplicity.
- **Alternatives considered**: webhook-first hybrid revalidation (more moving parts on critical path); CSS Modules (slower variant iteration); Next.js theme-route mockups (couples design exploration to scaffold); skip-mockup design-in-browser (no side-by-side comparison, rabbit-hole risk).
- **Why chosen**: decouples "site is live" from "instant refresh"; every choice traces to a stated principle; solo-dev-sized process.
- **Consequences**: up to 1h publish latency until 5b; mockup→Tailwind token translation step with fidelity checkpoint; two content types to maintain in Contentful.
- **Follow-ups**: decide 5b after real usage; custom domain (undiscussed — Vercel default assumed); consider moving About content to Contentful later if it churns.

## Changelog (consensus revisions applied)
- Architect: added Phase 1 fidelity checkpoint; defined empty-content render behavior; webhook idempotency stated; webhook demoted to optional Phase 5b; 2 variants acceptable.
- Critic: header-only secret transmission (query string disallowed) + criterion 14 updated; fidelity checkpoint failure/retry path defined; 5b trigger decision documented; preview mode + Lighthouse perf explicitly out of scope.
