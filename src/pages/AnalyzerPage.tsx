import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, AlertTriangle, CheckCircle, Info, Loader2, ShieldCheck, ArrowLeft, Lightbulb, User, Download, Edit3, ChevronDown, ArrowRight } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function AnalyzerPage() {
  const { isLoggedIn, user } = useAuth();
  
  // Initialize from sessionStorage if available
  const [textInput, setTextInput] = useState(() => {
    return sessionStorage.getItem('lawgo_textInput') || '';
  });
  
  const [result, setResult] = useState<any>(() => {
    const saved = sessionStorage.getItem('lawgo_result');
    const savedTime = sessionStorage.getItem('lawgo_result_time');
    
    if (saved && savedTime) {
      const parsedTime = parseInt(savedTime, 10);
      // Check if 30 minutes (1800000 ms) have passed
      if (Date.now() - parsedTime < 30 * 60 * 1000) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return null;
        }
      } else {
        // Expired
        sessionStorage.removeItem('lawgo_result');
        sessionStorage.removeItem('lawgo_result_time');
        sessionStorage.removeItem('lawgo_textInput');
      }
    }
    return null;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputType, setInputType] = useState<'pdf' | 'text'>('pdf');
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [showAllClauses, setShowAllClauses] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const handleAction = (feature: string) => {
    alert(`Fitur "${feature}" akan segera hadir!`);
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const document = new jsPDF();
    
    document.setFontSize(20);
    document.text("Laporan Analisis Kontrak", 14, 22);
    
    document.setFontSize(12);
    document.text(`Tingkat Risiko: ${getRiskText(result.overallThreatLevel)}`, 14, 30);
    document.text(`Skor Keamanan: ${result.overallRiskScore || 0}/100`, 14, 36);
    
    document.setFontSize(10);
    const summaryLines = document.splitTextToSize(`Ringkasan: ${result.summary}`, 180);
    document.text(summaryLines, 14, 46);
    
    let currentY = 46 + (summaryLines.length * 5) + 10;
    
    const clausesData = result.clauses.map((clause: any) => [
        clause.title,
        getRiskText(clause.riskScore),
        clause.score + "/100",
        clause.simplifiedText
    ]);

    autoTable(document, {
      startY: currentY,
      head: [['Judul Klausul', 'Risiko', 'Skor', 'Penjelasan Sederhana']],
      body: clausesData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    document.save("Laporan_Analisis_Kontrak.pdf");
  };

  const handleDownloadNegotiationLetter = () => {
      if (!result) return;
      const document = new jsPDF();
      document.setFontSize(12);
      
      const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      let y = 20;
      
      document.text(`Tanggal: ${today}`, 14, y);
      y += 10;
      document.text("Perihal: Permohonan Negosiasi Klausul Kontrak", 14, y);
      y += 15;
      
      document.text("Kepada Yth,", 14, y);
      y += 7;
      document.text("Pihak Terkait,", 14, y);
      y += 10;
      
      const intro = "Melalui surat ini, kami bermaksud untuk menyampaikan permohonan peninjauan ulang dan negosiasi terhadap beberapa klausul dalam draf kontrak yang telah disampaikan. Berdasarkan hasil tinjauan kami, terdapat beberapa poin yang perlu didiskusikan lebih lanjut demi mencapai kesepakatan yang adil dan menguntungkan kedua belah pihak.";
      const introLines = document.splitTextToSize(intro, 180);
      document.text(introLines, 14, y);
      y += (introLines.length * 6) + 10;
      
      document.setFont("helvetica", "bold");
      document.text("Poin-Poin Negosiasi:", 14, y);
      document.setFont("helvetica", "normal");
      y += 8;
      
      const highRiskClauses = result.clauses.filter((c: any) => ['high', 'medium'].includes(c.riskScore?.toLowerCase()));
      
      if (highRiskClauses.length === 0) {
          document.text("Tidak ada klausul berisiko tinggi yang ditemukan. Kontrak terlihat cukup aman.", 14, y);
          y += 10;
      } else {
          highRiskClauses.forEach((clause: any, index: number) => {
              if (y > 250) {
                  document.addPage();
                  y = 20;
              }
              document.setFont("helvetica", "bold");
              document.text(`${index + 1}. Klausul: ${clause.title}`, 14, y);
              document.setFont("helvetica", "normal");
              y += 6;
              
              const origLines = document.splitTextToSize(`Klausul Asli: ${clause.originalText}`, 175);
              document.text(origLines, 18, y);
              y += (origLines.length * 5) + 3;
              
              const recLines = document.splitTextToSize(`Rekomendasi Perubahan: ${clause.recommendation || 'Mohon ditinjau kembali klausul ini agar lebih seimbang untuk kedua belah pihak.'}`, 175);
              document.text(recLines, 18, y);
              y += (recLines.length * 5) + 6;
          });
      }
      
      if (y > 230) {
          document.addPage();
          y = 20;
      }
      
      const closing = "Kami berharap kita dapat menyelesaikan poin-poin di atas melalui diskusi musyawarah mufakat. Terima kasih atas perhatian dan kerjasamanya.";
      const closingLines = document.splitTextToSize(closing, 180);
      document.text(closingLines, 14, y);
      y += (closingLines.length * 6) + 15;
      
      document.text("Hormat kami,", 14, y);
      y += 20;
      document.text("________________________", 14, y);
      
      document.save("Surat_Negosiasi_Kontrak.pdf");
  };

  const [selectedClauseIndex, setSelectedClauseIndex] = useState<number>(0);

  // Sync to sessionStorage when changed
  useEffect(() => {
    sessionStorage.setItem('lawgo_textInput', textInput);
  }, [textInput]);

  useEffect(() => {
    if (result) {
      sessionStorage.setItem('lawgo_result', JSON.stringify(result));
      if (!sessionStorage.getItem('lawgo_result_time')) {
        sessionStorage.setItem('lawgo_result_time', Date.now().toString());
      }
    } else {
      sessionStorage.removeItem('lawgo_result');
      sessionStorage.removeItem('lawgo_result_time');
    }
  }, [result]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Tolong unggah file PDF yang valid.');
      return;
    }
    
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
        if (fullText.length > 10000) {
          fullText = fullText.substring(0, 10000);
          break;
        }
      }
      
      if (fullText.trim()) {
        setPdfFileName(file.name);
        handleAnalyze(fullText);
        return; // handleAnalyze will manage the isAnalyzing state
      } else {
        setErrorMessage('Tidak dapat mengekstrak teks dari PDF. Gambar atau PDF yang di-scan memerlukan OCR.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Terjadi kesalahan saat membaca file PDF: ' + err.message);
    }
    setIsAnalyzing(false);
  };

  const handleAnalyze = async (textOverride?: string | React.MouseEvent) => {
    const textToAnalyze = typeof textOverride === 'string' ? textOverride : textInput;
    if (!textToAnalyze.trim() && inputType === 'text') {
      alert('Silakan masukkan teks atau unggah dokumen terlebih dahulu.');
      return;
    }
    if (!textToAnalyze.trim() || !user) return;
    setIsAnalyzing(true);
    setJobId(null);
    setResult(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze, userId: user.uid })
      });
      const data = await res.json();
      if (data.job_id) {
        setJobId(data.job_id);
      } else {
        setErrorMessage('Gagal memulai analisis. Silakan coba lagi.');
        setIsAnalyzing(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi kesalahan jaringan.');
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobId && isAnalyzing) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/result/${jobId}?userId=${user?.uid}`);
          
          if (!res.ok) {
            const errorText = await res.text();
            console.error("Polling error:", res.status, errorText);
            setErrorMessage(`Analisis gagal: Server mengembalikan status ${res.status}`);
            setIsAnalyzing(false);
            clearInterval(interval);
            return;
          }

          const data = await res.json();
          setJobStatus(data.status);
          
          if (data.status === 'SUCCESS') {
            setResult(data.data);
            setIsAnalyzing(false);
            clearInterval(interval);
            
            if (user?.uid) {
               try {
                  await setDoc(doc(db, 'jobs', jobId), {
                    title: inputType === 'pdf' ? (pdfFileName || 'Dokumen PDF') : (textInput.length > 30 ? textInput.substring(0, 30).replace(/\n/g, ' ') + '...' : (textInput.trim() || 'Dokumen Teks')),
                    ownerId: user?.uid,
                    status: 'SUCCESS',
                    progress: 100,
                    data: data.data,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  });
               } catch (error) {
                  try {
                    handleFirestoreError(error, OperationType.WRITE, `jobs/${jobId}`);
                  } catch (e: any) {
                    setErrorMessage('Catatan riwayat gagal diperbarui: ' + e.message);
                  }
               }
            }
          } else if (data.status === 'FAILED') {
            const errorMsgLower = data.error?.toLowerCase() || "";
            if (errorMsgLower.includes("api key") || data.error.includes("API_KEY_MISSING") || errorMsgLower.includes("api_key")) {
               setErrorMessage('API Key Gemini bermasalah atau belum dikonfigurasi. Silakan atur di menu Settings (Secrets) di AI Studio Anda lalu coba lagi.');
            } else {
               setErrorMessage('Analisis gagal: ' + data.error);
            }
            setIsAnalyzing(false);
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Fetch polling error:", err);
          setErrorMessage('Terjadi kesalahan saat memproses data. Silakan coba lagi.');
          setIsAnalyzing(false);
          clearInterval(interval);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [jobId, isAnalyzing]);

  // Auto clear result after 30 minutes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (result) {
      timer = setTimeout(() => {
        setResult(null);
        setTextInput('');
      }, 30 * 60 * 1000); // 30 minutes
    }
    return () => clearTimeout(timer);
  }, [result]);

  useEffect(() => {
    const handleClear = () => {
      setResult(null);
      setTextInput('');
      setPdfFileName('');
    };
    window.addEventListener('clearAnalysisEvent', handleClear);
    return () => window.removeEventListener('clearAnalysisEvent', handleClear);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10';
      case 'medium': return 'text-amber-500 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10';
      case 'low': return 'text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10';
      case 'safe': return 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10';
      default: return 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      case 'safe': return 'Aman';
      default: return 'Aman';
    }
  };

  const header = (
    <div className="flex items-center gap-4">
      {result ? (
        <>
          <button 
            onClick={() => { setResult(null); setTextInput(''); setPdfFileName(''); }}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Hasil Analisis</h1>
        </>
      ) : (
        <h1 className="text-xl font-bold text-slate-900 dark:text-white border-l-[3px] border-indigo-600 pl-3">Analisis Dokumen Baru</h1>
      )}
    </div>
  );

  return (
    <Layout headerContent={header}>
        <div className="md:hidden flex items-center gap-3 mb-6">
           {result && (
              <button onClick={() => { setResult(null); setTextInput(''); setPdfFileName(''); }} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm dark:shadow-none">
                 <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
           )}
           <h1 className="text-xl font-bold text-slate-900 dark:text-white">{result ? 'Hasil Analisis' : 'Analisis Dokumen'}</h1>
        </div>

        {!isLoggedIn ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 md:p-16 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none max-w-4xl mx-auto mt-6">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Akses Terbatas</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">Anda harus masuk dengan akun Google untuk mulai menganalisis dokumen dan melindungi privasi data Anda.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-center gap-3 shadow-sm dark:shadow-none"
            >
              Masuk atau Daftar
            </button>
          </div>
        ) : !isAnalyzing && !result && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-10 shadow-sm dark:shadow-none max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">Pahami Kontrak Rumit <span className="text-indigo-600 dark:text-indigo-400">Dalam 1 Menit</span></h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-lg">LawGo membantu Anda memahami dokumen hukum, menemukan risiko tersembunyi, dan memberi rekomendasi jelas.</p>
            
            {errorMessage && (
              <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 p-4 rounded-xl mb-6 flex items-start gap-3 w-full">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-sm">{errorMessage}</p>
              </div>
            )}
            
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8 w-full max-w-md mx-auto">
              <button 
                onClick={() => setInputType('pdf')}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition ${inputType === 'pdf' ? 'bg-white dark:bg-slate-800 shadow-sm dark:shadow-none text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
              >
                <Upload className="w-4 h-4" /> Dokumen PDF
              </button>
              <button 
                onClick={() => setInputType('text')}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition ${inputType === 'text' ? 'bg-white dark:bg-slate-800 shadow-sm dark:shadow-none text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
              >
                <FileText className="w-4 h-4" /> Paste Teks
              </button>
            </div>

            {inputType === 'pdf' ? (
              <label 
                htmlFor="pdf-upload"
                className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl p-6 sm:p-12 w-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition mb-8 h-48 block"
              >
                <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm dark:shadow-none text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                  {pdfFileName ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                </div>
                {pdfFileName ? (
                  <>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{pdfFileName}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Klik untuk mengganti dokumen</p>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Pilih Dokumen PDF</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Atau klik untuk memilih file (Maks 10MB)</p>
                  </>
                )}
                <input 
                  id="pdf-upload"
                  type="file" 
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            ) : (
              <div className="w-full mb-8 relative">
                <textarea 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Tempel isi teks perjanjian atau kontrak di sini..."
                  className="w-full h-48 p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none resize-none text-slate-700 dark:text-slate-300 placeholder-slate-400 box-border"
                  maxLength={10000}
                ></textarea>
                <div className="absolute bottom-3 right-4 text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {textInput.length}/10000
                </div>
              </div>
            )}

            <button 
              onClick={handleAnalyze}
              disabled={(inputType === 'text' && !textInput.trim()) || (inputType === 'pdf' && !pdfFileName)}
              className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 text-white px-10 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm dark:shadow-none shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Mulai Analisis <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">Aman • Cepat • Rahasia</p>
          </div>
        )}

        {isLoggedIn && isAnalyzing && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 md:p-16 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none max-w-4xl mx-auto h-[60vh]">
            <div className="relative w-24 h-24 flex items-center justify-center mb-8">
               <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
               <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400 z-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">AI Sedang Mengekstrak...</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">Mencari klausul berisiko dan menyusun penjelasan yang membumi. Ini memakan waktu beberapa detik.</p>
          </div>
        )}

        {isLoggedIn && result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 flex flex-col gap-6">
                
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm dark:shadow-none">
                   <div className="flex items-center gap-3 sm:gap-4 overflow-hidden pr-2">
                      <div className="bg-blue-100 dark:bg-blue-500/20 p-2.5 text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 rounded-xl shrink-0">TXT</div>
                      <div className="flex flex-col overflow-hidden">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">Analisis Dokumen Teks</h3>
                        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">Baru saja diakses</span>
                      </div>
                   </div>
                   <button onClick={() => setIsDocumentModalOpen(true)} className="text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:bg-indigo-500/10 font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-xl transition whitespace-nowrap">
                      Lihat Dokumen
                   </button>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-none">
                   <div className="flex items-center gap-2 mb-4">
                     <h3 className="font-bold text-slate-900 dark:text-white">Ringkasan Risiko</h3>
                     <Info className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                   </div>
                   <div className="flex flex-col gap-6">
                      <div className="text-center md:text-left border-b border-slate-100 dark:border-slate-700/50 pb-6">
                         <h4 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mb-2">Risiko {getRiskText(result.overallThreatLevel)}</h4>
                         <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{result.summary}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                         <div className="col-span-1 flex flex-col items-center justify-center py-2 md:py-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700/50 pb-6 md:pb-0">
                            <div className="relative w-32 h-16 overflow-hidden mb-2">
                               <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-slate-100 dark:border-slate-700/50"></div>
                               <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-transparent border-t-rose-500 border-l-rose-500 rotate-45 transform"></div>
                            </div>
                            <div className="flex items-end gap-1 -mt-6">
                               <span className="text-4xl font-bold text-slate-800 dark:text-slate-200 leading-none">{result.overallRiskScore || 0}</span>
                               <span className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-1">/100</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">Skor Risiko</span>
                         </div>

                         <div className="col-span-1 flex flex-col gap-3 md:pl-4">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-rose-500"></span><span className="text-sm text-slate-600 dark:text-slate-400">Tinggi</span></div>
                               <span className="font-medium text-slate-800 dark:text-slate-200">{result.clauses?.filter((c: any) => c.riskScore === 'High').length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500"></span><span className="text-sm text-slate-600 dark:text-slate-400">Sedang</span></div>
                               <span className="font-medium text-slate-800 dark:text-slate-200">{result.clauses?.filter((c: any) => c.riskScore === 'Medium').length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500"></span><span className="text-sm text-slate-600 dark:text-slate-400">Rendah</span></div>
                               <span className="font-medium text-slate-800 dark:text-slate-200">{result.clauses?.filter((c: any) => c.riskScore === 'Low').length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500"></span><span className="text-sm text-slate-600 dark:text-slate-400">Aman</span></div>
                               <span className="font-medium text-slate-800 dark:text-slate-200">{result.clauses?.filter((c: any) => c.riskScore === 'Safe').length || 0}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-none">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">Klausul Berisiko</h3>
                        <Info className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                         <button onClick={() => setFilterRisk('all')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border ${filterRisk === 'all' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-100' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50'}`}>Semua {result.clauses?.length || 0}</button>
                         <button onClick={() => setFilterRisk('high')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border ${filterRisk === 'high' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50'}`}>Tinggi {result.clauses?.filter((c: any) => c.riskScore === 'High').length || 0}</button>
                         <button onClick={() => setFilterRisk('medium')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border ${filterRisk === 'medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 border-amber-100' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50'}`}>Sedang {result.clauses?.filter((c: any) => c.riskScore === 'Medium').length || 0}</button>
                         <button onClick={() => setFilterRisk('low')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border ${filterRisk === 'low' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 border-emerald-100' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50'}`}>Rendah {result.clauses?.filter((c: any) => c.riskScore === 'Low').length || 0}</button>
                         <button onClick={() => setFilterRisk('safe')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border ${filterRisk === 'safe' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 border-emerald-100' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50'}`}>Aman {result.clauses?.filter((c: any) => c.riskScore === 'Safe').length || 0}</button>
                      </div>
                   </div>

                   <div className="flex flex-col gap-3">
                      {(showAllClauses ? result.clauses : result.clauses?.slice(0, 5))
                        ?.filter((clause: any) => filterRisk === 'all' || clause.riskScore?.toLowerCase() === filterRisk)
                        .map((clause: any, i: number) => {
                          const originalIndex = result.clauses.indexOf(clause);
                          return (
                         <div 
                           key={originalIndex} 
                           onClick={() => {
                             setSelectedClauseIndex(originalIndex);
                             if (window.innerWidth < 1024) {
                               setTimeout(() => {
                                 document.getElementById('penjelasan-klausul-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                               }, 100);
                             }
                           }}
                           className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border transition cursor-pointer ${
                             selectedClauseIndex === originalIndex ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-800 shadow-sm dark:shadow-none' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 hover:border-indigo-100'
                           }`}
                         >
                            <div className="flex items-center justify-between w-full sm:w-auto">
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskColor(clause.riskScore)}`}>
                                  {getRiskText(clause.riskScore)}
                               </span>
                               
                               {/* Mobile version for score */}
                               <div className="flex sm:hidden items-center justify-end gap-2">
                                 <span className={`font-bold text-sm ${clause.riskScore?.toLowerCase() === 'high' ? 'text-rose-600 dark:text-rose-400' : clause.riskScore?.toLowerCase() === 'medium' ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
                                   {clause.score || 0}<span className="text-[10px] text-slate-400 dark:text-slate-500">/100</span>
                                 </span>
                                 <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                               </div>
                            </div>
                            <div className="flex flex-col pr-2 flex-1 w-full">
                               <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{clause.title}</h4>
                               <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{clause.originalText}</p>
                            </div>
                            
                            {/* Desktop version for score */}
                            <div className="hidden sm:flex items-center justify-end gap-2 border-l border-slate-200 dark:border-slate-700 pl-4 min-w-[80px]">
                               <span className={`font-bold text-sm sm:text-base ${clause.riskScore?.toLowerCase() === 'high' ? 'text-rose-600 dark:text-rose-400' : clause.riskScore?.toLowerCase() === 'medium' ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
                                 {clause.score || 0}<span className="text-[10px] text-slate-400 dark:text-slate-500">/100</span>
                               </span>
                               <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            </div>
                         </div>
                          );
                      })}
                   </div>
                   {!showAllClauses && result.clauses?.length > 5 && (
                     <button onClick={() => setShowAllClauses(true)} className="w-full text-indigo-600 dark:text-indigo-400 text-xs font-semibold py-3 flex items-center justify-center gap-2 mt-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50 rounded-lg transition border-t border-slate-100 dark:border-slate-700/50">
                        <ChevronDown className="w-4 h-4" /> Lihat semua klausul ({result.clauses?.length})
                     </button>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="md:col-span-2 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                         <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-1 block">Potensi Kerugian Maksimal</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">Berdasarkan klausul berisiko tinggi dalam dokumen ini, Anda berpotensi mengalami kerugian hingga:</p>
                        <h4 className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 leading-snug">{result.potentialLoss || 'Tidak terdefinisi'}</h4>
                      </div>
                   </div>
                   
                   <div className="md:col-span-1 flex flex-col gap-4">
                       <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 p-5 rounded-2xl flex-1 flex flex-col">
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4" /> Tips Rekomendasi
                          </span>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{result.quickTips || 'Pastikan untuk membaca dan memahami setiap kewajiban Anda sebelum menyetujui dokumen ini.'}</p>
                       </div>
                       
                       <div className="bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 p-4 rounded-2xl flex items-center justify-between hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition group cursor-pointer" onClick={() => handleAction('Konsultasi Ahli Hukum')}>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Konsultasi Ahli</span>
                            <span className="text-[10px] text-indigo-700 dark:text-indigo-400">Tanya pengacara</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                             <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                       </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-1" id="penjelasan-klausul-panel">
                {result.clauses && result.clauses[selectedClauseIndex] && (
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm dark:shadow-none sticky top-6">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">Penjelasan Klausul</h3>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${getRiskColor(result.clauses[selectedClauseIndex].riskScore)}`}>
                          {getRiskText(result.clauses[selectedClauseIndex].riskScore)}
                        </span>
                     </div>
                     
                     <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">{result.clauses[selectedClauseIndex].title}</h4>
                     
                     <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 p-4 rounded-xl mb-6">
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 italic leading-relaxed">"{result.clauses[selectedClauseIndex].originalText}"</p>
                     </div>

                     <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200 dark:border-slate-700 mb-5 overflow-x-auto hide-scrollbar">
                       <button className="pb-3 border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"><Info className="w-3.5 h-3.5" /> Penjelasan</button>
                     </div>

                     <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                        {result.clauses[selectedClauseIndex].simplifiedText}
                     </p>

                     {result.clauses[selectedClauseIndex].analogy && (
                       <div className="mb-6">
                          <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Analogi</h5>
                          <div className="bg-orange-50/50 border border-orange-100/50 p-4 rounded-xl text-sm text-orange-900 leading-relaxed">
                            {result.clauses[selectedClauseIndex].analogy}
                          </div>
                       </div>
                     )}

                     {result.clauses[selectedClauseIndex].basis && (
                       <div className="mb-6">
                          <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Dasar Hukum</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {result.clauses[selectedClauseIndex].basis}
                          </p>
                       </div>
                     )}

                     {result.clauses[selectedClauseIndex].recommendation && (
                       <div className="mb-8">
                          <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Rekomendasi</h5>
                          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100/50 p-4 rounded-xl text-sm text-white-900 leading-relaxed">
                             {result.clauses[selectedClauseIndex].recommendation}
                          </div>
                       </div>
                     )}

                     <div className="flex flex-col gap-3">
                        <button onClick={handleDownloadPDF} className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl text-xs transition shadow-sm dark:shadow-none shadow-indigo-200 flex items-center justify-center gap-2">
                           Unduh Laporan Lengkap <Download className="w-3.5 h-3.5 ml-1" />
                        </button>
                        <button onClick={handleDownloadNegotiationLetter} className="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold py-3.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm dark:shadow-none shadow-indigo-50">
                           Buat Surat Negosiasi <Edit3 className="w-3.5 h-3.5 ml-1" />
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}
        
      {isDocumentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700/50">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Isi Dokumen</h3>
              <button onClick={() => setIsDocumentModalOpen(false)} className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                {textInput}
              </pre>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end">
              <button onClick={() => setIsDocumentModalOpen(false)} className="px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white font-medium rounded-xl transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
