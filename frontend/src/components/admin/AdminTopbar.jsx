'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, Store, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminTopbar({ title, onMenuOpen }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuOpen}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg sm:text-xl font-black text-gray-900 truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 hover:text-[#5B42F3] hover:bg-[#5B42F3]/5 rounded-lg transition-colors cursor-pointer"
          >
            <Store size={16} />
            Back to store
          </Link>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
            <User size={16} className="text-[#5B42F3]" />
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-gray-900 max-w-[120px] truncate">{user?.userName}</p>
              <p className="text-[10px] text-gray-400 max-w-[120px] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
