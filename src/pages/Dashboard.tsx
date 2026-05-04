import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Upload, Clock, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { isLoggedIn, user } = useAuth();
  
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans items-center justify-center flex-col">
        <h2 className="text-2xl font-bold mb-4">Anda belum masuk</h2>
        <Link to="/login" className="text-blue-600 hover:underline">Pergi ke form login</Link>
      </div>
    );
  }
  const recentAnalyses = [
    { id: '1', title: 'Perjanjian Jual Beli Tanah.pdf', date: '2 Jam yang lalu', risk: 'High' },
    { id: '2', title: 'Kontrak Kerja Karyawan Swasta', date: 'Kemarin', risk: 'Medium' },
    { id: '3', title: 'Sewa Apartemen 1 Tahun.pdf', date: '3 Hari yang lalu', risk: 'Low' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Halo, {user?.name || 'Pengguna Baru'}! 👋</h1>
          <p className="text-slate-500 mt-2">Mari kita lihat dokumen apa yang perlu dianalisis hari ini.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/analyze" className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col items-start gap-4 hover:bg-blue-700 transition shadow-sm shadow-blue-200">
            <div className="bg-blue-500/50 p-3 rounded-xl">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Analisis Dokumen Baru</h3>
              <p className="text-blue-100 text-sm mt-1">Upload PDF atau ketik teks</p>
            </div>
          </Link>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-start gap-4 shadow-sm">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">12 Dokumen</h3>
              <p className="text-slate-500 text-sm mt-1">Dianalisis bulan ini</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-start gap-4 shadow-sm">
            <div className="bg-rose-100 text-rose-600 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">3 Klausa Berisiko</h3>
              <p className="text-slate-500 text-sm mt-1">Ditemukan bulan ini</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Riwayat Analisis Terakhir</h2>
            <Link to="/history" className="text-blue-600 text-sm font-medium hover:underline">Lihat Semua</Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {recentAnalyses.map((item, idx) => (
              <div key={item.id} className={`p-4 flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-100 ${idx === recentAnalyses.length - 1 ? 'border-b-0' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.risk === 'High' ? 'bg-rose-100 text-rose-600' : item.risk === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{item.title}</h4>
                    <span className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {item.date}
                    </span>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.risk === 'High' ? 'bg-rose-100 text-rose-700' : item.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    Risiko: {item.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
