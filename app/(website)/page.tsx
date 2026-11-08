import { Suspense } from "react";
import { getProducts, getAvailability, type Product } from "@/lib/sanity";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/FilterBar";

type SearchParams = Promise<{ status?: string; category?: string }>;

export default function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <p className="py-20 text-center text-xs uppercase tracking-[0.3em] text-neutral-400">
          Đang tải...
        </p>
      }
    >
      <Products searchParams={searchParams} />
    </Suspense>
  );
}

const matchStatus = (p: Product, s: string) => !s || getAvailability(p) === s;
const matchCategory = (p: Product, c: string) => !c || p.category?.slug === c;

async function Products({ searchParams }: { searchParams: SearchParams }) {
  const { status = "", category = "" } = await searchParams;
  const products = await getProducts();

  // Danh sách category lấy động từ dữ liệu
  const catMap = new Map<string, { title: string; order: number }>();
  products.forEach((p) => {
    if (p.category) {
      catMap.set(p.category.slug, {
        title: p.category.title,
        order: p.category.order ?? 999,
      });
    }
  });
  const cats = [...catMap].sort(
    (a, b) => a[1].order - b[1].order || a[1].title.localeCompare(b[1].title),
  );

  const filtered = products.filter(
    (p) => matchStatus(p, status) && matchCategory(p, category),
  );

  const byStatus = products.filter((p) => matchStatus(p, status));
  const byCategory = products.filter((p) => matchCategory(p, category));

  const categoryOptions = [
    { label: "All", value: "", count: byStatus.length },
    ...cats.map(([slug, { title }]) => ({
      label: title,
      value: slug,
      count: byStatus.filter((p) => p.category?.slug === slug).length,
    })),
  ];

  const statusOptions = [
    {
      label: "Còn hàng",
      value: "in_stock",
      count: byCategory.filter((p) => getAvailability(p) === "in_stock").length,
    },
    {
      label: "Pre-order",
      value: "pre_order",
      count: byCategory.filter((p) => getAvailability(p) === "pre_order")
        .length,
    },
    {
      label: "Hết hàng",
      value: "out_of_stock",
      count: byCategory.filter((p) => getAvailability(p) === "out_of_stock")
        .length,
    },
  ];

  return (
    <>
      <FilterBar
        status={status}
        category={category}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
      />

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-neutral-500">
          Không có sản phẩm phù hợp.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
