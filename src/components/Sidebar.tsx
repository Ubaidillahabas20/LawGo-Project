import { NavLink } from 'react-router-dom';
import { Home, FileText, History, Settings, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between py-6 min-h-screen">
      <div>
        <div className="px-6 mb-10 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">LawGo</span>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Home className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink 
            to="/analyze" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <FileText className="w-5 h-5" /> Analisis Dokumen
          </NavLink>
          <NavLink 
            to="/history" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <History className="w-5 h-5" /> Riwayat
          </NavLink>
        </nav>
      </div>

      <div className="px-4 flex flex-col gap-2">
        <NavLink 
          to="/settings" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Settings className="w-5 h-5" /> Pengaturan
        </NavLink>
        <NavLink 
          to="/help" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <HelpCircle className="w-5 h-5" /> Bantuan
        </NavLink>
      </div>
    </aside>
  );
}
