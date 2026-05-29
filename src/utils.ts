/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formats a number to Indonesian Rupiah (IDR) currency format.
 */
export function formatRupiah(value: number): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absValue);
  
  return `${isNegative ? '-' : ''}Rp ${formatted}`;
}

/**
 * Parses "dd/mm/yy" into a "YYYY-MM-DD" string for inputs, or vice-versa.
 */
export function parseDDMMYYToYYYYMMDD(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  // Handle 2-digit years, assuming 2000s
  const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
  return `${year}-${month}-${day}`;
}

/**
 * Formats "YYYY-MM-DD" into a "dd/mm/yy" string.
 */
export function formatYYYYMMDDToDDMMYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0].substring(2); // 2-digit year
  const month = parts[1];
  const day = parts[2];
  return `${day}/${month}/${year}`;
}

/**
 * Formats "YYYY-MM-DD" into Indonesian readable date (e.g., "7 Mei 2026").
 */
export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return '';
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
    'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${day} ${months[monthIndex] || ''} ${year}`;
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
