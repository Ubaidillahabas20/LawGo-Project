import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

// This is an in-memory simulation of the Celery worker queue 
const jobs = new Map();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // Set up Multer for handling file uploads (in-memory for demo)
  const upload = multer({ storage: multer.memoryStorage() });

  // Job status endpoint
  app.get('/api/result/:job_id', (req, res) => {
    const job = jobs.get(req.params.job_id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  });

  // Example analyze endpoint that triggers a "background" job
  app.post('/api/analyze', upload.single('file'), async (req, res) => {
    const jobId = Math.random().toString(36).substring(7);
    const content = req.file ? req.file.buffer.toString() : req.body.text;
    
    if (!content) {
      return res.status(400).json({ error: 'No content provided' });
    }

    // Initialize job status
    jobs.set(jobId, { status: 'PENDING', progress: 0, data: null });
    
    // Process asynchronously (simulating Celery task)
    processDocument(jobId, content);

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
async function processDocument(jobId: string, text: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Simulate Step 1: Clause Detection & Classification
    jobs.set(jobId, { status: 'PROCESSING', progress: 20, data: null });
    
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const aiRes = response.text || "{}";
    const resultData = JSON.parse(aiRes);
    
    // Simulate processing time for realism
    await new Promise(r => setTimeout(r, 2000));
    jobs.set(jobId, { status: 'PROCESSING', progress: 80, data: null });

    jobs.set(jobId, { status: 'SUCCESS', progress: 100, data: resultData });

  } catch (err: any) {
    console.error("Job failed:", err);
    jobs.set(jobId, { status: 'FAILED', progress: 0, error: err.message });
  }
}

startServer();
