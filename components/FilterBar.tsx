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
  `inline-block border-b pb-1 text-xs font-semibold uppercase tracking-[0.25em] transition-colors ${
    active
      ? "border-neutral-900 text-neutral-900"
      : "border-transparent text-neutral-400 hover:text-neutral-900"
  }`;
const listClass =
  "flex gap-6 overflow-x-auto whitespace-nowrap pb-1 lg:flex-col lg:gap-4 lg:overflow-visible";

const headingClass =
  "mb-3 text-[10px] uppercase tracking-[0.3em] text-neutral-400";

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
    <nav
      aria-label="Bộ lọc sản phẩm"
      className="mb-8 space-y-6 border-b border-neutral-200 pb-6 lg:sticky lg:top-28 lg:mb-0 lg:self-start lg:border-b-0 lg:pb-0"
    >
      <div>
        <h2 className={headingClass}>Danh mục</h2>
        <ul className={listClass}>
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
      </div>

      <div>
        <h2 className={headingClass}>Tình trạng</h2>
        <ul className={listClass}>
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
    </nav>
  );
}
