import Layout from '../components/Layout';
import { Clock, FileText, Search, AlignJustify, Grid, Star, MoreVertical, Download, ArrowRight, Plus, Crown, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function HistoryPage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [allAnalyses, setAllAnalyses] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [showAllClauses, setShowAllClauses] = useState(false);

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
        type: 'TXT',
        title: doc.data().title || 'Dokumen Teks',
        date: new Date(doc.data().createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
        tags: ['Dokumen', 'Teks'],
        score: doc.data().data?.overallRiskScore || parseInt((doc.data().data?.overallThreatLevel === 'High' ? 80 : 40).toString(), 10) || 0,
        risk: doc.data().data?.overallThreatLevel === 'High' ? 'Tinggi' : (doc.data().data?.overallThreatLevel === 'Medium' ? 'Sedang' : 'Rendah'),
        rawData: doc.data().data,
        timestamp: doc.data().createdAt
      }));
      setAllAnalyses(data);
      if (data.length > 0) {
        setSelectedAnalysis((prev: any) => prev ? (data.find(d => d.id === prev.id) || data[0]) : data[0]);
      } else {
        setSelectedAnalysis(null);
      }
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'jobs');
      } catch (e) {}
    });
    return () => unsubscribe();
  }, [user]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Tinggi': return 'text-rose-600 dark:text-rose-400';
      case 'Sedang': return 'text-amber-500 dark:text-amber-400';
      case 'Rendah': return 'text-emerald-500 dark:text-emerald-400';
      default: return 'text-slate-500 dark:text-slate-400';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'Tinggi': return 'border-rose-200 dark:border-rose-500/20';
      case 'Sedang': return 'border-amber-200 dark:border-amber-500/20';
      case 'Rendah': return 'border-emerald-200 dark:border-emerald-500/20';
      default: return 'border-slate-200 dark:border-slate-700';
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedAnalysis || !selectedAnalysis.rawData) return;
    const result = selectedAnalysis.rawData;
    const document = new jsPDF();
    
    document.setFontSize(20);
    document.text("Laporan Analisis Kontrak", 14, 22);
    
    document.setFontSize(12);
    const getRiskText = (level: string) => {
      switch(level?.toLowerCase()) {
        case 'high': return 'Tinggi';
        case 'medium': return 'Sedang';
        case 'low': return 'Rendah';
        case 'safe': return 'Aman';
        default: return 'Tidak Terdefinisi';
      }
    };
    document.text(`Tingkat Risiko: ${getRiskText(result.overallThreatLevel)}`, 14, 30);
    document.text(`Skor Keamanan: ${result.safeScore || (100 - (result.overallRiskScore || 0))}/100`, 14, 36);
    
    document.setFontSize(10);
    const summaryLines = document.splitTextToSize(`Ringkasan: ${result.summary}`, 180);
    document.text(summaryLines, 14, 46);
    
    let currentY = 46 + (summaryLines.length * 5) + 10;
    
    const clausesData = result.clauses ? result.clauses.map((clause: any) => [
        clause.title,
        getRiskText(clause.riskScore),
        clause.score ? `${clause.score}/100` : "-",
        clause.simplifiedText
    ]) : [];

    autoTable(document, {
      startY: currentY,
      head: [['Judul Klausul', 'Risiko', 'Skor', 'Penjelasan Sederhana']],
      body: clausesData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    document.save(`Laporan_Analisis_Kontrak_${selectedAnalysis.title?.replace(/\\s+/g, '_') || 'Dokumen'}.pdf`);
  };

  const getFilteredAndSorted = () => {
    let result = [...allAnalyses];
    if (filterRisk !== 'all') {
      result = result.filter(item => {
        if (filterRisk === 'high') return item.risk === 'Tinggi';
        if (filterRisk === 'medium') return item.risk === 'Sedang';
        if (filterRisk === 'low') return item.risk === 'Rendah';
        return true;
      });
    }

    result.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return result;
  };

  const processedAnalyses = getFilteredAndSorted();
  const totalPages = Math.ceil(processedAnalyses.length / itemsPerPage);
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentItems = processedAnalyses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const header = (
    <div className="flex flex-col">
       <div className="flex items-center gap-2">
         <Clock className="w-5 h-5 text-slate-800 dark:text-slate-200" />
         <h1 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Analisis</h1>
       </div>
       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola dan lihat kembali hasil analisis dokumen Anda.</p>
    </div>
  );

  return (
    <Layout headerContent={header}>
       <div className="md:hidden mb-6">
          <div className="flex items-center gap-2 mb-1">
             <Clock className="w-5 h-5 text-slate-800 dark:text-slate-200" />
             <h1 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Analisis</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Kelola dan lihat kembali hasil analisis dokumen Anda.</p>
       </div>

       {!isLoggedIn ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 md:p-16 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none max-w-4xl mx-auto mt-6">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Akses Terbatas</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">Anda harus masuk dengan akun Google untuk melihat riwayat analisis dokumen Anda.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-center gap-3 shadow-sm dark:shadow-none"
            >
              Masuk atau Daftar
            </button>
          </div>
       ) : (
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-700 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                   <button onClick={() => setFilterRisk('all')} className={`pb-3 border-b-2 font-semibold text-sm whitespace-nowrap ${filterRisk === 'all' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}>Semua</button>
                   <button onClick={() => setFilterRisk('high')} className={`pb-3 border-b-2 font-semibold text-sm whitespace-nowrap ${filterRisk === 'high' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}>Tinggi</button>
                   <button onClick={() => setFilterRisk('medium')} className={`pb-3 border-b-2 font-semibold text-sm whitespace-nowrap ${filterRisk === 'medium' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}>Sedang</button>
                   <button onClick={() => setFilterRisk('low')} className={`pb-3 border-b-2 font-semibold text-sm whitespace-nowrap ${filterRisk === 'low' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}>Rendah</button>
                </div>
                
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500">
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                  </select>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm dark:shadow-none text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}>
                      <AlignJustify className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm dark:shadow-none text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}>
                      <Grid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
             </div>

             <div className={viewMode === 'list' ? "flex flex-col gap-3" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4"}>
               {currentItems.length === 0 ? (
                 <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 col-span-full">Belum ada riwayat analisis.</div>
               ) : currentItems.map((item, idx) => (
                 <div key={item.id} onClick={() => setSelectedAnalysis(item)} className={`bg-white dark:bg-slate-800 border rounded-2xl p-4 flex flex-col ${viewMode === 'list' ? 'sm:flex-row items-start sm:items-center justify-between' : 'items-start justify-between'} gap-4 transition hover:shadow-md cursor-pointer ${selectedAnalysis?.id === item.id ? 'border-indigo-200 dark:border-indigo-800 shadow-sm dark:shadow-none ring-1 ring-indigo-50' : 'border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl font-bold text-[10px] flex items-center justify-center ${item.type === 'PDF' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                         {item.type}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span>{item.date}</span>
                          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
                          <div className="flex items-center gap-2">
                            {item.tags.map((tag: string) => (
                               <span key={tag} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-400">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-6 ${viewMode === 'list' ? 'w-full sm:w-auto shrink-0 border-t sm:border-0 pt-3 sm:pt-0 justify-between sm:justify-end' : 'w-full border-t pt-3 justify-between'} border-slate-100 dark:border-slate-700/50`}>
                       <span className={`font-semibold text-sm ${getRiskColor(item.risk)}`}>Risiko {item.risk}</span>
                       <div className={`w-12 h-12 rounded-full border-[3px] flex flex-col items-center justify-center ${getRiskBg(item.risk)}`}>
                          <span className={`text-sm font-bold leading-none ${getRiskColor(item.risk)}`}>{item.score}</span>
                          <span className="text-[8px] text-slate-400 dark:text-slate-500 font-medium leading-none border-t border-slate-200 dark:border-slate-700 w-8 text-center pt-0.5 mt-0.5">/100</span>
                       </div>
                    </div>
                 </div>
               ))}
             </div>

             {totalPages > 1 && (
               <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 flex-wrap">
                 <button 
                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                   disabled={currentPage === 1}
                   className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50 disabled:opacity-50">
                   {'<'}
                 </button>
                 
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                   if (totalPages > 5) {
                      if (page !== 1 && page !== totalPages && Math.abs(currentPage - page) > 1) {
                        if (page === 2 || page === totalPages - 1) return <span key={`ellipsis-${page}`} className="text-slate-400 dark:text-slate-500 mx-1">...</span>;
                        return null;
                      }
                   }
                   
                   return (
                     <button 
                       key={page}
                       onClick={() => setCurrentPage(page)}
                       className={`w-8 h-8 flex items-center justify-center rounded-lg border font-medium ${currentPage === page ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800'}`}>
                       {page}
                     </button>
                   );
                 })}

                 <button 
                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                   disabled={currentPage === totalPages}
                   className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50 disabled:opacity-50">
                   {'>'}
                 </button>
               </div>
             )}
          </div>

          <div className="lg:col-span-5 flex flex-col mt-6 lg:mt-0">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm dark:shadow-none sticky top-24">
               {selectedAnalysis ? (
                 <>
               <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="bg-rose-100 dark:bg-rose-500/20 p-2 text-xs font-bold text-rose-600 dark:text-rose-400 rounded-lg shrink-0">{selectedAnalysis.type}</div>
                   <div className="flex flex-col">
                     <h3 className="font-bold text-slate-900 dark:text-white text-sm lg:text-base leading-tight">{selectedAnalysis.title}</h3>
                     <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedAnalysis.date}</span>
                   </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                   <button className="text-slate-400 dark:text-slate-500 hover:text-amber-400 transition p-1"><Star className="w-5 h-5" /></button>
                   <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 transition p-1"><MoreVertical className="w-5 h-5" /></button>
                </div>
             </div>

             <div className="flex items-center gap-3 mb-8">
               <button onClick={() => navigate('/analyzer')} className="flex-1 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-semibold py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2">
                 <FileText className="w-4 h-4" /> Uji Lagi
               </button>
               <button onClick={handleDownloadPDF} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2">
                 <Download className="w-4 h-4" /> Unduh Laporan
               </button>
             </div>

             <div className="flex items-center justify-between mb-4 cursor-pointer group">
               <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:text-indigo-400 transition">Ringkasan Analisis</h4>
               <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:text-indigo-400 transition" />
             </div>

             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-start border border-slate-100 dark:border-slate-700/50">
                   <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Skor Risiko</span>
                   <div className="flex items-end gap-1">
                      <span className={`text-3xl lg:text-4xl font-bold leading-none ${getRiskColor(selectedAnalysis.risk)}`}>{selectedAnalysis.score}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1 border-l pl-1 border-slate-300 dark:border-slate-600">/100</span>
                   </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700/50">
                   <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">Risiko</span>
                   <span className={`text-sm font-bold bg-white dark:bg-slate-800 border px-4 py-1.5 rounded-lg w-full text-center ${getRiskColor(selectedAnalysis.risk)} ${getRiskBg(selectedAnalysis.risk)}`}>{selectedAnalysis.risk}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl flex flex-col items-start border border-slate-100 dark:border-slate-700/50">
                   <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Total Klausa Berisiko</span>
                   <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{selectedAnalysis.rawData?.clauses?.length || 0}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl flex flex-col items-start border border-slate-100 dark:border-slate-700/50">
                   <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Klausa Bahaya</span>
                   <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{selectedAnalysis.rawData?.clauses?.filter((c:any) => c.riskScore?.toLowerCase() === 'high')?.length || 0}</span>
                </div>
             </div>

             <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Top Klausa Berisiko</h4>
             <div className="flex flex-col gap-2 mb-4">
                {selectedAnalysis.rawData?.clauses?.filter((c:any) => ['high', 'medium'].includes(c.riskScore?.toLowerCase()))
                [showAllClauses ? 'slice' : 'slice'](0, showAllClauses ? undefined : 3)
                .map((clause: any, index: number) => {
                  const isHigh = clause.riskScore?.toLowerCase() === 'high';
                  return (
                    <div key={index} className="flex flex-row items-center justify-between bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                         <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${isHigh ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>{index + 1}</span>
                         <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate" title={clause.title}>{clause.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded shrink-0 whitespace-nowrap ${isHigh ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10' : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'}`}>{isHigh ? 'Risiko Tinggi' : 'Risiko Sedang'}</span>
                    </div>
                  );
                })}
             </div>
             
             {selectedAnalysis.rawData?.clauses?.filter((c:any) => ['high', 'medium'].includes(c.riskScore?.toLowerCase())).length > 3 && (
               <button onClick={() => setShowAllClauses(!showAllClauses)} className="w-full text-indigo-600 dark:text-indigo-400 text-xs font-semibold py-2.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 hover:bg-indigo-50 dark:bg-indigo-500/10 rounded-xl transition mb-8 cursor-pointer">
                  {showAllClauses ? 'Sembunyikan Klausa' : `Lihat Semua Klausa (${selectedAnalysis.rawData.clauses.filter((c:any) => ['high', 'medium'].includes(c.riskScore?.toLowerCase())).length})`}
               </button>
             )}

             <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center justify-between">
                   <h4 className="font-bold text-slate-900 dark:text-white text-sm">Catatan Pribadi</h4>
                   <button onClick={() => alert('Fitur catatan segera hadir!')} className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 text-[10px] font-semibold hover:bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md transition cursor-pointer"><Plus className="w-3 h-3" /> Tambah Catatan</button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 p-4 rounded-xl relative hover:bg-slate-100 dark:bg-slate-800 transition cursor-text">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pr-4">Belum ada catatan.</p>
                </div>
             </div>

             <div className="mt-auto bg-gradient-to-br from-indigo-50 to-purple-100 p-5 rounded-2xl border border-indigo-100 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-80">
                   <Crown className="w-10 h-10 text-yellow-500 rotate-12 drop-shadow-sm dark:shadow-none" />
                </div>
                <h4 className="font-bold text-indigo-900 text-sm z-10 w-4/5">Pahami dokumen hukum lebih dalam</h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-400/80 mb-3 z-10 w-4/5 leading-relaxed">Upgrade ke Premium untuk mendapatkan analisis lebih mendetail dan fitur eksklusif.</p>
                <button className="w-max bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition z-10 flex items-center gap-2 shadow-sm dark:shadow-none shadow-indigo-200">
                  <Crown className="w-4 h-4 text-yellow-300" /> Upgrade Sekarang
                </button>
             </div>
             </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-12">
                 <FileText className="w-12 h-12 mb-4 opacity-50" />
                 <p className="font-medium">Pilih dokumen untuk melihat detail</p>
               </div>
             )}
            </div>
          </div>
       </div>
       )}
    </Layout>
  );
}
