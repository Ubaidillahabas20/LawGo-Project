import Layout from '../components/Layout';

export default function HelpPage() {
  return (
    <Layout>
      <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bantuan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Pusat bantuan dan dukungan tambahan platform LawGo.</p>
        </header>

        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none max-w-3xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Pertanyaan Umum (FAQ)</h3>
          
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Apakah dokumen yang saya unggah aman?</h4>
              <p className="text-slate-600 dark:text-slate-400">Ya. Semua dokumen yang Anda unggah akan dihapus secara otomatis dari server kami dalam waktu 30 menit (Time-to-Live). Kami tidak menyimpan, mendistribusikan, atau menggunakan informasi privat Anda untuk melatih model kami tanpa seizin Anda.</p>
            </div>
            
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Berapa lama proses analisis berjalan?</h4>
              <p className="text-slate-600 dark:text-slate-400">Biasanya hanya memakan waktu 1 hingga 5 menit tergantung pada panjang dokumen. Model AI kami akan memindainya secara berkala melalui sistem antrean yang aman.</p>
            </div>
            
            <div className="pb-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Bagaimana jika saya menemukan kesalahan analisis?</h4>
              <p className="text-slate-600 dark:text-slate-400">Meskipun sistem kami menggunakan multi-agent AI verification untuk meminimalisasi halusinasi, LawGo tetap bukan penasihat hukum resmi (lawyer). Selalu konsultasikan kepada penasihat hukum sungguhan untuk transaksi berisiko sangat tinggi.</p>
            </div>
          </div>
        </section>
    </Layout>
  );
}
