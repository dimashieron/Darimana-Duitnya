/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  userName: 'Pengguna Baru',
  theme: 'light',
  gasUrl: '',
  wallets: [
    { id: 'cash', name: 'Cash', balance: 0, icon: 'Wallet', color: 'emerald' },
    { id: 'rekening', name: 'Rekening', balance: 0, icon: 'CreditCard', color: 'blue' },
  ],
  investments: [],
  emergencyFund: {
    monthlyExpense: 0,
    monthTarget: 6,
    balance: 0,
  },
  savingGoals: [],
  budgets: [],
  transactions: [],
  categories: [
    { name: 'Makanan', icon: 'Utensils', color: 'bg-red-100 text-red-600 dark:bg-red-955 dark:text-red-400', isDefault: true },
    { name: 'Transportasi', icon: 'Car', color: 'bg-blue-100 text-blue-600 dark:bg-blue-955 dark:text-blue-400', isDefault: true },
    { name: 'Tagihan', icon: 'Receipt', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-955 dark:text-indigo-400', isDefault: true },
    { name: 'Belanja', icon: 'ShoppingBag', color: 'bg-pink-100 text-pink-600 dark:bg-pink-955 dark:text-pink-400', isDefault: true },
    { name: 'Kesehatan', icon: 'HeartPulse', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-955 dark:text-emerald-400', isDefault: true },
    { name: 'Gaji', icon: 'Briefcase', color: 'bg-green-100 text-green-600 dark:bg-green-955 dark:text-green-400', isDefault: true },
    { name: 'Bonus', icon: 'Gift', color: 'bg-amber-100 text-amber-600 dark:bg-amber-955 dark:text-amber-400', isDefault: true },
    { name: 'Investasi', icon: 'TrendingUp', color: 'bg-teal-100 text-teal-600 dark:bg-teal-955 dark:text-teal-400', isDefault: true },
    { name: 'Hiburan', icon: 'Gamepad2', color: 'bg-purple-100 text-purple-600 dark:bg-purple-955 dark:text-purple-400', isDefault: true },
    { name: 'Lainnya', icon: 'HelpCircle', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', isDefault: true },
  ],
};

export const CATEGORIES = [
  { name: 'Makanan', icon: 'Utensils', color: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' },
  { name: 'Transportasi', icon: 'Car', color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  { name: 'Tagihan', icon: 'Receipt', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
  { name: 'Belanja', icon: 'ShoppingBag', color: 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400' },
  { name: 'Kesehatan', icon: 'HeartPulse', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { name: 'Gaji', icon: 'Briefcase', color: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400' },
  { name: 'Bonus', icon: 'Gift', color: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
  { name: 'Investasi', icon: 'TrendingUp', color: 'bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400' },
  { name: 'Hiburan', icon: 'Gamepad2', color: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400' },
  { name: 'Lainnya', icon: 'HelpCircle', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script for Finance Tracker Pro
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com).
 * 2. Create a new Spreadsheet and name it e.g. "Finance Tracker Pro DB".
 * 3. Go to Extention -> Apps Script (Ekstensi -> Apps Script).
 * 4. Remove any existing code in Code.gs and paste this script there.
 * 5. Save the project.
 * 6. Click "Deploy" (Terapkan) -> "New deployment" (Terapkan baru).
 * 7. Choose type "Web app" (Aplikasi web).
 * 8. Set Description as "Finance Tracker Pro Connection".
 * 9. Set "Execute as" (Jalankan sebagai) to "Me" (Saya / pemilik spreadsheet).
 * 10. Set "Who has access" (Siapa yang memiliki akses) to "Anyone" (Siapa saja).
 * 11. Click Deploy, grant permissions, and copy the deployment WEB APP URL.
 * 12. Paste the Web App URL in the Settings tab of the Finance Tracker Pro app.
 */

function doGet(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    
    setupSheets();
    const result = {
      transactions: getSheetData("TRANSAKSI"),
      wallets: getSheetData("DOMPET"),
      savingGoals: getSheetData("TABUNGAN"),
      emergencyFund: getSheetData("DANA_DARURAT")[0] || null,
      investments: getSheetData("INVESTASI"),
      budgets: getSheetData("BUDGET")
    };
    
    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: result }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    
    setupSheets();
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action; // "sync_all" | "add_transaction"
    
    if (action === "sync_all") {
      saveSheetData("TRANSAKSI", postData.transactions);
      saveSheetData("DOMPET", postData.wallets);
      saveSheetData("TABUNGAN", postData.savingGoals);
      saveSheetData("INVESTASI", postData.investments);
      saveSheetData("BUDGET", postData.budgets);
      
      const df = postData.emergencyFund;
      if (df) {
        saveSheetData("DANA_DARURAT", [df]);
      }
      
      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data synced successfully!" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unsupported action." }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ["TRANSAKSI", "DOMPET", "TABUNGAN", "DANA_DARURAT", "INVESTASI", "BUDGET"];
  
  sheets.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      // Setup default headers info
      let headers = [];
      if (name === "TRANSAKSI") headers = ["id", "type", "nominal", "category", "date", "source", "destination", "notes", "timestamp"];
      else if (name === "DOMPET") headers = ["id", "name", "balance", "icon", "color"];
      else if (name === "TABUNGAN") headers = ["id", "name", "target", "balance"];
      else if (name === "DANA_DARURAT") headers = ["monthlyExpense", "monthTarget", "balance"];
      else if (name === "INVESTASI") headers = ["id", "name", "qty", "value", "percentChange"];
      else if (name === "BUDGET") headers = ["category", "limit", "spent"];
      
      sheet.appendRow(headers);
    }
  });
}

function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  
  const headers = rows[0];
  const data = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const item = {};
    headers.forEach((header, colIndex) => {
      let val = row[colIndex];
      // Try parsing numeric or state properties cleanly
      if (typeof val === 'string' && val.startsWith('{')) {
        try { val = JSON.parse(val); } catch(ex){}
      }
      item[header] = val;
    });
    data.push(item);
  }
  return data;
}

function saveSheetData(sheetName, list) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (sheet) {
    sheet.clear();
  } else {
    sheet = ss.insertSheet(sheetName);
  }
  
  if (list.length === 0) {
    let headers = [];
    if (sheetName === "TRANSAKSI") headers = ["id", "type", "nominal", "category", "date", "source", "destination", "notes", "timestamp"];
    else if (sheetName === "DOMPET") headers = ["id", "name", "balance", "icon", "color"];
    else if (sheetName === "TABUNGAN") headers = ["id", "name", "target", "balance"];
    else if (sheetName === "DANA_DARURAT") headers = ["monthlyExpense", "monthTarget", "balance"];
    else if (sheetName === "INVESTASI") headers = ["id", "name", "qty", "value", "percentChange"];
    else if (sheetName === "BUDGET") headers = ["category", "limit", "spent"];
    sheet.appendRow(headers);
    return;
  }
  
  const headers = Object.keys(list[0]);
  sheet.appendRow(headers);
  
  const matrix = list.map(item => {
    return headers.map(key => {
      let value = item[key];
      if (value === null || value === undefined) return "";
      if (typeof value === 'object') return JSON.stringify(value);
      return value;
    });
  });
  
  sheet.getRange(2, 1, matrix.length, headers.length).setValues(matrix);
}
`;
