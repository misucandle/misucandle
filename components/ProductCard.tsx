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
              sizes="(min-width:1280px) 22vw, (min-width:768px) 30vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs tracking-widest text-neutral-400">
              NO IMAGE
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="truncate text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm">
            {product.name}
          </h3>

          <div className="shrink-0 text-right">
            <p className="font-serif text-xl italic">
              {formatPrice(product.price)}
            </p>
            <p
              className={`text-[10px] uppercase tracking-widest ${statusColor}`}
            >
              {stockLabel(product)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
