import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Zap, Smile, Lock, FileText, Star, ArrowRight, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    
    if (id === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL optionally
        window.history.pushState({}, '', `#${id}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex flex-col font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="px-6 md:px-12 py-5 w-full flex justify-between items-center bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50 z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 dark:bg-indigo-500 p-1.5 rounded-lg flex items-center justify-center">
             <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">LawGo</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">AI Legal Assistant</span>
          </div>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 font-medium text-sm text-slate-600 dark:text-slate-400">
          <a href="#" onClick={(e) => scrollToSection(e, '')} className="text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 pb-1">Beranda</a>
          <a href="#fitur" onClick={(e) => scrollToSection(e, 'fitur')} className="hover:text-indigo-600 dark:text-indigo-400 transition">Fitur</a>
          <a href="#cara-kerja" onClick={(e) => scrollToSection(e, 'cara-kerja')} className="hover:text-indigo-600 dark:text-indigo-400 transition">Cara Kerja</a>
          <a href="#harga" onClick={(e) => scrollToSection(e, 'harga')} className="hover:text-indigo-600 dark:text-indigo-400 transition">Harga</a>
          <a href="#tentang" onClick={(e) => scrollToSection(e, 'tentang')} className="hover:text-indigo-600 dark:text-indigo-400 transition">Tentang</a>
        </nav>
        
        <div className="hidden md:flex items-center gap-3 sm:gap-4">
           <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:text-indigo-700  transition">
             Masuk
           </Link>
           <Link to="/signup" className="hidden sm:inline-flex bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm dark:shadow-none shadow-indigo-200">
             Daftar Gratis
           </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-slate-600 dark:text-slate-400" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[73px] left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50 shadow-lg z-40 px-6 py-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-4 font-medium text-sm text-slate-600 dark:text-slate-400">
            <a href="#" onClick={(e) => scrollToSection(e, '')} className="text-indigo-600 dark:text-indigo-400 font-semibold">Beranda</a>
            <a href="#fitur" onClick={(e) => scrollToSection(e, 'fitur')} className="hover:text-indigo-600 dark:text-indigo-400 transition">Fitur</a>
            <a href="#cara-kerja" onClick={(e) => scrollToSection(e, 'cara-kerja')} className="hover:text-indigo-600 dark:text-indigo-400 transition">Cara Kerja</a>
            <a href="#harga" onClick={(e) => scrollToSection(e, 'harga')} className="hover:text-indigo-600 dark:text-indigo-400 transition">Harga</a>
            <a href="#tentang" onClick={(e) => scrollToSection(e, 'tentang')} className="hover:text-indigo-600 dark:text-indigo-400 transition">Tentang</a>
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
             <Link to="/login" onClick={toggleMobileMenu} className="text-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:text-indigo-700  transition py-2">
               Masuk
             </Link>
             <Link to="/signup" onClick={toggleMobileMenu} className="text-center bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm dark:shadow-none shadow-indigo-200">
               Daftar Gratis
             </Link>
          </div>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-100 mb-6">
                <span className="text-rose-500 text-xs">✨</span>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">AI Untuk Semua, Hukum Untuk Semua</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-bold text-slate-900 dark:text-white mb-6">
                Pahami Kontrak Rumit <br/>
                <span className="text-indigo-600 dark:text-indigo-400">Dalam 1 Menit</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                LawGo membantu Anda memahami dokumen hukum, menemukan risiko tersembunyi, dan memberi rekomendasi jelas dengan bahasa yang mudah dimengerti.
              </p>
              
              <ul className="flex flex-col gap-3 mb-10">
                 <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-sm">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Deteksi klausul berisiko tinggi
                 </li>
                 <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-sm">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Penjelasan sederhana + analogi
                 </li>
                 <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-sm">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Dasar hukum yang jelas & terpercaya
                 </li>
              </ul>

              <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mb-4">
                 <Link to="/analyze" className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3.5 rounded-xl text-sm md:text-base font-semibold hover:bg-indigo-700 transition shadow-sm dark:shadow-none shadow-indigo-200 flex items-center justify-center gap-2">
                    Coba Analisis Sekarang <ArrowRight className="w-4 h-4" />
                 </Link>
                 <Link to="/analyze" className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl text-sm md:text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition shadow-sm dark:shadow-none flex items-center justify-center">
                    Lihat Contoh Analisis
                 </Link>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">Gratis untuk 3 analisis pertama Anda!</p>
           </div>
           
           {/* Hero Illustration Placeholder */}
           <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center mt-10 md:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full blur-3xl opacity-50"></div>
              
              {/* Mockup Card */}
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-xl shadow-slate-200/50 p-6 w-[280px] md:w-[320px] z-10 relative rotate-2 hover:rotate-0 transition duration-500 scale-90 md:scale-100">
                 <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700/50 pb-2">Kontrak Sewa</div>
                 
                 <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-2">Pasal 4. Hak Akses Pemilik</h4>
                 <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">Pihak pertama berhak memasuki properti sewaktu-waktu tanpa pemberitahuan terlebih dahulu.</p>
                 
                 <div className="inline-block px-2 py-1 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold mb-6">RISIKO TINGGI</div>
                 
                 <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-4 mt-auto">
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Skor Risiko</span>
                    <div className="flex items-end gap-1">
                       <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 leading-none">78</span>
                       <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium pb-0.5">/100</span>
                    </div>
                 </div>
                 <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold float-right mt-1">Tinggi</span>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/4 -left-2 md:-left-8 bg-white dark:bg-slate-800 p-2 md:p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700/50 z-20 animate-bounce">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
              </div>
              <div className="absolute bottom-1/4 -right-2 md:-right-4 bg-indigo-600 dark:bg-indigo-500 p-2 md:p-3 rounded-xl shadow-lg shadow-indigo-200 z-20">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              {/* Add some sparkly stars */}
              <div className="absolute top-10 right-10 md:right-20 text-purple-300">✨</div>
              <div className="absolute top-1/2 -left-6 md:-left-12 text-indigo-300">✦</div>
              <div className="absolute bottom-10 md:bottom-20 left-10 text-rose-300">✦</div>
           </div>
        </section>

        {/* Features Section */}
        <section id="fitur" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-100 dark:border-slate-700/50">
           <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Kenapa Memilih LawGo?</h2>
              <p className="text-slate-500 dark:text-slate-400">Dirancang untuk melindungi hak Anda dalam setiap dokumen.</p>
           </div>
           
           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-8 rounded-2xl flex flex-col items-center text-center shadow-sm dark:shadow-none">
                 <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center rounded-xl mb-5">
                    <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">Akurat & Terpercaya</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Didukung AI canggih dan referensi hukum Indonesia yang valid.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-8 rounded-2xl flex flex-col items-center text-center shadow-sm dark:shadow-none">
                 <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center rounded-xl mb-5">
                    <Zap className="w-6 h-6 text-orange-500" />
                 </div>
                 <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">Cepat & Praktis</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Dapatkan hasil analisis lengkap hanya dalam hitungan detik.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-8 rounded-2xl flex flex-col items-center text-center shadow-sm dark:shadow-none">
                 <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center rounded-xl mb-5">
                    <Smile className="w-6 h-6 text-rose-500" />
                 </div>
                 <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">Bahasa Mudah</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Penjelasan dengan bahasa sehari-hari dan analogi yang relatable.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-8 rounded-2xl flex flex-col items-center text-center shadow-sm dark:shadow-none">
                 <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center rounded-xl mb-5">
                    <Lock className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                 </div>
                 <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">Privasi Terjaga</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Dokumen Anda aman, rahasia, dan tidak dibagikan ke pihak lain.</p>
              </div>
           </div>
        </section>

        {/* How It Works Section */}
        <section id="cara-kerja" className="w-full bg-slate-50 dark:bg-slate-800/50 py-20 border-t border-slate-100 dark:border-slate-700/50 scroll-mt-20">
           <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Cara Kerja LawGo</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-16">Tiga langkah mudah untuk melindungi hak Anda</p>
              <div className="grid md:grid-cols-3 gap-8">
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700/50 flex flex-col items-center">
                    <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-sm dark:shadow-none shadow-indigo-200">1</div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-3">Unggah Dokumen</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Upload file PDF atau langsung tempel teks dari kontrak yang ingin Anda periksa batas risikonya.</p>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700/50 flex flex-col items-center relative">
                    <div className="hidden md:block absolute -left-4 top-1/2 w-8 border-t-2 border-dashed border-slate-200 dark:border-slate-700"></div>
                    <div className="hidden md:block absolute -right-4 top-1/2 w-8 border-t-2 border-dashed border-slate-200 dark:border-slate-700"></div>
                    <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-sm dark:shadow-none shadow-indigo-200">2</div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-3">Analisis Pintar</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">AI kami memindai dan mendeteksi berbagai jebakan, bahasa ambigu, atau risiko hukum tersembunyi.</p>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700/50 flex flex-col items-center relative">
                    <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-sm dark:shadow-none shadow-indigo-200">3</div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-3">Terima Rekomendasi</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Dapatkan laporan ringkas yang bebas "bahasa dewa". Kami memberikan tips apa yang harus dilakukan.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Pricing Section */}
        <section id="harga" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 scroll-mt-20">
           <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Pilihan Paket Harga</h2>
              <p className="text-slate-500 dark:text-slate-400">Pilih paket yang paling sesuai dengan kebutuhan Anda</p>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700/50 flex flex-col h-full relative z-10 transition hover:border-indigo-300 dark:hover:border-indigo-500/50">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gratis</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-6">Sempurna untuk coba-coba</p>
                 <div className="mb-8">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">Rp 0</span>
                    <span className="text-slate-500 dark:text-slate-400">/selamanya</span>
                 </div>
                 <ul className="flex flex-col gap-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                       <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> 3 Analisis dokumen pertama
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                       <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Ringkasan risiko
                    </li>
                 </ul>
                 <Link to="/signup" className="w-full py-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-semibold text-center hover:bg-indigo-50 dark:bg-indigo-500/10 transition">Daftar Sekarang</Link>
              </div>
              <div className="bg-indigo-600 dark:bg-indigo-500 p-8 rounded-3xl shadow-xl shadow-indigo-200 flex flex-col transform md:-translate-y-4">
                 <div className="inline-flex items-center justify-center px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full mb-4 w-max">PALING POPULER</div>
                 <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
                 <p className="text-sm text-indigo-100 mb-6 border-b border-indigo-500 pb-6">Untuk keamanan berkala</p>
                 <div className="mb-8 text-white">
                    <span className="text-4xl font-bold">Rp 99rb</span>
                    <span className="text-indigo-200">/bulan</span>
                 </div>
                 <ul className="flex flex-col gap-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm text-white">
                       <CheckCircle2 className="w-5 h-5 text-indigo-300" /> Analisis dokumen tak terbatas
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                       <CheckCircle2 className="w-5 h-5 text-indigo-300" /> Rekomendasi hukum mendetail
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                       <CheckCircle2 className="w-5 h-5 text-indigo-300" /> Analogi & Dasar Hukum lengkap
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                       <CheckCircle2 className="w-5 h-5 text-indigo-300" /> Ekspor ke PDF
                    </li>
                 </ul>
                 <Link to="/signup" className="w-full py-3.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition shadow-sm dark:shadow-none">Pilih Premium</Link>
              </div>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700/50 flex flex-col md:col-span-2 lg:col-span-1 transition hover:border-indigo-300 dark:hover:border-indigo-500/50">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-6">Untuk perlindungan korporat</p>
                 <div className="mb-8">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">Custom</span>
                 </div>
                 <ul className="flex flex-col gap-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                       <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Semuanya di Premium
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                       <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Integrasi API internal
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                       <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Layanan Konsultasi Prioritas
                    </li>
                 </ul>
                 <a href="https://wa.me/6281234567890?text=Halo%20tim%20LawGo,%20saya%20ingin%20bertanya%20tentang%20paket%20Enterprise" target="_blank" rel="noopener noreferrer" className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50 transition">Hubungi Kami</a>
              </div>
           </div>
        </section>

        {/* Tentang Section */}
        <section id="tentang" className="w-full bg-slate-900 border-t border-slate-800 text-white py-20 mt-10">
           <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
              <div>
                 <div className="bg-indigo-600 dark:bg-indigo-500/20 p-2.5 rounded-xl flex items-center justify-center w-ma max-w-max mb-6">
                    <ShieldCheck className="w-8 h-8 text-indigo-400" />
                 </div>
                 <h2 className="text-2xl md:text-3xl font-bold mb-4">Tentang LawGo</h2>
                 <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-6">
                    Hukum seringkali terasa jauh dan rumit bagi masyarakat umum. Bahasa dewa, klausul abu-abu, dan denda tersembunyi membuat banyak pihak kecil dirugikan dalam membuat kesepakatan. LawGo berdiri untuk meruntuhkan tembok itu.
                 </p>
                 <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-8">
                    Dengan AI yang dilatih khusus di atas hukum Indonesia, kami menjadi asisten pribadi Anda, memastikan Anda tahu persis apa yang Anda tandatangani. Kepercayaan, Transparansi, dan Perlindungan Hak—itu adalah komitmen kami.
                 </p>
                 <div className="flex items-center gap-6">
                    <Link to="/privacy" className="font-semibold text-slate-400 dark:text-slate-500 hover:text-white transition text-sm">Kebijakan Privasi</Link>
                 </div>
              </div>
              <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700/50 shadow-xl">
                 <h3 className="text-xl font-bold mb-6">Punya pertanyaan?</h3>
                 <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Nama Anda" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"/>
                    <input type="email" placeholder="Email Anda" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"/>
                    <textarea placeholder="Pesan Anda" rows={3} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"></textarea>
                    <button type="submit" className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl py-3 text-sm hover:bg-indigo-700 transition">Kirim Pesan</button>
                 </form>
              </div>
           </div>
        </section>

        {/* Stats & CTA Section */}
        <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 mb-10">
           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800/80 dark:to-indigo-900/20 rounded-3xl p-10 md:p-16 border border-indigo-100 dark:border-slate-700/50 text-center relative overflow-hidden">
               <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">Berdampak Nyata untuk Banyak Orang</h2>
               <p className="text-sm text-slate-600 dark:text-slate-400 mb-12 relative z-10">Bersama LawGo, lebih banyak orang terhindar dari kontrak yang merugikan.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700/50 max-w-4xl mx-auto w-full">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start md:items-center gap-4 justify-center py-4 md:py-0 md:border-r border-slate-100 dark:border-slate-700/50">
                     <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full text-indigo-600 dark:text-indigo-400"><FileText className="w-6 h-6" /></div>
                     <div className="text-center sm:text-left">
                        <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200">10.000+</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dokumen dianalisis</span>
                     </div>
                  </div>
                  <div className="flex flex-col items-center sm:flex-row sm:items-start md:items-center gap-4 justify-center py-4 md:py-0 md:border-r border-slate-100 dark:border-slate-700/50 border-t sm:border-t-0 md:border-t-0 border-slate-100 ">
                     <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full text-indigo-600 dark:text-indigo-400"><ShieldCheck className="w-6 h-6" /></div>
                     <div className="text-center sm:text-left">
                        <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200">8.500+</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pengguna terbantu</span>
                     </div>
                  </div>
                  <div className="flex flex-col items-center sm:flex-row sm:items-start md:items-center gap-4 justify-center py-4 md:py-0 border-t sm:border-t-0 md:border-t-0 border-slate-100 dark:border-slate-700/50">
                     <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full text-indigo-600 dark:text-indigo-400"><Star className="w-6 h-6" /></div>
                     <div className="text-center sm:text-left">
                        <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200">4.9/5</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rating kepuasan</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row items-center justify-between text-center md:text-left relative z-10 mx-auto max-w-4xl w-full">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Siap Melindungi Hak Anda?</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Jangan biarkan klausul berbahaya merugikan Anda.</p>
                    <Link to="/analyze" className="inline-flex bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm dark:shadow-none shadow-indigo-200 items-center gap-2 text-sm z-10 relative">
                       Mulai Analisis Gratis Sekarang <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-4">Gratis • Cepat • Aman</p>
                  </div>
                  <div className="hidden md:block w-48 h-48 relative ml-8">
                     {/* Robot Illustration Placeholder */}
                     <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-2xl"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <ShieldCheck className="w-32 h-32 text-indigo-600 dark:text-indigo-400" />
                     </div>
                  </div>
               </div>
           </div>
        </section>
      </main>
    </div>
  );
}
