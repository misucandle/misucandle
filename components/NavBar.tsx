"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "PORTFOLIO", href: "/portfolio" },
  { name: "ABOUT ME", href: "/about" },
  { name: "CONTACT US", href: "/contact" },
];

function Logo({ onClick }: { onClick?: () => void }) {
  // Placeholder: thay bằng <Image src="/logo.svg" .../> khi có logo thật
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Misu Candle - Trang chủ"
      className="flex h-28 w-28 items-center justify-center rounded-full border border-amber-700/40 p-3 text-center text-[10px] uppercase leading-relaxed tracking-[0.25em] text-amber-800"
    >
      Misu
      <br />
      Candle
    </Link>
  );
}

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setIsOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white p-4 md:hidden">
        <Link href="/" className="text-lg font-bold tracking-[0.25em]">
          MISU CANDLE
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Mở menu"
          className="p-2 text-neutral-700 hover:text-black"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={close}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between bg-white p-8",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:sticky md:top-0 md:h-screen md:shrink-0 md:translate-x-0 md:p-12 md:w-72",
        ].join(" ")}
      >
        <div>
          <div className="mb-6 flex justify-end md:hidden">
            <button onClick={close} aria-label="Đóng menu" className="p-1">
              <X size={20} />
            </button>
          </div>

          <Logo onClick={close} />

          <nav className="mt-16 flex flex-col gap-8 text-sm font-semibold uppercase tracking-[0.3em]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={close}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`transition-colors hover:text-amber-700 ${
                  isActive(link.href) ? "text-amber-700" : "text-neutral-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex gap-5 text-neutral-500">
          <a href="#" aria-label="Instagram" className="hover:text-black">
            {/* <Instagram size={18} /> */}
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-black">
            {/* <Facebook size={18} /> */}
          </a>
        </div>
      </aside>
    </>
  );
}
