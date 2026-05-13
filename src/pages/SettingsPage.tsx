import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'system');

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Layout>
      <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white ">Pengaturan</h1>
          <p className="text-slate-500 dark:text-slate-400  mt-2">Kelola preferensi akun dan aplikasi Anda.</p>
        </header>

        <section className="bg-white dark:bg-slate-800  border border-slate-200 dark:border-slate-700  rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none max-w-2xl mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white  mb-6">Profil Pengguna</h3>
          
          {isLoggedIn ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-700/50 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-750">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 dark:text-blue-400 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white ">{user?.displayName || 'Set in Google'}</h4>
                  <p className="text-slate-500 dark:text-slate-400  text-sm">{user?.email}</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 dark:border-slate-700">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-rose-600 dark:text-rose-400  font-medium hover:text-rose-700  transition px-4 py-2 hover:bg-rose-50 dark:bg-rose-500/10 dark:hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 ">Anda belum masuk. Silakan login untuk melihat profil Anda.</p>
          )}
        </section>

        <section className="bg-white dark:bg-slate-800  border border-slate-200 dark:border-slate-700  rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none max-w-2xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white  mb-6">Tampilan</h3>
          
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300  mb-3">Pilih Mode Tampilan</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
               <button 
                 onClick={() => setTheme('light')}
                 className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition cursor-pointer ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold dark:bg-indigo-500/20 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50   dark:text-slate-400'}`}
               >
                 <Sun className="w-4 h-4" />
                 Terang
               </button>
               <button 
                 onClick={() => setTheme('dark')}
                 className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition cursor-pointer ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold dark:bg-indigo-500/20 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50   dark:text-slate-400'}`}
               >
                 <Moon className="w-4 h-4" />
                 Gelap
               </button>
               <button 
                 onClick={() => setTheme('system')}
                 className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition cursor-pointer ${theme === 'system' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold dark:bg-indigo-500/20 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50   dark:text-slate-400'}`}
               >
                 <Monitor className="w-4 h-4" />
                 Sistem
               </button>
            </div>
          </div>
        </section>
    </Layout>
  );
}
