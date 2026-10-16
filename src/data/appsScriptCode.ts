/**
 * Google Apps Script Code template (Code.gs)
 * สำหรับติดตั้งใน Google Sheets > Extensions > Apps Script
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ==============================================================
 * Expense Tracker - Google Apps Script Backend (Code.gs)
 * บันทึกรายรับ-รายจ่าย และแสดงหน้าเว็บแอปพลิเคชัน (HTML)
 * ==============================================================
 */

const SHEET_NAME = 'Transactions';
const HEADERS = ['Timestamp', 'Date', 'Type', 'Title', 'Amount', 'Category', 'Wallet', 'ID'];

/**
 * ฟังก์ชันเริ่มต้นสำหรับสร้างหรือดึง Sheet สำหรับเก็บข้อมูล
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    // จัดรูปแบบหัวตาราง
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0F172A');
    headerRange.setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Handle GET request:
 * 1. หากมีพารามิเตอร์ ?action=... ให้ตอบเป็น API JSON
 * 2. หากเปิดผ่าน Browser โดยตรง ให้เรนเดอร์หน้าเว็บ HTML จากไฟล์ Index.html
 */
function doGet(e) {
  // 1. ถ้ามี parameter action เช่น ping, getTransactions ให้ทำงานเป็น API
  if (e && e.parameter && e.parameter.action) {
    return handleApiGet(e);
  }

  // 2. ถ้าเปิดดูหน้าเว็บ ให้โหลดไฟล์ Index.html มาแสดงผล
  try {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Expense Tracker - บันทึกรายรับ-รายจ่าย')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    return ContentService.createTextOutput(
      'Expense Tracker Web App พร้อมใช้งาน! (กรุณาสร้างไฟล์ HTML ชื่อ "Index" ใน Apps Script แล้วนำโค้ด Frontend ไปวาง)'
    );
  }
}

/**
 * ฟังก์ชันจัดการ API GET
 */
function handleApiGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = params.action || 'getTransactions';
    const sheet = getOrCreateSheet();

    // Ping check
    if (action === 'ping') {
      return createJsonResponse({
        success: true,
        message: 'Google Apps Script พร้อมใช้งาน!',
        timestamp: new Date().toISOString()
      });
    }

    // ดึงข้อมูลทั้งหมด
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return createJsonResponse({
        success: true,
        transactions: [],
        total: 0
      });
    }

    const transactions = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rawDate = row[1];
      let formattedDate = '';
      if (rawDate instanceof Date) {
        formattedDate = Utilities.formatDate(rawDate, 'Asia/Bangkok', 'yyyy-MM-dd');
      } else {
        formattedDate = String(rawDate).trim();
      }

      transactions.push({
        id: String(row[7] || ('TX_' + i)),
        date: formattedDate,
        type: String(row[2]).toLowerCase(),
        title: String(row[3]),
        amount: Number(row[4]) || 0,
        category: String(row[5]),
        wallet: String(row[6]),
        createdAt: row[0] ? new Date(row[0]).toISOString() : ''
      });
    }

    // เรียงลำดับจากล่าสุดไปเก่าสุด
    transactions.reverse();

    return createJsonResponse({
      success: true,
      transactions: transactions,
      total: transactions.length
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + err.toString()
    }, 500);
  }
}

/**
 * Handle POST request: บันทึกรายการใหม่ลง Sheet
 */
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    let data;
    
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('ไม่พบข้อมูลส่งมา (No data provided)');
    }

    const items = Array.isArray(data) ? data : (data.items || [data]);
    const timestamp = new Date();
    const addedRows = [];

    items.forEach(function(item) {
      const id = item.id || Utilities.getUuid();
      const date = item.date || Utilities.formatDate(timestamp, 'Asia/Bangkok', 'yyyy-MM-dd');
      const type = item.type || 'expense';
      const title = item.title || 'ไม่มีชื่อรายการ';
      const amount = Number(item.amount) || 0;
      const category = item.category || 'อื่นๆ';
      const wallet = item.wallet || 'เงินสด';

      sheet.appendRow([
        timestamp,
        date,
        type,
        title,
        amount,
        category,
        wallet,
        id
      ]);

      addedRows.push({ id, date, type, title, amount, category, wallet });
    });

    return createJsonResponse({
      success: true,
      message: 'บันทึกข้อมูลเรียบร้อยแล้ว (' + addedRows.length + ' รายการ)',
      data: addedRows
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + err.toString()
    }, 500);
  }
}

/**
 * สร้าง JSON Response
 */
function createJsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const DEPLOY_GUIDE_STEPS = [
  {
    step: 1,
    title: 'เปิด Google Sheet และ Apps Script',
    desc: 'เปิดสเปรดชีต Google Sheets ที่ต้องการใช้งาน จากนั้นคลิกเมนู Extensions (ส่วนขยาย) > Apps Script',
  },
  {
    step: 2,
    title: 'ใส่โค้ดฝั่งเซิร์ฟเวอร์ (Code.gs)',
    desc: 'เปิดไฟล์ Code.gs แล้วคัดลอกโค้ดสคริปต์ในแท็บ "โค้ด Code.gs" ไปวางแทนที่ทั้งหมด',
  },
  {
    step: 3,
    title: 'สร้างไฟล์หน้าเว็บ (Index.html)',
    desc: 'กดปุ่มเครื่องหมายบวก (+) ข้างคำว่า Files > เลือก "HTML" > ตั้งชื่อไฟล์ว่า "Index" > นำโค้ดจากแท็บ "ไฟล์ HTML หน้าเว็บ (ก้อนเดียวจบ)" ไปวาง',
  },
  {
    step: 4,
    title: 'Deploy เป็น Web App',
    desc: 'กดปุ่ม Deploy สีน้ำเงินมุมขวาบน > New deployment > เลือกประเภท Web app > ตั้งค่า Execute as: Me และ Who has access: Anyone (ทุกคน) > กด Deploy จะได้ Web App URL สามารถเปิดใช้งานได้ทันที!',
  },
];
