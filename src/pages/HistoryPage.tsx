import Layout from '../components/Layout';
import { Clock, FileText, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export default function HistoryPage() {
  const { user } = useAuth();
  const [allAnalyses, setAllAnalyses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'jobs'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Dokumen Teks',
        date: new Date(doc.data().createdAt).toLocaleDateString('id-ID'),
        risk: doc.data().data?.overallThreatLevel || 'Medium'
      }));
      setAllAnalyses(data);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'jobs');
      } catch (e) {}
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <Layout>
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
            {allAnalyses.length === 0 ? (
                 <div className="p-8 text-center text-slate-500">Belum ada riwayat analisis.</div>
            ) : allAnalyses.map((item, idx) => (
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
    </Layout>
  );
}
