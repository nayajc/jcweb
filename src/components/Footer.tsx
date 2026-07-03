export default function Footer() {
  return (
    <footer className="mt-[100px] border-t border-edge py-9 pb-14 flex justify-between items-center flex-wrap gap-4">
      <div className="flex gap-[22px]">
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
      <small className="text-muted">© 2026 JC Song</small>
    </footer>
  );
}
