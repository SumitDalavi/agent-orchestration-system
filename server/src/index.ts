import express from 'express';
import cors from 'cors';
import { processChat, approveAction } from './agent/orchestrator';
import { getSession, clearSession } from './agent/memory';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  try {
    const result = await processChat(sessionId, message);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/approve', async (req, res) => {
  const { sessionId, approved, feedback } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  try {
    const result = await approveAction(sessionId, approved, feedback);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/session/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

app.post('/api/session/:id/clear', (req, res) => {
  clearSession(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 4007;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Agent Orchestration Server running on port ${PORT}`);
  });
}

export default app;
