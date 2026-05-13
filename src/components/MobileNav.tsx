import { NavLink } from 'react-router-dom';
import { Home, FileText, History, Settings, Plus } from 'lucide-react';

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50">
      <nav className="flex items-center justify-around p-3 relative">
        <NavLink 
          to="/history" 
          className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-medium">Riwayat</span>
        </NavLink>
        
        <NavLink 
          to="/analyze" 
          onClick={() => window.dispatchEvent(new Event('clearAnalysisEvent'))}
          className={({isActive}) => `flex flex-col items-center -mt-8 relative z-10 transition group`}
        >
          <div className="bg-indigo-600 dark:bg-indigo-500 text-white rounded-full p-4 shadow-lg shadow-indigo-200 group-hover:bg-indigo-700 transition">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1">Analisis</span>
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profil</span>
        </NavLink>
      </nav>
    </div>
  );
}
