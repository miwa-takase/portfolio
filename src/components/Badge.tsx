import type { Status } from "../data/features";
import { statusShort } from "../data/features";
import { cx } from "../lib/util";

const styles: Record<Status, { wrap: string; dot: string }> = {
  live: { wrap: "text-accent border-accent", dot: "bg-accent" },
  sample: { wrap: "text-accent-soft border-accent/40", dot: "bg-accent" },
  soon: { wrap: "text-muted border-line", dot: "bg-muted" },
};

export default function Badge({ status }: { status: Status }) {
  const s = styles[status];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-sm uppercase tracking-widest",
        s.wrap,
      )}
    >
      <span className={cx("h-2 w-2 rounded-full", s.dot)} />
      {statusShort(status)}
    </span>
  );
}
