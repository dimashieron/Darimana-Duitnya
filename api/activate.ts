import { verifyLicenseCode } from '../src/licenseSecurity';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { code } = body || {};

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Kode tidak valid.' });
    }

    const result = verifyLicenseCode(code);
    if (result.valid) {
      return res.status(200).json({
        success: true,
        message: result.message,
        code: result.code
      });
    } else {
      // Artificial delay on invalid attempt
      await new Promise(r => setTimeout(r, 250));
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem.' });
  }
}
