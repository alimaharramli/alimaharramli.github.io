'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <span className="text-[#9cff93] text-6xl font-black">404</span>
      <p className="text-slate-400 text-sm uppercase tracking-widest">LOG_NOT_FOUND</p>
      <Link
        href="/"
        className="flex items-center gap-2 text-[#9cff93] font-bold uppercase tracking-tighter"
      >
        <ArrowLeft size={16} /> BACK_TO_TERMINAL
      </Link>
    </div>
  );
}
