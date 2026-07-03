const SKILLS = [
  "TypeScript",
  "Next.js",
  "React",
  "Flutter",
  "Supabase",
  "Vercel",
  "Data Viz",
  "Google APIs",
];

export default function AboutContent() {
  return (
    <div className="flex gap-12 items-start mt-2 flex-wrap">
      <p className="text-muted max-w-[460px] text-[15.5px] flex-[1_1_300px]">
        <b className="text-text font-medium">I&apos;m JC, based in Seoul.</b> I
        work in travel tech and build things on the side — usually the tool I
        wished existed that morning. This site is the shelf where the finished
        ones live.
      </p>
      <div className="flex flex-wrap gap-2 flex-[1_1_260px]">
        {SKILLS.map((skill) => (
          <span
            key={skill}
            className="text-[12.5px] text-text bg-card border border-edge px-[13px] py-[5px] rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
