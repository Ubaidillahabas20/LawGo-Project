import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-x-hidden">
      <header className="px-6 md:px-12 py-5 w-full flex justify-between items-center bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50 sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 dark:bg-indigo-500 p-1.5 rounded-lg flex items-center justify-center">
             <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">LawGo</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">AI Legal Assistant</span>
          </div>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </header>

      <main className="flex-grow w-full max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700/50">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-6">Kebijakan Privasi</h1>
          
          <div className="space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            <p>
              Terakhir diperbarui: 6 Mei 2026
            </p>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Pendahuluan</h2>
            <p>
              LawGo ("kami", "kita", atau "milik kami") menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan privasi ini akan memberi tahu Anda tentang bagaimana kami menjaga data pribadi Anda ketika Anda mengunjungi situs web atau menggunakan layanan kami (terlepas dari dari mana Anda berkunjung) dan memberi tahu Anda tentang hak-hak privasi Anda serta bagaimana hukum melindungi Anda.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Data yang Kami Kumpulkan</h2>
            <p>
              Kami dapat mengumpulkan, menggunakan, menyimpan, dan mentransfer berbagai jenis data pribadi tentang Anda yang telah kami kelompokkan sebagai berikut:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Data Identitas</strong> meliputi nama depan, nama belakang, nama pengguna, atau pengenal serupa.</li>
              <li><strong>Data Kontak</strong> meliputi alamat email dan nomor telepon.</li>
              <li><strong>Data Dokumen</strong> meliputi dokumen PDF atau teks yang Anda unggah semata-mata untuk tujuan analisis berdasarkan permintaan Anda. Dokumen ini <strong>tidak</strong> kami simpan secara permanen dan otomatis dihapus.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Keamanan Data Dokumen</h2>
            <p>
              Kami mengerti bahwa dokumen hukum Anda bersifat rahasi. Sangat penting untuk dicatat bahwa dokumen kontrak yang Anda unggah untuk analisis diproses secara sementara oleh sistem AI kami dan <strong>tidak disimpan secara permanen</strong> di server kami (TTL 30 menit). Kami tidak menggunakan dokumen Anda untuk melatih model publik.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Penggunaan Data</h2>
            <p>
              Kami hanya akan menggunakan data pribadi Anda ketika hukum mengizinkannya. Sebagian besar, kami akan menggunakan data pribadi Anda dalam keadaan berikut:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Di mana kami perlu memberikan layanan yang Anda minta (misalnya menganalisis dokumen).</li>
              <li>Di mana itu diperlukan untuk kepentingan sah kami, dan kepentingan serta hak fundamental Anda tidak mengesampingkan kepentingan tersebut.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Kontak Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau praktik privasi kami, silakan hubungi tim kami.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
