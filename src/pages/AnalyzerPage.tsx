import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, AlertTriangle, CheckCircle, Info, Loader2, ShieldCheck } from 'lucide-react';

export default function AnalyzerPage() {
  const { isLoggedIn } = useAuth();
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [jobStatus, setJobStatus] = useState<string>('');

  const handleAnalyze = async () => {
    if (!textInput.trim()) return;
    setIsAnalyzing(true);
    setJobId(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput })
      });
      const data = await res.json();
      if (data.job_id) {
        setJobId(data.job_id);
      } else {
        alert('Error starting analysis');
        setIsAnalyzing(false);
      }
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobId && isAnalyzing) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/result/${jobId}`);
          const data = await res.json();
          setJobStatus(data.status);
          
          if (data.status === 'SUCCESS') {
            setResult(data.data);
            setIsAnalyzing(false);
            clearInterval(interval);
          } else if (data.status === 'FAILED') {
            alert('Analysis failed: ' + data.error);
            setIsAnalyzing(false);
            clearInterval(interval);
          }
        } catch (err) {
          console.error(err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [jobId, isAnalyzing]);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Analisis Dokumen Baru</h1>
          <p className="text-slate-500 mt-2">Upload file PDF atau langsung tempel teks perjanjian yang ingin Anda periksa.</p>
        </header>

        {!isLoggedIn ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm max-w-4xl mt-6">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Akses Terbatas</h3>
            <p className="text-slate-500 mb-8 max-w-md">Anda harus masuk dengan akun Google untuk mulai menganalisis dokumen dan melindungi privasi data Anda.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-white border border-slate-300 text-slate-700 px-8 py-3 rounded-xl font-medium hover:bg-slate-50 transition flex items-center gap-3 shadow-sm"
            >
              Masuk atau Daftar
            </button>
          </div>
        ) : !isAnalyzing && !result && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm max-w-4xl">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition mb-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900">Pilih atau Tarik File Kesini</h3>
              <p className="text-slate-500 text-sm mt-1">Mendukung PDF, Word, atau Gambar (Max 10MB)</p>
            </div>
            
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-slate-400 font-medium text-sm text-center">ATAU TEMPEL TEKS</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <textarea 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Tempel isi teks perjanjian atau kontrak di sini..."
              className="w-full h-48 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none mb-6"
            ></textarea>

            <div className="flex justify-end">
              <button 
                onClick={handleAnalyze}
                disabled={!textInput.trim()}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                Mulai Analisis
              </button>
            </div>
          </div>
        )}

        {isLoggedIn && isAnalyzing && (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm max-w-4xl">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Sedang Menganalisis...</h3>
            <p className="text-slate-500">Mencari klausa nakal dan menyusun bahasa membumi untuk Anda. Harap tunggu sebentar.</p>
            <div className="w-full max-w-md bg-slate-100 h-2 rounded-full mt-8 overflow-hidden">
              <div className="bg-blue-600 h-full animate-pulse w-2/3 rounded-full"></div>
            </div>
          </div>
        )}

        {isLoggedIn && result && (
          <div className="max-w-4xl">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Hasil Analisis</h2>
                  <p className="text-slate-500 mt-1">Berikut adalah ringkasan dari dokumen Anda.</p>
                </div>
                <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold ${
                  result.overallThreatLevel === 'High' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                  result.overallThreatLevel === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                  Skor Risiko: {result.overallThreatLevel}
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" /> Executive Summary
                </h3>
                <p className="text-slate-700 leading-relaxed">{result.summary}</p>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-6">Klausa yang Ditemukan</h3>
              <div className="space-y-6">
                {result.clauses?.map((clause: any, i: number) => (
                  <div key={i} className={`p-6 rounded-xl border-l-4 ${
                    clause.riskScore === 'High' ? 'border-l-rose-500 bg-white border border-rose-100 shadow-sm' :
                    clause.riskScore === 'Medium' ? 'border-l-amber-500 bg-white border border-amber-100 shadow-sm' :
                    'border-l-emerald-500 bg-white border border-emerald-100 shadow-sm'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        clause.riskScore === 'High' ? 'bg-rose-100 text-rose-700' :
                        clause.riskScore === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        Risiko {clause.riskScore}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Teks Asli (Hukum)</h4>
                        <p className="text-slate-600 text-sm italic font-serif bg-slate-50 p-3 rounded-lg border border-slate-100">"{clause.originalText}"</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Artinya (Sederhana)</h4>
                        <p className="text-slate-900 font-medium text-sm">{clause.simplifiedText}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <div className="flex items-start gap-3 mb-4">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">Analogi Local</h4>
                          <p className="text-slate-600 text-sm mt-1">{clause.analogy}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">Rekomendasi Kami</h4>
                          <p className="text-slate-700 text-sm mt-1">{clause.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
              
              <div className="mt-10 flex justify-end">
                <button 
                  onClick={() => { setResult(null); setTextInput(''); }}
                  className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-200 transition"
                >
                  Analisis Dokumen Lain
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
