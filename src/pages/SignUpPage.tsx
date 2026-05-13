import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
  const { loginWithGoogle, registerWithEmail, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/analyze');
    }
  }, [isLoggedIn, navigate]);

  const handleGoogleAuth = async () => {
    await loginWithGoogle();
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerWithEmail(email, password);
      // Optional: Update profile with name here if needed later
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan gunakan email lain atau masuk dengan akun tersebut.');
      } else if (err.code === 'auth/weak-password') {
        setError('Kata sandi terlalu lemah. Minimal 6 karakter.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Metode login Email/Kata Sandi belum diaktifkan di Firebase Console.');
      } else {
        setError('Gagal mendaftar: ' + (err.message || 'Terjadi kesalahan'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      
      {/* Left Pane - Welcome Info (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 dark:bg-indigo-500 text-white flex-col justify-center px-16 xl:px-24 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white dark:bg-slate-800/10 p-2 rounded-xl inline-block mb-8 border border-white/20">
             <span className="text-xl">🚀</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
            Selamat Datang di LawGo!
          </h1>
          <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
            Satu langkah lagi untuk memahami kontrak Anda tanpa pusing.
          </p>
          
          <ul className="space-y-4 mb-12">
            <li className="flex items-center gap-3 text-indigo-50">
              <CheckCircle2 className="w-5 h-5 text-indigo-300" />
              <span>Analisis kontrak instan dengan AI</span>
            </li>
            <li className="flex items-center gap-3 text-indigo-50">
              <CheckCircle2 className="w-5 h-5 text-indigo-300" />
              <span>Deteksi klausul berbahaya</span>
            </li>
            <li className="flex items-center gap-3 text-indigo-50">
              <CheckCircle2 className="w-5 h-5 text-indigo-300" />
              <span>Rekomendasi perbaikan yang jelas</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Pane - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:p-16 xl:p-24 bg-white dark:bg-slate-800 relative">
        <Link to="/" className="lg:absolute lg:top-12 lg:left-12 flex items-center gap-2 mb-12 lg:mb-0 w-max mx-auto lg:mx-0">
          <div className="bg-indigo-600 dark:bg-indigo-500 p-1.5 rounded-lg flex items-center justify-center">
             <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">LawGo</span>
        </Link>

        <div className="w-full max-w-sm sm:max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Daftar Akun Baru</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
            Mulai analisis gratis hari ini. Amankan hak Anda!
          </p>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Yanto Suprianto"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yanto@gmail.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Buat Kata Sandi</label>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-sm dark:shadow-none shadow-indigo-200 hover:bg-indigo-700 transition disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? 'Mendaftar...' : 'Daftar Akun'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
             <div className="flex-1 h-px bg-slate-200"></div>
             <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Atau daftar dengan</span>
             <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
             <button 
               onClick={handleGoogleAuth}
               className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50 transition"
             >
               <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Google</span>
             </button>
             <button 
               onClick={handleGoogleAuth}
               className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50 transition"
             >
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
               </svg>
               <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Facebook</span>
             </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
             Sudah punya akun? <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
