'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import SmoothScroll from '@/components/shared/SmoothScroll';

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return children;
  }

  return (
    <>
      <SmoothScroll />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
