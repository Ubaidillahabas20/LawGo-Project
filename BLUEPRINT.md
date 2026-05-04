# LawGo – Full System Blueprint (Production-Ready)

This document contains the complete and detailed blueprint for building the LawGo platform from scratch to production, adhering strictly to a multi-agent, scalable, and secure architecture.

## 🌳 ROOT STRUCTURE (FULL DETAIL)

```text
lawgo/
│
├── apps/
│   ├── api/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   │
│   │   ├── routes/
│   │   │   ├── analyze.py
│   │   │   ├── result.py
│   │   │   ├── history.py
│   │   │   └── health.py
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.py
│   │   │   ├── logging.py
│   │   │   └── rate_limit.py
│   │   │
│   │   └── schemas/
│   │       ├── request.py
│   │       └── response.py
│   │
│   ├── worker/
│   │   ├── worker.py
│   │   ├── config.py
│   │   └── tasks.py
│
├── core/
│   ├── pipeline/
│   │   ├── orchestrator.py
│   │   ├── router.py
│   │   └── state_manager.py
│   │
│   ├── agents/
│   │   ├── clause_detector.py
│   │   ├── risk_classifier.py
│   │   ├── legal_grounding.py
│   │   ├── analogy_generator.py
│   │   ├── recommendation_engine.py
│   │   ├── aggregator.py
│   │   └── verifier.py
│
├── models/
│   ├── request.py
│   ├── response.py
│   ├── clause.py
│   ├── risk.py
│   ├── job.py
│   └── user.py
│
├── prompts/
│   ├── clause_detector.txt
│   ├── risk_classifier.txt
│   ├── legal_grounding.txt
│   ├── analogy_generator.txt
│   ├── recommendation_engine.txt
│   ├── aggregator.txt
│   └── verifier.txt
│
├── services/
│   ├── llm/
│   │   ├── client.py
│   │   ├── router.py
│   │   └── schemas.py
│   │
│   ├── ocr/
│   │   ├── tesseract.py
│   │   ├── cleaner.py
│   │   └── parser.py
│   │
│   ├── rag/
│   │   ├── retriever.py
│   │   ├── embedder.py
│   │   └── indexer.py
│   │
│   ├── tts/
│   │   └── voice.py
│
├── infra/
│   ├── db/
│   │   ├── postgres.py
│   │   ├── models.py
│   │   ├── migrations/
│   │   │   └── versions/
│   │   │       └── init.sql
│   │
│   ├── queue/
│   │   ├── celery_app.py
│   │   └── worker_monitor.py
│   │
│   ├── cache/
│   │   └── redis.py
│   │
│   ├── storage/
│   │   ├── minio.py
│   │   └── file_manager.py
│
├── utils/
│   ├── logger.py
│   ├── hashing.py
│   ├── validators.py
│   ├── constants.py
│   └── helpers.py
│
├── tests/
│   ├── unit/
│   │   ├── test_agents.py
│   │   ├── test_pipeline.py
│   │   └── test_utils.py
│   │
│   ├── integration/
│   │   ├── test_api.py
│   │   └── test_worker.py
│
├── scripts/
│   ├── seed_data.py
│   ├── create_admin.py
│   └── load_legal_docs.py
│
├── docker/
│   ├── api.Dockerfile
│   ├── worker.Dockerfile
│   └── nginx.conf
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .env.example
├── docker-compose.yml
├── requirements.txt
├── README.md
└── LICENSE
```

---

## 📌 PENJELASAN FILE PENTING

🔹 `apps/api/main.py`
Entry point FastAPI:
- init app
- register routes
- middleware

🔹 `apps/worker/tasks.py`
Menjalankan pipeline AI:
- menerima job
- proses multi-agent
- simpan hasil

🔹 `core/pipeline/orchestrator.py`
Mengatur urutan agent:
- clause → risk → legal → dst

🔹 `core/agents/*`
Setiap file = 1 agent
- pure logic
- tidak ada HTTP / DB

🔹 `services/llm/client.py`
Wrapper LLM:
- OpenAI / Gemini
- retry logic
- timeout

🔹 `infra/db/models.py`
Schema database:
- jobs
- results
- logs

🔹 `infra/queue/celery_app.py`
Konfigurasi Celery:
- broker
- backend

🔹 `infra/storage/minio.py`
Upload & delete file

🔹 `utils/logger.py`
Central logging:
`logger.info("Pipeline started")`

---

