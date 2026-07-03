import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import BlogPostCard from "@/components/BlogPostCard";
import SectionHead from "@/components/SectionHead";
import AboutContent from "@/components/AboutContent";
import { getProjects, getBlogPosts } from "@/lib/contentful";

export const revalidate = 3600;

export default async function Home() {
  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()]);
  const recentPosts = posts.slice(0, 4);

  return (
    <div className="max-w-[1040px] mx-auto px-7 w-full">
      <Header />

      <section className="pt-[90px] pb-[70px] max-sm:pt-14">
        <h1 className="font-bold leading-[1.05] tracking-[-0.03em] text-[clamp(40px,7vw,76px)]">
          I make ideas
          <br />
          <span className="bg-gradient-to-r from-amber to-rose bg-clip-text text-transparent">
            real &amp; live.
          </span>
        </h1>
        <p className="mt-6 text-muted max-w-[520px] text-[17px]">
          JC Song — web apps, dashboards, and side projects, all deployed and
          clickable. Pick a card, see the real thing.
        </p>
        <a
          href="#work"
          className="inline-block mt-8 px-6 py-3 border border-edge rounded-full text-text text-sm no-underline transition-colors hover:border-amber hover:text-amber"
        >
          Browse the work ↓
        </a>
      </section>

      <section id="work" className="scroll-mt-[68px]">
        <SectionHead title="Work" />
        {projects.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Projects coming soon.</p>
        )}
      </section>

      {recentPosts.length > 0 && (
        <section id="blog" className="scroll-mt-[68px]">
          <SectionHead title="Blog" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {recentPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <section id="about" className="scroll-mt-[68px]">
        <SectionHead title="About" />
        <AboutContent />
      </section>

      <Footer />
    </div>
  );
}
