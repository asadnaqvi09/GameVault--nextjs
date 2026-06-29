"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const handleResize = () => lenis.resize();
    handleResize();
    const resizeTimer = setTimeout(handleResize, 350);
    window.addEventListener("load", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("load", handleResize);
    };
  }, [pathname]);

  return null;
}
