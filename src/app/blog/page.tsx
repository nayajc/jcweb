import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/BlogPostCard";
import SectionHead from "@/components/SectionHead";
import { getBlogPosts } from "@/lib/contentful";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building web apps, dashboards, and side projects.",
  openGraph: {
    title: "Blog — JC Song",
    description: "Notes on building web apps, dashboards, and side projects.",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-[1040px] mx-auto px-7 w-full">
      <Header />
      <SectionHead title="Blog" />
      {posts.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No posts yet.</p>
      )}
      <Footer />
    </div>
  );
}
