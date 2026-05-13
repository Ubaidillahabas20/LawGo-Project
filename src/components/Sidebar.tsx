import { NavLink } from 'react-router-dom';
import { Home, Clock, Plus, Scale, FolderLock, Smile, Shield } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-slate-800 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 dark:border-slate-800 hidden md:flex flex-col justify-between py-6 min-h-screen">
      <div>
        <div className="px-6 mb-8 flex items-center justify-start gap-2">
          <div className="bg-indigo-600 dark:bg-indigo-500  p-1.5 rounded-lg flex items-center justify-center">
             <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white  leading-none">LawGo</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400  font-medium">AI Legal Assistant</span>
          </div>
        </div>

        <div className="px-4 mb-6">
           <NavLink to="/analyze" onClick={() => window.dispatchEvent(new Event('clearAnalysisEvent'))} className="w-full flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700  dark:hover:bg-indigo-600  text-white px-4 py-3 rounded-xl font-medium transition shadow-sm dark:shadow-none shadow-indigo-200 ">
             <Plus className="w-5 h-5" /> Analisis Dokumen
           </NavLink>
        </div>

        <nav className="flex flex-col px-2 gap-1">
          <NavLink 
            to="/analyze" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition cursor-pointer ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400  ' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800/50 hover:text-slate-900 dark:text-white  dark:hover:bg-slate-800/50 dark:hover:text-slate-200'}`}
          >
            <Home className="w-5 h-5" /> Beranda
          </NavLink>
          <NavLink 
            to="/history" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition cursor-pointer ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400  ' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800/50 hover:text-slate-900 dark:text-white  dark:hover:bg-slate-800/50 dark:hover:text-slate-200'}`}
          >
            <Clock className="w-5 h-5" /> Riwayat Analisis
          </NavLink>
        </nav>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Butuh Bantuan Card */}
        <div className="bg-slate-50 dark:bg-slate-800/50  p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 dark:border-slate-800 flex flex-col gap-2 relative overflow-hidden">
           <Scale className="absolute right-[-10px] bottom-[-10px] w-20 h-20 text-orange-400 opacity-20 dark:opacity-10" />
           <h4 className="font-bold text-slate-800 dark:text-slate-200  text-sm">Butuh Bantuan?</h4>
           <p className="text-xs text-slate-500 dark:text-slate-400  leading-relaxed pr-2 relative z-10">Tanya AI atau konsultasi dengan ahli hukum.</p>
           <NavLink to="/analyze" onClick={() => window.dispatchEvent(new Event('clearAnalysisEvent'))} className="text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:bg-indigo-500/10    dark:hover:bg-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg mt-1 w-max transition relative z-10 flex items-center justify-center cursor-pointer">
             Mulai Chat
           </NavLink>
        </div>

        {/* Adjustments */}
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-[10px] text-slate-400 dark:text-slate-500  font-medium">© 2024 LawGo</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500  font-medium">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
