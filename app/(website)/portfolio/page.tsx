import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts, getPortfolioImage, optimizeImage } from "@/lib/sanity";

export default function PortfolioPage() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold uppercase tracking-[0.3em]">
        Portfolio
      </h1>

      <Suspense
        fallback={
          <p className="py-20 text-center text-xs uppercase tracking-[0.3em] text-neutral-400">
            Đang tải...
          </p>
        }
      >
        <PortfolioGrid />
      </Suspense>
    </section>
  );
}

async function PortfolioGrid() {
  const products = await getProducts();
  const items = products
    .map((p) => ({ p, img: getPortfolioImage(p) }))
    .filter((x) => x.img !== null);

  if (items.length === 0) {
    return (
      <p className="py-20 text-center text-neutral-500">Chưa có ảnh nào.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
      {items.map(({ p, img }, i) => (
        <Link
          key={p._id}
          href={p.slug ? `/product/${p.slug}` : "#"}
          className="group relative block aspect-[4/5] overflow-hidden bg-neutral-100"
        >
          <Image
            src={optimizeImage(img!.url, 800)}
            alt={img!.alt}
            fill
            unoptimized
            priority={i < 4}
            sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
            style={{ objectPosition: img!.position }}
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent)] p-4 text-[11px] uppercase tracking-[0.25em] text-white transition duration-300 md:opacity-0 md:group-hover:opacity-100">
            {p.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
