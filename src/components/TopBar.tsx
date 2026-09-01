import { Link } from "react-router-dom";

const navLink =
  "text-sm tracking-wide text-white transition-colors hover:text-accent-soft";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-ink/70 pt-4 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <Link to="/" className="font-serif text-lg tracking-widest text-white">
          Judy<span className="text-accent">.</span>
        </Link>
        <nav className="hidden gap-7 sm:flex">
          <Link to="/" className={navLink}>
            Home
          </Link>
          <Link to="/about" className={navLink}>
            About
          </Link>
          <Link to="/works" className={navLink}>
            Works
          </Link>
          <Link to="/#contact" className={navLink}>
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
