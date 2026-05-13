import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, ArrowLeft, Mail, KeyRound, LockKeyhole } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'new_password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(otp) setStep('new_password');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newPassword) {
      // Simulate password reset and navigation to login
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC] flex font-sans">
      
      {/* Right/Main Pane - Reset Form */}
      <div className="w-full flex flex-col justify-center px-6 py-12 sm:p-16 xl:p-24 bg-white dark:bg-slate-800 relative max-w-2xl mx-auto border-x border-slate-100 dark:border-slate-700/50 shadow-sm dark:shadow-none min-h-screen items-center">
        <Link to="/login" className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 transition font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Login
        </Link>

        <Link to="/" className="flex items-center gap-2 mb-12 mt-12 sm:mt-0">
          <div className="bg-indigo-600 dark:bg-indigo-500 p-1.5 rounded-lg flex items-center justify-center">
             <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">LawGo</span>
        </Link>

        <div className="w-full max-w-sm sm:max-w-md mx-auto">
          {step === 'email' && (
            <>
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-sm dark:shadow-none">
                 <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Lupa Kata Sandi?</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                Jangan khawatir. Masukkan email yang terdaftar, dan kami akan mengirimkan kode OTP untuk mereset kata sandi Anda.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Terdaftar</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-sm dark:shadow-none shadow-indigo-200 hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  Kirim Kode OTP
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-sm dark:shadow-none">
                 <KeyRound className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Masukkan Kode OTP</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                Kami telah mengirimkan 6 digit kode OTP ke <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>. Silakan periksa kotak masuk atau folder spam Anda.
              </p>

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Kode OTP</label>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition text-center tracking-widest text-2xl font-mono text-slate-700 dark:text-slate-300"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={otp.length !== 6}
                  className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-sm dark:shadow-none shadow-indigo-200 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verifikasi OTP
                </button>
              </form>
            </>
          )}

          {step === 'new_password' && (
            <>
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-sm dark:shadow-none">
                 <LockKeyhole className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Buat Kata Sandi Baru</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                OTP berhasil diverifikasi! Silakan buat kata sandi baru untuk akun Anda.
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Kata Sandi Baru</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Minimal 8 karakter</p>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-sm dark:shadow-none shadow-indigo-200 hover:bg-indigo-700 transition"
                >
                  Simpan & Masuk
                </button>
              </form>
            </>
          )}

          {step === 'email' && (
            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
               Ingat kata sandi Anda? <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Masuk di sini</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
