import { NavLink } from 'react-router-dom';
import { Home, FileText, History, Settings } from 'lucide-react';

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <nav className="flex items-center justify-around p-3">
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>
        <NavLink 
          to="/analyze" 
          className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <FileText className="w-6 h-6" />
          <span className="text-[10px] font-medium">Analisis</span>
        </NavLink>
        <NavLink 
          to="/history" 
          className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-medium">Riwayat</span>
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profil</span>
        </NavLink>
      </nav>
    </div>
  );
}
