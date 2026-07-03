import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHead from "@/components/SectionHead";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About — JC Song",
  description:
    "JC Song — based in Seoul, working in travel tech, building web apps, dashboards, and side projects.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[1040px] mx-auto px-7 w-full">
      <Header />
      <SectionHead title="About" />
      <AboutContent />

      <div className="flex gap-[22px] mt-10">
        <a
          href="mailto:jc.song@kkday.com"
          className="text-text text-sm hover:text-amber transition-colors"
        >
          Email
        </a>
        {/* TODO: replace "#" with real GitHub profile URL */}
        <a
          href="#"
          rel="noopener noreferrer"
          className="text-text text-sm hover:text-amber transition-colors"
        >
          GitHub
        </a>
        {/* TODO: replace "#" with real LinkedIn profile URL */}
        <a
          href="#"
          rel="noopener noreferrer"
          className="text-text text-sm hover:text-amber transition-colors"
        >
          LinkedIn
        </a>
      </div>

      <Footer />
    </div>
  );
}
