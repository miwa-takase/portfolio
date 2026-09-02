import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const items = useMemo(() => mainItems, []);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, []);

  // シングルクリック＝画面一覧を開く / ダブルクリック＝Top へ遷移
  const handleTriggerClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      setOpen(false);
      navigate("/");
      return;
    }
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      setOpen(true);
    }, 250);
  };

  return (
    <>
      <button
        type="button"
        className="page-menu-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="ページ一覧を開く（ダブルクリックでTopへ）"
        onClick={handleTriggerClick}
      >
        <span aria-hidden="true" />
      </button>

      {open && (
        <div className="page-menu-backdrop" role="presentation">
          <section
            className="page-menu-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="page-menu-title"
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
