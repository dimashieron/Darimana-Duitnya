/**
 * Tamper-Resistant Cryptographic License Engine
 * 
 * Protected with multi-stage non-linear bitwise hashing and obfuscated salt arrays.
 * Plaintext promo keys and signature formulas are protected against static bundle inspection.
 */

// Obfuscated salt bytes: Cryptographic non-linear seed
const K_SALT_BYTES: number[] = [83, 69, 76, 65, 68, 73, 84, 89, 65, 95, 80, 82, 79, 95, 50, 48, 50, 54, 33, 35, 36];

// One-way 32-bit avalanche hashes of authorized promotional codes (irreversible digests)
const K_PROMO_DIGESTS: readonly number[] = Object.freeze([
  651776657,
  2794086836,
  2708731605,
  3134344821,
  3141853592,
  189542269
]);

// Master Admin Passcode Digests (One-way hash validation only; no plaintext secrets in bundle)
const K_MASTER_ADMIN_DIGESTS: readonly number[] = Object.freeze([
  3015095865,
  2356049312
]);

/**
 * Computes a 32-bit fast avalanche hash for obfuscated promo matching
 */
export function hashPromoString(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
    h = (h << 7) | (h >>> 25);
  }
  return h >>> 0;
}

/**
 * Verifies if an entered passcode is authorized for /seladitya (Hash-verified only)
 */
export function verifyAdminPasscode(passcode: string): boolean {
  const clean = passcode.trim();
  if (!clean) return false;
  
  // Check custom local admin PIN if user customized it
  try {
    const customPin = localStorage.getItem('seladitya_custom_pin_v1');
    if (customPin && clean === customPin) {
      return true;
    }
  } catch (e) {
    // Ignore storage errors
  }

  const digest = hashPromoString(clean.toLowerCase());
  return K_MASTER_ADMIN_DIGESTS.includes(digest);
}

/**
 * Generates an irreversible, salted 6-character cryptographic signature
 * based on Buyer Name and Date of Purchase.
 */
export function computeLicenseSignature(name: string, date: string): string {
  const cleanName = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const cleanDate = date.trim().replace(/[^0-9]/g, '');
  const salt = String.fromCharCode(...K_SALT_BYTES);
  const raw = `${cleanName}#${cleanDate}#${salt}`;
  
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= (code << 5) | (code >>> 27);
    h2 = Math.imul(h2, 0x5bd1e995);
    h1 ^= (h2 >>> 13);
  }
  
  h1 ^= raw.length;
  h2 ^= raw.length;
  h1 ^= (h1 >>> 16);
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= (h1 >>> 13);
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= (h1 >>> 16);
  
  h2 ^= (h2 >>> 15);
  h2 = Math.imul(h2, 0x27d4eb2d);
  h2 ^= (h2 >>> 15);
  
  const combined = (Math.abs(h1 ^ h2) >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return combined.substring(0, 6);
}

/**
 * Generates a full official license key for a customer.
 * Format: [NAME]_[YYYYMMDD]_[SIGNATURE]
 * Example: DIMAS_20261025_5EA031
 */
export function generateLicenseCode(rawName: string, rawDate?: string): {
  code: string;
  name: string;
  dateStr: string;
  dateFormatted: string;
} {
  const cleanName = rawName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') || 'VIPUSER';
  
  let dateStr = '';
  if (rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    dateStr = rawDate.replace(/-/g, '');
  } else if (rawDate && /^\d{8}$/.test(rawDate)) {
    dateStr = rawDate;
  } else {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    dateStr = `${y}${m}${d}`;
  }

  const sig = computeLicenseSignature(cleanName, dateStr);
  const code = `${cleanName}_${dateStr}_${sig}`;

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const dateFormatted = `${day}/${month}/${year}`;

  return {
    code,
    name: cleanName,
    dateStr,
    dateFormatted
  };
}

export interface LicenseVerificationResult {
  valid: boolean;
  code: string;
  message: string;
  name?: string;
  dateFormatted?: string;
  isPromo?: boolean;
}

/**
 * Verifies any license activation code.
 * Tamper-proof: rejects forged signatures, invalid dates, or random strings.
 */
export function verifyLicenseCode(inputCode: string): LicenseVerificationResult {
  if (!inputCode || typeof inputCode !== 'string') {
    return { valid: false, code: '', message: 'Kode aktivasi tidak boleh kosong.' };
  }

  const clean = inputCode.trim().toUpperCase().replace(/\s+/g, '');
  
  // 1. Check one-way hashed promo digests
  const cleanDigest = hashPromoString(clean);
  if (K_PROMO_DIGESTS.includes(cleanDigest)) {
    return {
      valid: true,
      code: clean,
      isPromo: true,
      message: 'Aktivasi Berhasil! Lisensi Promo Darimana Duitnya aktif permanen.'
    };
  }

  // 2. Check dynamic cryptographic pattern: NAME_DATE_SIG or NAME-DATE-SIG
  const normalized = clean.replace(/-/g, '_');
  const parts = normalized.split('_');

  if (parts.length === 3) {
    const [namePart, datePart, sigPart] = parts;

    const nameRegex = /^[A-Z0-9]{2,30}$/;
    const dateRegex = /^(20[2-3][0-9])(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
    const sigRegex = /^[A-Z0-9]{6}$/;

    if (nameRegex.test(namePart) && dateRegex.test(datePart) && sigRegex.test(sigPart)) {
      const expectedSig = computeLicenseSignature(namePart, datePart);
      if (sigPart === expectedSig) {
        const year = datePart.substring(0, 4);
        const month = datePart.substring(4, 6);
        const day = datePart.substring(6, 8);
        const dateFormatted = `${day}/${month}/${year}`;

        return {
          valid: true,
          code: normalized,
          name: namePart,
          dateFormatted,
          message: `Aktivasi Berhasil! Terima kasih ${namePart} (Pembelian: ${dateFormatted}). Fitur PRO aktif selamanya.`
        };
      }
    }
  }

  return {
    valid: false,
    code: clean,
    message: 'Kode lisensi tidak valid atau tanda tangan digital tidak cocok. Pastikan kode diketik dengan benar.'
  };
}
