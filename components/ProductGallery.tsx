"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Img = { url: string; alt: string };

export function ProductGallery({ images }: { images: Img[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = images.length;

  if (total === 0) {
    return (
      <div className="flex aspect-4/5 items-center justify-center bg-neutral-100 text-xs tracking-widest text-neutral-400">
        NO IMAGE
      </div>
    );
  }

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(total - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  };

  const arrow =
    "absolute top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 text-neutral-900 transition hover:bg-white disabled:pointer-events-none disabled:opacity-0";

  return (
    <div>
      <div
        className="relative"
        role="region"
        aria-roledescription="carousel"
        aria-label="Ảnh sản phẩm"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto bg-neutral-100 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <div
              key={img.url + i}
              className="relative aspect-4/5 w-full shrink-0 snap-center"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                unoptimized
                priority={i === 0}
                sizes="(min-width:1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Ảnh trước"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className={`${arrow} left-3`}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="Ảnh sau"
              onClick={() => goTo(index + 1)}
              disabled={index === total - 1}
              className={`${arrow} right-3`}
            >
              <ChevronRight size={22} />
            </button>
            <span className="absolute bottom-3 right-3 bg-white/80 px-2 py-1 text-[10px] tracking-[0.2em]">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <li key={img.url + i} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === index}
                className={`relative block h-16 w-14 overflow-hidden border transition ${
                  i === index
                    ? "border-neutral-900"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  unoptimized
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
