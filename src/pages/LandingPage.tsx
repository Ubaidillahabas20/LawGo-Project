import { Link } from 'react-router-dom';
import { ShieldCheck, Upload, FileText, Mic } from 'lucide-react';

export default function LandingPage() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="px-8 py-6 w-full flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">LawGo</span>
        </div>
        <nav className="hidden md:flex gap-6 font-medium text-slate-600">
          <button onClick={() => scrollTo('features')} className="hover:text-blue-600 transition outline-none cursor-pointer">Fitur</button>
          <button onClick={() => scrollTo('how-it-works')} className="hover:text-blue-600 transition outline-none cursor-pointer">Cara Kerja</button>
          <button onClick={() => scrollTo('pricing')} className="hover:text-blue-600 transition outline-none cursor-pointer">Harga</button>
        </nav>
        <Link 
          to="/login" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition"
        >
          Masuk
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl">
          Pahami kontrak rumit dalam <span className="text-blue-600">1 menit</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12">
          Jangan tanda tangani apa pun secara buta. LawGo mendeteksi klausa berisiko, menjelaskannya dengan analogi sederhana, dan memberikan rekomendasi aksi untuk Anda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-xl">
          <Link to="/analyze" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            <Upload className="w-5 h-5" />
            Upload Dokumen
          </Link>
          <Link to="/analyze" className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-medium text-lg hover:bg-slate-50 transition shadow-sm">
            <FileText className="w-5 h-5" />
            Tempel Teks
          </Link>
        </div>
      </main>

      <section id="features" className="bg-white py-20 border-t border-slate-200 scroll-m-8">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Deteksi Risiko Tinggi</h3>
            <p className="text-slate-600">AI multi-agent kami secara otomatis menyoroti klausa yang berbahaya atau merugikan Anda.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Penjelasan Membumi</h3>
            <p className="text-slate-600">Bahasa hukum yang kaku diubah menjadi analogi sehari-hari khas Indonesia yang mudah dicerna.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Data Pribadi Aman</h3>
            <p className="text-slate-600">Sistem otomatis menghapus dokumen Anda (TTL 30 menit). Privasi dan kerahasiaan terjamin.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 py-20 border-t border-slate-200 scroll-m-8">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Cara Kerja LawGo</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
              <h4 className="font-semibold text-lg mb-2">Upload</h4>
              <p className="text-slate-600 text-sm">Unggah file kontrak atau tempel teks dari perjanjian Anda.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
              <h4 className="font-semibold text-lg mb-2">Analisis AI</h4>
              <p className="text-slate-600 text-sm">AI kami memindai dan mendeteksi berbagai jebakan dan risiko hukum.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
              <h4 className="font-semibold text-lg mb-2">Hasil & Tips</h4>
              <p className="text-slate-600 text-sm">Dapatkan laporan mudah dipahami dan langkah yang harus diambil.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white py-20 border-t border-slate-200 scroll-m-8">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Mulai Gunakan Secara Gratis</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">Kami berkomitmen memberikan akses keadilan untuk semuanya. Fitur dasar gratis selamanya.</p>
          <Link to="/login" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition">
            Coba Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
