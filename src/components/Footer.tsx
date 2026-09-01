import { useState } from "react";
import { OWNER } from "../data/apps";
import SpotifyNowPlaying from "../demos/SpotifyNowPlaying";

const btnGhost =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-2 text-sm tracking-wide text-paper transition-all hover:border-accent hover:text-accent-soft";

export default function Footer() {
  const [show, setShow] = useState(false);
  return (
    <footer
      id="contact"
      className="mt-16 border-t border-line-soft py-14 pb-16 lg:pb-20"
    >
      <div className="wrap grid items-center gap-8 md:grid-cols-3">
        <div>
          <h2 className="font-serif text-4xl font-medium">Get in touch.</h2>
          <p className="mt-2 text-xs tracking-wide text-muted">
            機能の詳細・実装については、お気軽にご連絡ください
          </p>
        </div>
        <SpotifyNowPlaying />
        <div className="text-right md:col-start-3">
          {show ? (
            <a
              href={`mailto:${OWNER.email}`}
              className="border-b border-line text-accent-soft transition-colors hover:border-accent"
            >
              {OWNER.email}
            </a>
          ) : (
            <button className={btnGhost} onClick={() => setShow(true)}>
              Contact →
            </button>
          )}
          <p className="mt-4 text-xs tracking-wide text-muted">
            © {new Date().getFullYear()} Judy
          </p>
        </div>
      </div>
    </footer>
  );
}
