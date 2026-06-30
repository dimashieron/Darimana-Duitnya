import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // === SECURE BACKEND API ROUTE ===
  // Secure activation validation (the valid codes are never exposed to the client-side code!)
  app.post('/api/activate', (req, res) => {
    try {
      const { code } = req.body;
      if (!code || typeof code !== 'string') {
        res.status(400).json({ success: false, message: 'Kode tidak valid.' });
        return;
      }

      const cleanCode = code.trim().toUpperCase();
      
      // Check for custom dynamic pattern: NAMA_TANGGALBELI_KODEUNIK (e.g. DIMAS_20260630_XYZ88)
      const parts = cleanCode.split('_');
      let isPatternValid = false;
      let buyerName = '';
      let purchaseDate = '';

      if (parts.length === 3) {
        const [namePart, datePart, uniquePart] = parts;
        
        // 1. Validate Name Part (alphanumeric, at least 2 characters)
        const nameRegex = /^[A-Z0-9]{2,30}$/;
        // 2. Validate Date Part (YYYYMMDD format: year 2020-2035, month 01-12, day 01-31)
        const dateRegex = /^(20[2-3][0-9])(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
        // 3. Validate Unique Code Suffix (alphanumeric, 4 to 12 characters)
        const uniqueRegex = /^[A-Z0-9]{4,12}$/;

        if (nameRegex.test(namePart) && dateRegex.test(datePart) && uniqueRegex.test(uniquePart)) {
          isPatternValid = true;
          buyerName = namePart;
          
          const year = datePart.substring(0, 4);
          const month = datePart.substring(4, 6);
          const day = datePart.substring(6, 8);
          purchaseDate = `${day}/${month}/${year}`;
        }
      }

      // We also keep fallback easy codes for quick local activation and backwards-compatibility
      const BACKUP_CODES = [
        'DUITNYA100',
        'DARIMANADUITNYA',
        'OFFLINEPRO',
        'BEBASBONCOS',
        'PRO99'
      ];

      if (isPatternValid) {
        res.json({ 
          success: true, 
          message: `Aktivasi Berhasil! Terima kasih ${buyerName} (Pembelian: ${purchaseDate}).`, 
          code: cleanCode 
        });
      } else if (BACKUP_CODES.includes(cleanCode)) {
        res.json({ 
          success: true, 
          message: 'Aktivasi berhasil menggunakan kode promo!', 
          code: cleanCode 
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: 'Format kode salah! Gunakan format NAMA_TANGGAL_KODEUNIK (contoh: DIMAS_20260630_XYZ88) atau hubungi dukungan.' 
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
