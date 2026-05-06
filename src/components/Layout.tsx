import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { ShieldCheck } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans pb-16 md:pb-0">
      <Sidebar />
      <main className="flex-1 px-4 py-6 sm:p-8 md:p-12 overflow-y-auto">
        <div className="md:hidden flex items-center justify-center gap-2 mb-6">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">LawGo</span>
        </div>
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
