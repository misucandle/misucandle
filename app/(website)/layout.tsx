import "../globals.css";
import { NavBar } from "@/components/NavBar";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen font-sans text-neutral-900 antialiased md:flex bg-white">
      <NavBar />
      <main className="min-w-0 flex-1 px-4 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
