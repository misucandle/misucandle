import { NavBar } from "@/components/NavBar";

export default function WebsiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <NavBar />
      <main className="flex-1 p-6 md:p-12 bg-white">{children}</main>
    </div>
  );
}
