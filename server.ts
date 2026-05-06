import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

// This is an in-memory simulation of the Celery worker queue 
const jobs = new Map();

// Configure Rate Limiting to prevent DDoS & Spamming
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit.' }
});

const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 analysis requests per minute (Spamming protection)
  message: { error: 'Terlalu banyak dokumen yang dikirim. Silakan coba lagi sebentar lagi.' }
});

async function startServer() {
  const app = express();
  const PORT = 3000;
  
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
    const jobId = Math.random().toString(36).substring(7);
    const content = req.file ? req.file.buffer.toString() : req.body.text;
    const userId = req.body.userId;
    
    if (!content) {
      return res.status(400).json({ error: 'No content provided' });
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
      "overallThreatLevel": "Low | Medium | High",
      "clauses": [
        {
          "originalText": "String",
          "simplifiedText": "String explained in simple Indonesian",
          "analogy": "String of a relatable local Indonesian analogy",
          "riskScore": "Low | Medium | High",
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
