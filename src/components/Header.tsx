import Link from "next/link";

export default function Header() {
  return (
    <header className="h-[68px] flex items-center">
      <nav className="flex justify-between items-center w-full">
        <Link href="/" className="font-display font-bold text-[18px] text-text">
          JC<span className="text-amber">.</span>
        </Link>
        <ul className="flex gap-[26px] list-none">
          <li>
            <Link
              href="/#work"
              className="text-muted text-sm hover:text-text transition-colors"
            >
              Work
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="text-muted text-sm hover:text-text transition-colors"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-muted text-sm hover:text-text transition-colors"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
