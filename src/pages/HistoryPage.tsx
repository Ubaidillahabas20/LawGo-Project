import Sidebar from '../components/Sidebar';
import { Clock, FileText, Search } from 'lucide-react';

export default function HistoryPage() {
  const allAnalyses = [
    { id: '1', title: 'Perjanjian Jual Beli Tanah.pdf', date: '2 Jam yang lalu', risk: 'High' },
    { id: '2', title: 'Kontrak Kerja Karyawan Swasta', date: 'Kemarin', risk: 'Medium' },
    { id: '3', title: 'Sewa Apartemen 1 Tahun.pdf', date: '3 Hari yang lalu', risk: 'Low' },
    { id: '4', title: 'Term of Service Aplikasi XYZ', date: '1 Minggu yang lalu', risk: 'Medium' },
    { id: '5', title: 'Perjanjian Pra-Nikah.pdf', date: '2 Minggu yang lalu', risk: 'Low' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Riwayat Analisis</h1>
          <p className="text-slate-500 mt-2">Daftar semua dokumen yang telah Anda analisis sebelumnya.</p>
        </header>

        <section>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Cari nama dokumen..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {allAnalyses.map((item, idx) => (
              <div key={item.id} className={`p-4 md:px-6 md:py-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition border-b border-slate-100 ${idx === allAnalyses.length - 1 ? 'border-b-0' : ''}`}>
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
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${item.risk === 'High' ? 'bg-rose-100 text-rose-700' : item.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
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
