import { Link } from "react-router-dom";

const linkClass =
  "inline-flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm tracking-wide text-paper transition-all hover:border-accent hover:text-accent-soft";

export default function NotFound() {
  return (
    <section className="wrap grid min-h-screen content-center py-20">
      <p className="text-sm uppercase tracking-widest text-accent">Not Found</p>
      <h1 className="display-title mt-3 font-serif text-4xl font-medium italic leading-tight md:text-6xl">
        Page not found
      </h1>
      <nav className="mt-8 flex flex-wrap gap-3" aria-label="Not found links">
        <Link className={linkClass} to="/about">
          About
        </Link>
        <Link className={linkClass} to="/works">
          Works
        </Link>
        <Link className={linkClass} to="/contact">
          Contact
        </Link>
      </nav>
    </section>
  );
}
