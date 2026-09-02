import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type NavItem = {
  label: string;
  path: string;
};

const mainItems: NavItem[] = [
  { label: "Top", path: "/" },
  { label: "About", path: "/about" },
  { label: "Stacks", path: "/stack" },
  { label: "Works", path: "/works" },
  { label: "Music", path: "/music" },
  { label: "Contact", path: "/contact" },
];

export default function PageMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const items = useMemo(() => mainItems, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="page-menu-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="ページ一覧を開く"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">◎</span>
      </button>

      {open && (
        <div
          className="page-menu-backdrop"
          role="presentation"
          onMouseDown={() => setOpen(false)}
        >
          <section
            className="page-menu-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="page-menu-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-end">
              <h2 id="page-menu-title" className="sr-only">
                画面一覧
              </h2>
              <button
                type="button"
                className="page-menu-close"
                aria-label="ページ一覧を閉じる"
                onClick={() => setOpen(false)}
              />
            </div>

            <nav className="mt-4 grid gap-2" aria-label="ページ一覧">
              {items.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`page-menu-link ${
                      active ? "page-menu-link-active" : ""
                    }`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className="page-menu-label">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </section>
        </div>
      )}
    </>
  );
}
