import { OWNER } from "../data/apps";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="mt-16 border-t border-line-soft py-14 pb-[70px]"
    >
      <div className="wrap flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-[2.2rem] font-medium">
            Get in touch.
          </h2>
          <p className="mt-2 text-[0.76rem] tracking-[0.06em] text-muted">
            機能の詳細・実装については、お気軽にご連絡ください。
          </p>
        </div>
        <div className="text-right">
          <a
            href={`mailto:${OWNER.email}`}
            className="border-b border-line text-accent-soft transition-colors hover:border-accent"
          >
            {OWNER.email}
          </a>
          <p className="mt-3.5 text-[0.76rem] tracking-[0.06em] text-muted">
            © {new Date().getFullYear()} Judy
          </p>
        </div>
      </div>
    </footer>
  );
}
