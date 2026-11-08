import Link from "next/link";

type Option = { label: string; value: string; count: number };

function buildHref(params: { status?: string; category?: string }) {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.status) sp.set("status", params.status);
  const qs = sp.toString();
  return qs ? `/?${qs}` : "/";
}

const linkClass = (active: boolean) =>
  `border-b pb-1 text-xs font-semibold uppercase tracking-[0.25em] transition-colors ${
    active
      ? "border-neutral-900 text-neutral-900"
      : "border-transparent text-neutral-400 hover:text-neutral-900"
  }`;

export function FilterBar({
  status,
  category,
  categoryOptions,
  statusOptions,
}: {
  status: string;
  category: string;
  categoryOptions: Option[];
  statusOptions: Option[];
}) {
  return (
    <div className="mb-10 space-y-5 border-b border-neutral-200 pb-6">
      {/* Hàng 1: Category */}
      <ul className="flex gap-6 overflow-x-auto whitespace-nowrap pb-1">
        {categoryOptions.map((o) => (
          <li key={o.value || "all"}>
            <Link
              href={buildHref({ category: o.value, status })}
              scroll={false}
              className={linkClass(category === o.value)}
            >
              {o.label} <span className="font-normal">({o.count})</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Hàng 2: Tình trạng (bấm lại để bỏ lọc) */}
      <ul className="flex items-center gap-6 overflow-x-auto whitespace-nowrap pb-1">
        <li className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
          Tình trạng:
        </li>
        {statusOptions.map((o) => {
          const active = status === o.value;
          return (
            <li key={o.value}>
              <Link
                href={buildHref({ category, status: active ? "" : o.value })}
                scroll={false}
                className={linkClass(active)}
              >
                {o.label} <span className="font-normal">({o.count})</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
