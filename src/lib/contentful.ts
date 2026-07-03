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

export async function getProjects(): Promise<Project[]> {
  const client = getClient();
  if (!client) return [];
  try {
    const entries = await client.getEntries({
      content_type: "project",
      order: ["fields.order"],
    });
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
    return [];
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
