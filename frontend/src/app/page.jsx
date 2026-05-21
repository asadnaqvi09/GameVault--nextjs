"use client";

import Articles from "@/components/sections/landing_page/Articles";
import Category_Bar from "@/components/sections/landing_page/Category_Bar";
import Hero_Section from "@/components/sections/landing_page/Hero_Section";
import Single_Game from "@/components/sections/landing_page/Single_Game";
import Top_Sellers from "@/components/sections/landing_page/Top_Sellers";
import { usePathname } from "next/navigation";

export default function RouteLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }
  return (
    <>
      <main className="py-8 px-2 gap-20 flex flex-col">
        <Hero_Section />
        <Category_Bar />
        <Top_Sellers />
        <Single_Game />
        <Articles />
      </main>
    </>
  );
}