import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { verifyLicenseCode } from './src/licenseSecurity';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies with reasonable body size limit
  app.use(express.json({ limit: '100kb' }));

  // In-memory brute-force rate limiter for activation endpoint
  const activationAttempts = new Map<string, { count: number; firstAttempt: number }>();
  const MAX_ATTEMPTS = 10;
  const ATTEMPT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

  // === SECURE BACKEND API ROUTE ===
  // Tamper-proof license validation with brute-force defense
  app.post('/api/activate', async (req, res) => {
    try {
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const clientRecord = activationAttempts.get(clientIp);

      if (clientRecord) {
        if (now - clientRecord.firstAttempt > ATTEMPT_WINDOW_MS) {
          activationAttempts.set(clientIp, { count: 1, firstAttempt: now });
        } else if (clientRecord.count >= MAX_ATTEMPTS) {
          res.status(429).json({
            success: false,
            message: 'Terlalu banyak percobaan aktivasi yang gagal. Demi keamanan, silakan tunggu 10 menit sebelum mencoba kembali.'
          });
          return;
        }
      }

      const { code } = req.body;
      if (!code || typeof code !== 'string') {
        res.status(400).json({ success: false, message: 'Kode tidak valid.' });
        return;
      }

      const result = verifyLicenseCode(code);
      if (result.valid) {
        // Clear rate limiter record on successful activation
        activationAttempts.delete(clientIp);
        res.json({
          success: true,
          message: result.message,
          code: result.code
        });
      } else {
        // Increment failed attempt counter
        const current = activationAttempts.get(clientIp) || { count: 0, firstAttempt: now };
        activationAttempts.set(clientIp, { count: current.count + 1, firstAttempt: current.firstAttempt });

        // Timing penalty (250ms) to prevent high-speed dictionary/brute-force attacks
        await new Promise((r) => setTimeout(r, 250));

        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem.' });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Darimana Duitnya Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
