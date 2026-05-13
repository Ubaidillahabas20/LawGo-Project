import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import crypto from 'crypto';

// This is an in-memory simulation of the Celery worker queue 
const jobs = new Map();

// Configure Rate Limiting to prevent DDoS & Spamming
const keyGenerator = (req: express.Request) => {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
         (req.headers['forwarded'] as string) || 
         req.ip || 
         'unknown';
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit.' },
  keyGenerator,
  validate: { xForwardedForHeader: false, trustProxy: false }
});

const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 analysis requests per minute (Spamming protection)
  message: { error: 'Terlalu banyak dokumen yang dikirim. Silakan coba lagi sebentar lagi.' },
  keyGenerator,
  validate: { xForwardedForHeader: false, trustProxy: false }
});

async function startServer() {
  const app = express();
  
  // Trust proxy for rate limiting behind reverse proxies (like Cloud Run)
  app.set('trust proxy', 1);
  
  const PORT = 3000;
  
  // Apply Helmet for OWASP Top 10 security headers
  app.use(helmet({
    contentSecurityPolicy: false, // disabled for Vite HMR and local development
    crossOriginEmbedderPolicy: false
  }));

  // Apply CORS
  app.use(cors());

  // Apply global rate limiting to all requests
  app.use(globalLimiter);

  // Parse JSON with strict and smaller limits to prevent payload DDoS
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Set up Multer for handling file uploads (in-memory for demo) with a 10MB size limit
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
  });

  // Job status endpoint
  app.get('/api/result/:job_id', (req, res) => {
    const job = jobs.get(req.params.job_id);
    const userId = req.query.userId;

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to view this job' });
    }
    res.json(job);
  });

  // Example analyze endpoint that triggers a "background" job
  app.post('/api/analyze', analyzeLimiter, upload.single('file'), async (req, res) => {
    const jobId = crypto.randomUUID(); // Secure, unguessable ID
    const content = req.file ? req.file.buffer.toString() : req.body.text;
    const userId = req.body.userId;
    
    if (!content) {
      return res.status(400).json({ error: 'No content provided' });
    }
    
    if (content.length > 10000) {
      return res.status(413).json({ error: 'Teks terlalu panjang. Maksimal 10.000 karakter.' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required for security' });
    }

    // Initialize job status
    jobs.set(jobId, { status: 'PENDING', progress: 0, data: null, userId });
    
    // Process asynchronously (simulating Celery task)
    processDocument(jobId, content, userId);

    // Return jobId immediately
    res.json({ job_id: jobId });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production setup for standard AI Studio apps
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LawGo Backend is running on http://localhost:${PORT}`);
  });
}

// Simulated Agent Pipeline
async function processDocument(jobId: string, text: string, userId: string) {
  try {
    const userApiKey = process.env.USER_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!userApiKey) {
      throw new Error("API_KEY_MISSING: API Key Gemini belum dikonfigurasi. Silakan tambahkan variabel 'USER_GEMINI_API_KEY' di menu Settings UI.");
    }
    const ai = new GoogleGenAI({ apiKey: userApiKey });
    
    // Simulate Step 1: Clause Detection & Classification
    jobs.set(jobId, { status: 'PROCESSING', progress: 20, data: null, userId });
    console.log(`[Job ${jobId}] Started processing for user ${userId}`);
    
    const prompt = `Analyze the following legal text and extract the key terms and risk clauses. 
    Format your response as a strictly valid JSON object matching this schema:
    {
      "summary": "String explaining the document in simple terms (Indonesian)",
      "overallThreatLevel": "Safe | Low | Medium | High",
      "overallRiskScore": "Number between 0 and 100",
      "potentialLoss": "String representing estimated potential loss in Rp or descriptive text (Indonesian)",
      "quickTips": "String of brief advice/tips (Indonesian)",
      "clauses": [
        {
          "title": "String, short title of the clause",
          "originalText": "String actual text from the document",
          "simplifiedText": "String explained in simple Indonesian",
          "analogy": "String of a relatable local Indonesian analogy",
          "basis": "String of legal basis or common law principle in Indonesia",
          "riskScore": "Safe | Low | Medium | High",
          "score": "Number between 0 and 100 representing risk severity of this clause",
          "recommendation": "String prescribing action"
        }
      ]
    }
    
    Text to analyze:
    ${text.substring(0, 5000)} // Chunking for safety
    `;

    console.log(`[Job ${jobId}] Calling AI model...`);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    console.log(`[Job ${jobId}] AI model returned response`);
    const aiRes = response.text || "{}";
    
    let resultData;
    try {
      resultData = JSON.parse(aiRes);
    } catch (parseErr: any) {
      console.log(`[Job ${jobId}] AI JSON Parse error. Response was: ${aiRes}`);
      throw new Error("Gagal mengurai respon dari AI: " + parseErr.message);
    }
    
    // Simulate processing time for realism
    await new Promise(r => setTimeout(r, 2000));
    jobs.set(jobId, { status: 'PROCESSING', progress: 80, data: null, userId });

    jobs.set(jobId, { status: 'SUCCESS', progress: 100, data: resultData, userId });
    console.log(`[Job ${jobId}] Completed successfully`);

  } catch (err: any) {
    console.error(`[Job ${jobId}] Failed:`, err);
    jobs.set(jobId, { status: 'FAILED', progress: 0, error: err.message, userId });
  }
}

startServer();
