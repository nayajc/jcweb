import { createClient, type Entry, type Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";

export interface Project {
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  techTags: string[];
  externalUrl: string;
  order?: number;
}

export interface BlogPost {
  title: string;
  slug: string;
  coverImage?: string;
  body: Document;
  publishedDate: string;
  excerpt?: string;
}

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

/**
 * Returns a Contentful client, or null when credentials are missing.
 * Never throws — callers degrade gracefully so `next build` succeeds
 * without credentials.
 */
function getClient() {
  if (!spaceId || !accessToken) {
    console.warn(
      "[contentful] Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN — returning empty content.",
    );
    return null;
  }
  return createClient({ space: spaceId, accessToken });
}

function assetUrl(asset: unknown): string | undefined {
  const file = (asset as Asset | undefined)?.fields?.file;
  const url = (file as { url?: string } | undefined)?.url;
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

/**
 * Static fallback projects, shown until the `project` content type is
 * created in Contentful (see docs/mockups/DECISION.md / consensus plan
 * Phase 2, currently deferred). Once real Contentful entries exist,
 * getProjects() returns those instead and this list is unused.
 */
const FALLBACK_PROJECTS: Project[] = [
  {
    title: "Fleet Manager Pro",
    slug: "fleet-manager-pro",
    thumbnail: "/projects/fleet-manager-pro.jpg",
    description: "Vehicle fleet management platform — tracking, maintenance, and dispatch in one dashboard.",
    techTags: ["Next.js", "Supabase"],
    externalUrl: "https://www.wefleet.com.au/",
    order: 1,
  },
  {
    title: "LawLawLand",
    slug: "lawlawland",
    thumbnail: "/projects/lawlawland.jpg",
    description: "AI consultation site for a divorce lawyer — clients chat with an AI trained on the firm's expertise before booking a real consultation.",
    techTags: ["Next.js", "AI SDK", "Contentful"],
    externalUrl: "https://ohsoojin.com/",
    order: 2,
  },
  {
    title: "JCalendar",
    slug: "jcalendar",
    thumbnail: "/projects/jcalendar.jpg",
    description: "Booking SaaS for consultants — clients reserve open slots via an embeddable widget, synced to Google Calendar.",
    techTags: ["Next.js", "Firebase", "Google Calendar"],
    externalUrl: "https://jcalendar.app",
    order: 3,
  },
  {
    title: "Northmead Car Sales",
    slug: "northmead-car-sales",
    thumbnail: "/projects/northmead.jpg",
    description: "Inventory site for a premium Japanese-import car dealership, with vehicle listings and admin tools.",
    techTags: ["HTML/CSS/JS", "Firebase"],
    externalUrl: "https://www.northmeadcardealer.com/",
    order: 4,
  },
  {
    title: "Two Fasting",
    slug: "twofasting",
    thumbnail: "/projects/twofasting.jpg",
    description: "Intermittent fasting tracker with a friendly, game-like feel — install as a PWA and log fasts on the go.",
    techTags: ["Next.js", "PWA", "Firebase"],
    externalUrl: "https://twofasting.vercel.app",
    order: 5,
  },
  {
    title: "OCRtalk",
    slug: "ocrtalk",
    thumbnail: "/projects/ocrtalk.jpg",
    description: "Turns KakaoTalk/text-message screenshots into text — AI extraction, translation, and Word export.",
    techTags: ["Next.js", "AI SDK", "Supabase"],
    externalUrl: "https://www.ocrtalk.net/app",
    order: 6,
  },
  {
    title: "Lawforms (내용증명 AI)",
    slug: "lawforms",
    thumbnail: "/projects/lawforms.jpg",
    description: "Generates formal legal demand letters from a short description or guided questions — no legal knowledge required.",
    techTags: ["Next.js", "Generative AI", "Firebase"],
    externalUrl: "https://lawforms.vercel.app",
    order: 7,
  },
  {
    title: "CloudCloset",
    slug: "cloudcloset",
    thumbnail: "/projects/cloudcloset.jpg",
    description: "A wardrobe in the cloud — catalog your clothes and plan outfits from anywhere.",
    techTags: ["Next.js", "Supabase", "PWA"],
    externalUrl: "https://www.cloudcloset.fit",
    order: 8,
  },
];

export async function getProjects(): Promise<Project[]> {
  const client = getClient();
  if (!client) return FALLBACK_PROJECTS;
  try {
    const entries = await client.getEntries({
      content_type: "project",
      order: ["fields.order"],
    });
    if (entries.items.length === 0) return FALLBACK_PROJECTS;
    return entries.items.map((item: Entry) => {
      const f = item.fields as Record<string, unknown>;
      return {
        title: (f.title as string) ?? "",
        slug: (f.slug as string) ?? "",
        thumbnail: assetUrl(f.thumbnail) ?? "",
        description: (f.description as string) ?? "",
        techTags: (f.techTags as string[]) ?? [],
        externalUrl: (f.externalUrl as string) ?? "",
        order: f.order as number | undefined,
      };
    });
  } catch (error) {
    console.warn("[contentful] getProjects failed:", error);
    return FALLBACK_PROJECTS;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const client = getClient();
  if (!client) return [];
  try {
    const entries = await client.getEntries({
      content_type: "blogPost",
      order: ["-fields.publishedDate"],
    });
    return entries.items.map(mapBlogPost);
  } catch (error) {
    console.warn("[contentful] getBlogPosts failed:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const entries = await client.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
    });
    const item = entries.items[0];
    return item ? mapBlogPost(item) : null;
  } catch (error) {
    console.warn("[contentful] getBlogPostBySlug failed:", error);
    return null;
  }
}

function mapBlogPost(item: Entry): BlogPost {
  const f = item.fields as Record<string, unknown>;
  return {
    title: (f.title as string) ?? "",
    slug: (f.slug as string) ?? "",
    coverImage: assetUrl(f.coverImage),
    body: f.body as Document,
    publishedDate: (f.publishedDate as string) ?? "",
    excerpt: f.excerpt as string | undefined,
  };
}
