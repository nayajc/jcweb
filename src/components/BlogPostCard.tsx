import Link from "next/link";
import type { BlogPost } from "@/lib/contentful";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block bg-card border border-edge rounded-xl p-[22px] text-inherit no-underline transition-colors hover:border-rose"
    >
      <time className="text-xs text-rose">{formatDate(post.publishedDate)}</time>
      <h3 className="text-[17px] mt-2 font-medium leading-[1.4]">
        {post.title}
      </h3>
    </Link>
  );
}
