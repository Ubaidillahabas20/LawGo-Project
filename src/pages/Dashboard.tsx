import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Upload, Clock, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function Dashboard() {
  const { isLoggedIn, user, isInitializing } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'jobs'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Dokumen Teks',
        date: new Date(doc.data().createdAt).toLocaleDateString('id-ID'),
        risk: doc.data().data?.overallThreatLevel || 'Medium'
      }));
      setRecentAnalyses(data);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'jobs');
      } catch(e) {
        // Error already handled and logged by handleFirestoreError
      }
    });
    return () => unsubscribe();
  }, [user]);
  
  if (isInitializing) {
     return <div className="flex min-h-screen bg-slate-50 font-sans items-center justify-center">Memuat...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen bg-slate-50 font-sans items-center justify-center flex-col">
        <h2 className="text-2xl font-bold mb-4">Anda belum masuk</h2>
        <Link to="/login" className="text-blue-600 hover:underline">Pergi ke form login</Link>
      </div>
    );
  }

  return (
    <Layout>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Halo, {user?.displayName || 'Pengguna Baru'}! 👋</h1>
        <p className="text-slate-500 mt-2">Mari kita lihat dokumen apa yang perlu dianalisis hari ini.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <Link to="/analyze" className="bg-blue-600 col-span-1 sm:col-span-2 md:col-span-1 rounded-2xl p-5 md:p-6 text-white flex flex-col items-start gap-3 md:gap-4 hover:bg-blue-700 transition shadow-sm shadow-blue-200">
          <div className="bg-blue-500/50 p-3 rounded-xl">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold md:text-lg">Analisis Dokumen Baru</h3>
            <p className="text-blue-100 text-xs md:text-sm mt-1">Upload PDF atau ketik teks</p>
          </div>
        </Link>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col items-start gap-3 md:gap-4 shadow-sm">
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold md:text-lg text-slate-900">12 Dokumen</h3>
            <p className="text-slate-500 text-xs md:text-sm mt-1">Dianalisis bulan ini</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col items-start gap-3 md:gap-4 shadow-sm">
          <div className="bg-rose-100 text-rose-600 p-3 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold md:text-lg text-slate-900">3 Klausa Berisiko</h3>
            <p className="text-slate-500 text-xs md:text-sm mt-1">Ditemukan bulan ini</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">Riwayat Analisis Terakhir</h2>
          <Link to="/history" className="text-blue-600 text-sm font-medium hover:underline">Lihat Semua</Link>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {recentAnalyses.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Belum ada riwayat analisis.</div>
          ) : recentAnalyses.map((item, idx) => (
            <div key={item.id} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition border-b border-slate-100 ${idx === recentAnalyses.length - 1 ? 'border-b-0' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.risk === 'High' ? 'bg-rose-100 text-rose-600' : item.risk === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 line-clamp-1">{item.title}</h4>
                  <span className="text-xs md:text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {item.date}
                  </span>
                </div>
              </div>
              <div className="self-end sm:self-auto">
                <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${item.risk === 'High' ? 'bg-rose-100 text-rose-700' : item.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  Risiko: {item.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