## 🔥 BEST PRACTICE STRUCTURE

1. **Clean Architecture**
   - apps = entry
   - core = logic
   - infra = external
2. **Decoupling**
   - Agent tidak tahu API
   - API tidak tahu detail AI
3. **Prompt Externalization**
   - Semua prompt di `/prompts`
4. **Scalability Ready**
   - Worker bisa ditambah tanpa ubah code
5. **Testability**
   - Setiap agent bisa di-test sendiri

---

## 🧠 1. TECH STACK (BAHASA & TOOLS)

🔹 **Backend**
- Python 3.11+
- FastAPI (async API)
- Celery (task queue)
- Redis (broker + cache)
- PostgreSQL (database)
- Qdrant (vector DB untuk RAG)

🔹 **AI / ML**
- OpenAI / Gemini API (LLM)
- Llama 3 (opsional local)
- SentenceTransformers (embedding)

🔹 **Frontend**
- Next.js (React)
- TypeScript
- Tailwind CSS
- Shadcn UI / Radix UI

🔹 **DevOps**
- Docker
- Docker Compose
- Google Cloud Run
- GitHub Actions (CI/CD)

---

## 🖥️ 2. UI/UX DESIGN (FRONTEND)

🔹 **Halaman Utama (Landing)**
- Hero text: "Pahami kontrak rumit dalam 1 menit"
- Tombol utama: Upload Dokumen, Tempel Teks, Rekam Suara

🔹 **Dashboard**
- Sidebar Menu: 🏠 Dashboard, 📄 Analisis Dokumen, 📊 Riwayat, ⚙️ Pengaturan, ❓ Bantuan

🔹 **Halaman Analisis**
- Upload Box (drag & drop)
- Mode selector: Cepat, Lengkap

🔹 **Halaman Hasil**
- Struktur: [Summary], [Risk Score Bar], [Clause Cards]
- Visual: 🟢 Aman, 🟡 Hati-hati, 🔴 Bahaya

---

## ⚙️ 3. BACKEND ARCHITECTURE

🔹 **API FLOW**
`User → FastAPI → Queue → Worker → DB → Response`

🔹 **ENDPOINTS**
- `POST /analyze`
- `GET /result/{job_id}`
- `GET /history`
- `DELETE /job/{id}`

🔹 **PIPELINE**
```python
def pipeline(text):
    clauses = agent1(text)
    risks = agent2(clauses)
    legal = agent3(risks)
    analogy = agent4(risks)
    reco = agent5(risks, legal)
    final = agent6(...)
    return final
```

---

## 🔄 4. BACKEND ↔ FRONTEND INTEGRATION

🔹 **Flow**
- Frontend Upload → `POST /analyze` → `job_id`
- Polling → `GET /result/{job_id}`
- Render hasil

---

## 🔐 5. SECURITY SYSTEM

🔹 **Authentication & Data Protection**
- JWT
- HTTPS (Cloud Run default)
- AES encryption (file storage)
- Hash dokumen (SHA256)
- Auto delete file (TTL 30 menit)
- Rate limiting (Redis) & Input validation (Pydantic)

---

## 🐳 6. DOCKER SETUP

🔹 **API Dockerfile**
```dockerfile
FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "apps.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

🔹 **Worker Dockerfile**
```dockerfile
FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["celery", "-A", "apps.worker.worker", "worker", "--loglevel=info"]
```

---

## ☁️ 7. DEPLOYMENT (GOOGLE CLOUD RUN)

🔹 **Step 1: Build Image**
`gcloud builds submit --tag gcr.io/PROJECT_ID/lawgo-api`

🔹 **Step 2: Deploy API**
`gcloud run deploy lawgo-api --image gcr.io/PROJECT_ID/lawgo-api --platform managed --region asia-southeast2 --allow-unauthenticated`

🔹 **Step 3 & 4: Worker & DB**
- Worker: Cloud Run Jobs / VM
- Database: Cloud SQL (Postgres), Memorystore (Redis)

---

## 📊 8. SCALING STRATEGY & TESTING
- API → auto scale
- Worker → scale by queue length
- Monitoring: Prometheus, Grafana, Cloud Logging
- Tests: Unit tests for agents, integration tests for API endpoints.

---

**🚀 FINAL SUMMARY**
LawGo sekarang memiliki:
✅ Multi-agent AI system
✅ Production-ready backend
✅ Scalable architecture
✅ Secure data handling
✅ Modern UI/UX
✅ Cloud deployment ready
