import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SurveyResponse {
  id: string;
  timestamp: number;
  scores: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  feedback?: string;
  respondentId?: string;
}

// In-memory data store with initial sample data
let responses: SurveyResponse[] = [
  {
    id: 'seed-1',
    timestamp: Date.now() - 1000 * 60 * 18,
    scores: { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    feedback: 'วิทยากรมีความเชี่ยวชาญสูงมาก ยกตัวอย่างเห็นภาพชัดเจน บรรยากาศเป็นกันเอง',
  },
  {
    id: 'seed-2',
    timestamp: Date.now() - 1000 * 60 * 12,
    scores: { q1: 5, q2: 4, q3: 5, q4: 4, q5: 5 },
    feedback: 'เนื้อหานำไปปรับใช้กับงานโปรเจกต์ของทีมได้ทันที มีประโยชน์มากครับ',
  },
  {
    id: 'seed-3',
    timestamp: Date.now() - 1000 * 60 * 5,
    scores: { q1: 4, q2: 5, q3: 4, q4: 4, q5: 4 },
    feedback: 'เอกสารประกอบการอบรมละเอียดดีมาก อยากให้มีเวลาสำหรับช่วง Q&A เพิ่มเติม',
  }
];

// SSE Clients for instantaneous push
type SSEClient = {
  id: number;
  res: Response;
};
let sseClients: SSEClient[] = [];
let nextClientId = 1;

function broadcastEvent(eventType: string, data: any) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(payload);
    } catch (e) {
      // Ignore dead connection
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API Routes
  app.get('/api/responses', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: responses,
      count: responses.length
    });
  });

  app.post('/api/responses', (req: Request, res: Response) => {
    const { scores, feedback, respondentId } = req.body;
    if (!scores || !scores.q1 || !scores.q2 || !scores.q3 || !scores.q4 || !scores.q5) {
      return res.status(400).json({ success: false, error: 'Scores are required for all 5 questions' });
    }

    const newResponse: SurveyResponse = {
      id: 'resp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      scores: {
        q1: Number(scores.q1),
        q2: Number(scores.q2),
        q3: Number(scores.q3),
        q4: Number(scores.q4),
        q5: Number(scores.q5),
      },
      feedback: feedback ? String(feedback).trim() : '',
      respondentId: respondentId || undefined
    };

    responses.unshift(newResponse);
    broadcastEvent('new_response', newResponse);

    res.status(201).json({ success: true, data: newResponse });
  });

  app.post('/api/responses/seed', (_req: Request, res: Response) => {
    const mockSample: SurveyResponse[] = [
      {
        id: 'seed-' + Date.now() + '-1',
        timestamp: Date.now() - 45000,
        scores: { q1: 5, q2: 5, q3: 5, q4: 4, q5: 5 },
        feedback: 'ชอบการทำ workshop ได้ลงมือทำจริง ทำให้เข้าใจอย่างถ่องแท้',
      },
      {
        id: 'seed-' + Date.now() + '-2',
        timestamp: Date.now() - 30000,
        scores: { q1: 4, q2: 4, q3: 4, q4: 5, q5: 4 },
        feedback: 'สถานที่สะดวกสบาย อุปกรณ์พร้อม แนะนำให้จัดอบรมต่อเนื่องครับ',
      },
      {
        id: 'seed-' + Date.now() + '-3',
        timestamp: Date.now() - 15000,
        scores: { q1: 5, q2: 4, q3: 5, q4: 4, q5: 5 },
        feedback: 'วิทยากรตอบคำถามได้ตรงประเด็นมาก ได้ไอเดียใหม่ๆ ไปพัฒนางาน',
      }
    ];

    responses = [...mockSample, ...responses];
    broadcastEvent('refresh', responses);
    res.json({ success: true, count: responses.length });
  });

  app.delete('/api/responses', (_req: Request, res: Response) => {
    responses = [];
    broadcastEvent('reset', []);
    res.json({ success: true, message: 'All responses cleared' });
  });

  // SSE Stream
  app.get('/api/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const clientId = nextClientId++;
    const client: SSEClient = { id: clientId, res };
    sseClients.push(client);

    // Initial greeting & data sync
    res.write(`event: init\ndata: ${JSON.stringify(responses)}\n\n`);

    req.on('close', () => {
      sseClients = sseClients.filter(c => c.id !== clientId);
    });
  });

  // Vite Dev or Static Production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Live Training Satisfaction Server listening on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server startup error:', err);
});
