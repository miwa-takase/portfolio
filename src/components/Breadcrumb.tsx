import { Fragment } from "react";
import { Link } from "react-router-dom";

export type Crumb = {
  label: string;
  /** リンク先：省略した場合は現在地としてリンクにしない */
  to?: string;
};

type BreadcrumbProps = {
  /** Home に続くパンくず：Home は常に先頭に付与される */
  items: Crumb[];
  /** nav に追加するクラス（ページ上部の余白調整など） */
  className?: string;
};

// 全ページ共通のパンくずリスト
export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const trail: Crumb[] = [{ label: "Home", to: "/" }, ...items];

  return (
    <nav
      className={`breadcrumb flex items-center gap-2 text-xs tracking-wide text-muted ${className}`.trim()}
      aria-label="パンくずリスト"
    >
      {trail.map((crumb, i) => {
        const isLast = i === trail.length - 1;
        return (
          <Fragment key={`${crumb.label}-${i}`}>
            {i > 0 && <span className="text-line">/</span>}
            {crumb.to && !isLast ? (
              <Link
                to={crumb.to}
                className="text-paper-dim hover:text-accent-soft"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className="text-paper-dim"
                aria-current={isLast ? "page" : undefined}
              >
                {crumb.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
