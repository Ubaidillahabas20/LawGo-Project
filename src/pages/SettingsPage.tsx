import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Pengaturan</h1>
          <p className="text-slate-500 mt-2">Kelola preferensi akun dan aplikasi Anda.</p>
        </header>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm max-w-2xl">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Profil Pengguna</h3>
          
          {isLoggedIn ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{user?.name}</h4>
                  <p className="text-slate-500 text-sm">{user?.email}</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 text-rose-600 font-medium hover:text-rose-700 transition px-4 py-2 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">Anda belum masuk. Silakan login untuk melihat profil Anda.</p>
          )}
        </section>
      </main>
    </div>
  );
}
