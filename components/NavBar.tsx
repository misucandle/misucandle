"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "PORTFOLIO", href: "/portfolio" },
  { name: "ABOUT ME", href: "/about" },
  { name: "CONTACT US", href: "/contact" },
];

function Logo({ onClick }: { onClick?: () => void }) {
  const LOGO = { src: "/MiSu.png", width: 120, height: 120 };

  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Misu Candle - Trang chủ"
      className="block shrink-0"
    >
      <Image
        src={LOGO.src}
        alt="Misu Candle"
        width={LOGO.width}
        height={LOGO.height}
        priority
        unoptimized
        className="h-18 w-auto md:h-20"
      />
    </Link>
  );
}

function LinkList({
  pathname,
  direction,
  onClick,
}: {
  pathname: string | null;
  direction: "row" | "column";
  onClick: () => void;
}) {
  const isActive = (href: string) =>
    pathname !== null &&
    (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      className={
        direction === "row" ? "flex items-center gap-10" : "flex flex-col gap-6"
      }
    >
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          onClick={onClick}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={`text-xs font-semibold uppercase tracking-[0.3em] transition-colors hover:text-amber-700 ${
            isActive(link.href) ? "text-amber-700" : "text-neutral-900"
          }`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}

function ActiveLinkList({
  direction,
  onClick,
}: {
  direction: "row" | "column";
  onClick: () => void;
}) {
  const pathname = usePathname();
  return (
    <LinkList pathname={pathname} direction={direction} onClick={onClick} />
  );
}

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 md:px-10">
        <Logo onClick={close} />

        {/* Desktop */}
        <div className="hidden md:block">
          <Suspense
            fallback={
              <LinkList pathname={null} direction="row" onClick={close} />
            }
          >
            <ActiveLinkList direction="row" onClick={close} />
          </Suspense>
        </div>

        {/* Nút mở menu trên mobile */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isOpen}
          className="p-2 text-neutral-700 hover:text-black md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 py-6 md:hidden">
          <Suspense
            fallback={
              <LinkList pathname={null} direction="column" onClick={close} />
            }
          >
            <ActiveLinkList direction="column" onClick={close} />
          </Suspense>
        </div>
      )}
    </header>
  );
}
