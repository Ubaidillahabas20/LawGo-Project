import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { Bell, Crown, Search, Shield, Scale, FolderLock, Smile } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
  headerContent?: ReactNode;
}

export default function Layout({ children, headerContent }: LayoutProps) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-900 text-slate-900 dark:text-white dark:text-slate-100 font-sans pb-16 md:pb-0 transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-transparent">
           <div className="flex-1">
              {/* This allows injectng left-side header content per page */}
              {headerContent}
           </div>

           <div className="flex items-center gap-5 pl-4">
              <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm dark:shadow-none transition">
                <Crown className="w-4 h-4 text-amber-200" /> Upgrade ke Premium
              </button>
              
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-800"></span>
              </button>

              <Link to="/settings" className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700  hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition p-1.5 rounded-xl cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400  font-bold overflow-hidden">
                   {user?.photoURL ? (
                     <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     user?.displayName ? user.displayName.charAt(0) : 'U'
                   )}
                </div>
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200">Halo, {user?.displayName?.split(' ')[0] || 'User'}</span>
                  <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </Link>
           </div>
        </header>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 bg-white dark:bg-slate-800  border-b border-slate-200 dark:border-slate-700 ">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 dark:bg-indigo-500 p-1.5 rounded-lg">
               <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white  leading-none">LawGo</span>
          </div>
           <div className="flex items-center gap-3">
             <button onClick={() => alert('Fitur Pencarian segera hadir!')} className="text-slate-400 dark:text-slate-500 cursor-pointer">
               <Search className="w-5 h-5" />
             </button>
             <button onClick={() => alert('Tidak ada notifikasi saat ini.')} className="text-slate-400 dark:text-slate-500 relative cursor-pointer">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white dark:border-slate-800"></span>
             </button>
             <Link to="/settings" className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-500/20 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400  font-bold overflow-hidden text-xs cursor-pointer">
                 {user?.displayName ? user.displayName.charAt(0) : 'U'}
             </Link>
          </div>
        </div>

        {/* Mobile Quick Settings */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50  border-b border-slate-200 dark:border-slate-700  overflow-x-auto hide-scrollbar shrink-0">
          <Link to="/analyze" onClick={() => window.dispatchEvent(new Event('clearAnalysisEvent'))} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800  border border-indigo-200 dark:border-indigo-800  rounded-lg text-indigo-600 dark:text-indigo-400  text-[11px] font-semibold shadow-sm dark:shadow-none hover:bg-indigo-50 dark:bg-indigo-500/10 dark:hover:bg-indigo-900/20 transition cursor-pointer">
            <Scale className="w-3.5 h-3.5" /> Mulai Chat
          </Link>
        </div>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
