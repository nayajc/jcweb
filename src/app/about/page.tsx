import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHead from "@/components/SectionHead";
import AboutContent from "@/components/AboutContent";

const aboutDescription =
  "JC Song — based in Sydney, working in travel tech, building web apps, dashboards, and side projects.";

export const metadata: Metadata = {
  title: "About",
  description: aboutDescription,
  openGraph: {
    title: "About — JC Song",
    description: aboutDescription,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-[1040px] mx-auto px-7 w-full">
      <Header />
      <SectionHead title="About" />
      <AboutContent />

      <div className="flex gap-[22px] mt-10">
        <a
          href="mailto:nayajcsong@gmail.com"
          className="text-text text-sm hover:text-amber transition-colors"
        >
          Email
        </a>
        <a
          href="https://github.com/nayajc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text text-sm hover:text-amber transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/jaechulsong/"
          target="_blank"
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
