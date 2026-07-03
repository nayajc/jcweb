# Deep Interview Spec: Personal Portfolio Site (jcweb)

## Metadata
- Rounds: 6 (+ Round 0 topology)
- Final Ambiguity Score: 13%
- Type: greenfield
- Generated: 2026-07-03
- Threshold: 0.2
- Threshold Source: default
- Initial Context Summarized: no
- Status: PASSED

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.90 | 0.40 | 0.36 |
| Constraint Clarity | 0.85 | 0.30 | 0.26 |
| Success Criteria | 0.85 | 0.30 | 0.26 |
| **Total Clarity** | | | **0.87** |
| **Ambiguity** | | | **0.13** |

## Topology
| Component | Status | Description | Coverage / Deferral Note |
|-----------|--------|-------------|--------------------------|
| Portfolio Showcase | active | Project cards linking to external live sites | Card fields + Contentful management confirmed |
| About / Contact | active | Short bio + skills + email/SNS icon links | Confirmed simple layout, no contact form |
| Blog | active | Posts authored/managed in Contentful | CMS confirmed |
| Design System | active | Clean design; 2-3 mockup variants → user picks one | Approval gate confirmed |

## Goal
Build an English-language personal portfolio website (Next.js, deployed on Vercel) that showcases the user's web projects as cards linking out to live external sites, includes a Contentful-powered blog, and a simple About/Contact section — with a clean design chosen from 2-3 presented mockup variants.

## Constraints
- Stack: Next.js (App Router) + Vercel deployment
- Content backend: Contentful (both blog posts AND project list)
- Site language: English
- Project detail: NO detail pages — cards link directly to external live URLs
- Contact: no form — email + SNS (GitHub etc.) icon links only
- Domain: Vercel default domain assumed (custom domain not discussed)

## Non-Goals
- Project detail/case-study pages
- Contact form / email sending backend
- Korean localization / i18n
- User accounts, comments, or any auth

## Acceptance Criteria
- [ ] 2-3 design mockup variants presented; user selects one before full build (design approval gate)
- [ ] Home shows project cards fetched from Contentful: thumbnail, name, one-line description, tech tags, external link
- [ ] Clicking a project card opens the live external site (new tab)
- [ ] Blog list + post pages render Contentful entries (rich text) — publishing in Contentful updates site without code changes (ISR or on-demand revalidation)
- [ ] About section: short bio, skills, email + SNS icon links
- [ ] Site deployed and reachable on Vercel
- [ ] Responsive (mobile/desktop), matches the chosen mockup

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| Projects need detail pages | R1: what does clicking show? | External links only |
| Blog could be markdown/static | R2: how manage posts? | Contentful CMS |
| "Clean design" definable up front | R3: benchmark? | Mockup-selection gate instead |
| Static page suffices | R4 contrarian: static vs framework | Next.js + Vercel |
| Site in Korean | R6 | English |

## Technical Context
- Empty project dir (`docs/` only) — full greenfield scaffold needed
- Next.js App Router + Contentful JS SDK; env vars: CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN
- Contentful content types needed: `project` (title, slug, thumbnail, description, techTags[], externalUrl, order) and `blogPost` (title, slug, coverImage, body richtext, publishedDate)

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| Project | core domain | thumbnail, name, description, techTags, externalUrl | managed in Contentful |
| BlogPost | core domain | title, slug, body, coverImage, date | managed in Contentful |
| About | supporting | bio, skills, email, SNS links | static content |
| DesignMockup | process | 2-3 variants | gates final design |
| Contentful | external system | space, content types | source for Project + BlogPost |

## Ontology Convergence
| Round | Entities | New | Stable | Ratio |
|-------|----------|-----|--------|-------|
| 1 | 4 | 4 | - | N/A |
| 2 | 5 | 1 | 4 | 100% |
| 3 | 6 | 1 | 5 | 100% |
| 4-6 | 6 | 0 | 6 | 100% (converged) |

## Interview Transcript
<details>
<summary>Full Q&A (6 rounds)</summary>

**R0 topology:** 3 components proposed → user added Blog (4 total).
**R1** Q: click a project → what? / how many projects? A: external link only.
**R2** Q: blog authoring? A: Contentful.
**R3** Q: design benchmark / done-criterion? A: show 2-3 mockups, I'll pick.
**R4 (Contrarian)** Q: stack & hosting? A: Next.js + Vercel.
**R5** Q: About/contact shape? A: short bio + email/SNS links.
**R6** Q: card fields, project data source, language? A: Contentful-managed + English.
</details>
