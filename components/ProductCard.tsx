import Image from "next/image";
import Link from "next/link";
import {
  Product,
  getAvailability,
  stockLabel,
  optimizeImage,
  getPrimaryImage,
} from "@/lib/sanity";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const availability = getAvailability(product);
  const out = availability === "out_of_stock";
  const cover = getPrimaryImage(product);
  const href = product.slug ? `/product/${product.slug}` : "#";

  const statusColor =
    availability === "out_of_stock"
      ? "text-red-500"
      : availability === "pre_order"
        ? "text-amber-700"
        : "text-neutral-500";

  return (
    <article className="group">
      <Link href={href} className="block">
        <div className="relative aspect-4/5 overflow-hidden bg-neutral-100">
          {cover ? (
            <Image
              src={optimizeImage(cover.url)}
              alt={cover.alt}
              fill
              unoptimized
              sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs tracking-widest text-neutral-400">
              NO IMAGE
            </div>
          )}

          {availability !== "in_stock" && (
            <span className="absolute left-3 top-3 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em]">
              {availability === "pre_order" ? "Pre-order" : "Hết hàng"}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold uppercase tracking-[0.3em]">
              {product.name}
            </h3>
            <p className="mt-1 text-base text-neutral-500">
              {product.category?.title ?? "Chưa phân loại"}
            </p>
            {product.notes && (
              <p className="mt-1 text-sm italic text-neutral-400">
                {product.notes}
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <p className="font-[family-name:var(--font-serif)] text-xl italic">
              {formatPrice(product.price)}
            </p>
            <p
              className={`mt-1 text-xs uppercase tracking-widest ${statusColor}`}
            >
              {stockLabel(product)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
