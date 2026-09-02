import { useState } from "react";
import { Link } from "react-router-dom";
import { OWNER } from "../data/apps";

export default function Mail() {
  const [show, setShow] = useState(false);

  return (
    <section className="wrap py-16">
      <nav className="breadcrumb flex items-center gap-2 text-xs tracking-wide text-muted">
        <Link to="/" className="text-paper-dim hover:text-accent-soft">
          Home
        </Link>
        <span className="text-line">/</span>
        <span className="text-paper-dim">Contact</span>
      </nav>

      <div className="mt-10 max-w-2xl">
        <div className="text-xs uppercase tracking-widest text-accent">
          Contact
        </div>
        <h1 className="display-title mt-2 font-serif text-4xl font-medium leading-tight md:text-6xl">
          Contact
        </h1>
        <p className="mt-4 text-base text-paper-dim">
          機能の詳細・実装については、こちらからご連絡ください
        </p>
      </div>

      <div className="mt-8 max-w-2xl rounded-lg border border-line-soft bg-ink/40 p-6">
        {show ? (
          <a
            href={`mailto:${OWNER.email}`}
            className="break-all border-b border-line text-lg text-accent-soft transition-colors hover:border-accent"
          >
            {OWNER.email}
          </a>
        ) : (
          <button
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-2 text-sm tracking-wide text-paper transition-all hover:border-accent hover:text-accent-soft"
            type="button"
            onClick={() => setShow(true)}
          >
            Show address
          </button>
        )}
      </div>
    </section>
  );
}
