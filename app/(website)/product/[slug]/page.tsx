import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProduct,
  getAvailability,
  stockLabel,
  optimizeImage,
  getImages,
} from "@/lib/sanity";
import { ProductGallery } from "@/components/ProductGallery";
import { formatPrice } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export default function ProductPage({ params }: { params: Params }) {
  return (
    <div>
      <Link
        href="/"
        className="text-xs uppercase tracking-[0.25em] text-neutral-500 hover:text-black"
      >
        ← Quay lại
      </Link>

      <Suspense
        fallback={
          <p className="py-20 text-center text-xs uppercase tracking-[0.3em] text-neutral-400">
            Đang tải...
          </p>
        }
      >
        <ProductDetail params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const availability = getAvailability(p);
  const out = availability === "out_of_stock";
  const images = getImages(p).map((img) => ({
    ...img,
    url: optimizeImage(img.url, 1200),
  }));

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-2">
      <ProductGallery images={images} />

      <div className="self-center">
        {p.category && (
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
            {p.category.title}
          </p>
        )}
        <h1 className="mt-3 text-2xl font-semibold uppercase tracking-[0.3em]">
          {p.name}
        </h1>
        <p className="mt-4 font-serif text-3xl italic">
          {formatPrice(p.price)}
        </p>

        <dl className="mt-8 space-y-3 text-sm">
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-neutral-400">SKU</dt>
            <dd>{p.sku}</dd>
          </div>
          {p.notes && (
            <div className="flex gap-4">
              <dt className="w-36 shrink-0 text-neutral-400">
                Mùi hương chính
              </dt>
              <dd>{p.notes}</dd>
            </div>
          )}
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-neutral-400">Tình trạng</dt>
            <dd
              className={
                availability === "out_of_stock"
                  ? "text-red-500"
                  : availability === "pre_order"
                    ? "text-amber-700"
                    : ""
              }
            >
              {stockLabel(p)}
            </dd>
          </div>
        </dl>

        {p.description && (
          <p className="mt-8 whitespace-pre-line leading-relaxed text-neutral-600">
            {p.description}
          </p>
        )}
      </div>
    </div>
  );
}
