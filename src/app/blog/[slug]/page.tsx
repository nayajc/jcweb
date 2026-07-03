import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, type Block, type Inline } from "@contentful/rich-text-types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/contentful";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — JC Song`,
      description: post.excerpt,
      type: "article",
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
      const fields = (
        node.data?.target as
          | {
              fields?: {
                title?: string;
                file?: {
                  url?: string;
                  details?: { image?: { width?: number; height?: number } };
                };
              };
            }
          | undefined
      )?.fields;
      const file = fields?.file;
      const rawUrl = file?.url;
      if (!rawUrl) return null;
      const url = rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl;
      const details = file?.details?.image;
      const title = fields?.title ?? "Embedded image";
      return (
        <Image
          src={url}
          alt={title}
          width={details?.width ?? 1040}
          height={details?.height ?? 600}
          className="rounded-xl my-6 h-auto w-full"
        />
      );
    },
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const formattedDate = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="max-w-[1040px] mx-auto px-7 w-full">
      <Header />
      <article className="max-w-[720px] mx-auto py-12">
        {formattedDate && (
          <time className="text-xs text-rose">{formattedDate}</time>
        )}
        <h1 className="text-[clamp(30px,5vw,48px)] font-bold leading-[1.1] tracking-[-0.02em] mt-3">
          {post.title}
        </h1>
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            width={720}
            height={405}
            className="rounded-2xl my-8 h-auto w-full"
          />
        )}
        <div className="prose-content mt-8 text-text [&_p]:mt-4 [&_p]:text-[16.5px] [&_a]:text-amber [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6">
          {post.body && documentToReactComponents(post.body, renderOptions)}
        </div>
      </article>
      <Footer />
    </div>
  );
}
