'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Gamepad2,
  MessageSquare,
  Tags,
  Mail,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/games', label: 'Games', icon: Gamepad2 },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/genres', label: 'Genres', icon: Tags },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
];

export default function AdminSidebar({ mobileOpen, onMobileClose }) {
  const pathname = usePathname();

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/admin" className="block cursor-pointer" onClick={onMobileClose}>
          <p className="text-lg font-black text-white tracking-tight">GameVault</p>
          <p className="text-xs font-semibold text-indigo-200 uppercase tracking-widest mt-0.5">Admin</p>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                active
                  ? 'bg-white text-[#5B42F3] shadow-sm'
                  : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#5B42F3] min-h-screen flex-col">
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[250] flex">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onMobileClose}
            className="absolute inset-0 bg-black/50 cursor-pointer"
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#5B42F3] min-h-screen shadow-2xl">
            <button
              type="button"
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
