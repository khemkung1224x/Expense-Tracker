/**
 * Single-file standalone HTML for Expense Tracker (HTML + Tailwind CSS CDN + JS)
 * สามารถนำไปใส่ใน Google Apps Script (ไฟล์ Index.html หรือผ่าน HtmlService.createHtmlOutput) ได้โดยตรง
 */

export const STANDALONE_HTML_CONTENT = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expense Tracker - บันทึกรายรับ-รายจ่าย Google Sheets</title>
  <!-- Google Fonts: Noto Sans Thai -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Noto Sans Thai"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      font-family: 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #F8FAFC;
      color: #0F172A;
      -webkit-font-smoothing: antialiased;
    }
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
  </style>
</head>
<body class="bg-[#F8FAFC] text-slate-800 min-h-screen flex flex-col antialiased">

  <!-- Toast Notification Container -->
  <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"></div>

  <!-- Header / Navigation Bar -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="font-bold text-base sm:text-lg text-slate-900 tracking-tight">Expense Tracker</h1>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">Google Sheets</span>
          </div>
          <p class="text-[11px] text-slate-500 hidden sm:block font-normal">บันทึกรายรับ-รายจ่ายส่วนบุคคล</p>
        </div>
      </div>

      <!-- Desktop Nav Tabs -->
      <nav class="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button onclick="switchTab('entry')" id="nav-entry" class="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all bg-white text-slate-900 shadow-sm border border-slate-200/60">
          บันทึกรายการ
        </button>
        <button onclick="switchTab('monthly')" id="nav-monthly" class="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-slate-600 hover:text-slate-900">
          สรุปรายเดือน
        </button>
        <button onclick="switchTab('annual')" id="nav-annual" class="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-slate-600 hover:text-slate-900">
          สรุปรายปี
        </button>
      </nav>

      <!-- Sync / Settings Button -->
      <div class="flex items-center gap-2">
        <button onclick="openSettingsModal()" class="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="hidden sm:inline">เชื่อมต่อชีต</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content Container -->
  <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
    
    <!-- TAB 1: ENTRY FORM -->
    <section id="tab-entry" class="space-y-5 max-w-3xl mx-auto">
      <!-- Quick Overview -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm">
          <span class="text-xs text-slate-500 block mb-1">รายจ่ายวันนี้</span>
          <div id="today-expense" class="text-base sm:text-lg font-bold text-rose-600">฿0.00</div>
        </div>
        <div class="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm">
          <span class="text-xs text-slate-500 block mb-1">รายรับวันนี้</span>
          <div id="today-income" class="text-base sm:text-lg font-bold text-emerald-600">฿0.00</div>
        </div>
        <div class="col-span-2 sm:col-span-1 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div class="text-xs font-semibold text-slate-800">Google Sheets Sync</div>
            <div id="sync-status-badge" class="text-[11px] text-slate-500 mt-0.5">พร้อมบันทึกข้อมูล</div>
          </div>
          <button onclick="openSettingsModal()" class="text-xs font-semibold px-2.5 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
            ตั้งค่า
          </button>
        </div>
      </div>

      <!-- Main Form -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-sm">
        <div class="pb-4 mb-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900">บันทึกรายการ</h2>
            <p class="text-xs text-slate-500 mt-0.5">เลือกประเภท ระบุจำนวนเงิน และเลือกกระเป๋าตัง</p>
          </div>
        </div>

        <form id="entry-form" onsubmit="handleFormSubmit(event)" class="space-y-5">
          <!-- Type Toggle -->
          <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button type="button" onclick="setEntryType('income')" id="btn-type-income" class="py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all text-slate-600 hover:text-slate-900">
              <span>+ รายรับ (Income)</span>
            </button>
            <button type="button" onclick="setEntryType('expense')" id="btn-type-expense" class="py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all bg-rose-600 text-white shadow-sm">
              <span>- รายจ่าย (Expense)</span>
            </button>
          </div>

          <!-- Amount Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">จำนวนเงิน (บาท) *</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">฿</span>
              <input type="number" step="any" min="0" placeholder="0.00" id="input-amount" required
                class="w-full pl-11 pr-4 py-3 text-2xl sm:text-3xl font-bold rounded-xl border border-rose-200 text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-100 bg-rose-50/20">
            </div>
            <!-- Quick Chips -->
            <div class="flex flex-wrap items-center gap-1.5 mt-2">
              <span class="text-[11px] text-slate-400">เพิ่มด่วน:</span>
              <button type="button" onclick="addAmount(50)" class="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">+50 ฿</button>
              <button type="button" onclick="addAmount(100)" class="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">+100 ฿</button>
              <button type="button" onclick="addAmount(500)" class="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">+500 ฿</button>
              <button type="button" onclick="addAmount(1000)" class="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">+1,000 ฿</button>
              <button type="button" onclick="clearAmount()" class="text-xs px-2 py-1 text-slate-400 hover:text-rose-500 ml-auto">ล้างค่า</button>
            </div>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">ชื่อรายการ *</label>
            <input type="text" id="input-title" placeholder="เช่น ค่าข้าวเที่ยง, ค่าน้ำมัน, ช้อปปิ้ง" required
              class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400">
            <!-- Quick Title Suggestions -->
            <div id="quick-titles" class="flex flex-wrap items-center gap-1.5 mt-2"></div>
          </div>

          <!-- Dropdowns -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <!-- Date -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">วันที่</label>
              <input type="date" id="input-date" required
                class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 font-medium">
            </div>

            <!-- Category -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">กลุ่ม *</label>
              <select id="select-category" class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 font-medium"></select>
            </div>

            <!-- Wallet -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">กระเป๋าตัง *</label>
              <select id="select-wallet" onchange="updateWalletBadgePreview()" class="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 font-medium">
                <option value="SCB">🟣 SCB (ไทยพาณิชย์)</option>
                <option value="K+">🟢 K+ (กสิกรไทย)</option>
                <option value="BAAC">🔵 BAAC (ธ.ก.ส.)</option>
                <option value="เงินสด" selected>🟡 เงินสด (Cash)</option>
              </select>
            </div>
          </div>

          <!-- Wallet preview -->
          <div class="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
            <span class="text-slate-500">กระเป๋าที่เลือก:</span>
            <span id="wallet-preview-badge" class="px-2.5 py-0.5 rounded-lg font-semibold bg-amber-100 text-amber-900 border border-amber-200">
              🟡 เงินสด (Cash)
            </span>
          </div>

          <!-- Submit Button -->
          <button type="submit" id="btn-submit"
            class="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-sm transition-all bg-rose-600 hover:bg-rose-700 flex items-center justify-center gap-2">
            <span>บันทึกรายการ</span>
          </button>
        </form>
      </div>

      <!-- Recent Transactions List -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div class="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-bold text-slate-900 text-sm sm:text-base">ประวัติรายการล่าสุด</h3>
            <p class="text-xs text-slate-400">แสดงรายการล่าสุดที่บันทึกไว้</p>
          </div>
          <span id="total-count-badge" class="text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-medium">รวม 0 รายการ</span>
        </div>
        <div id="recent-list" class="divide-y divide-slate-100"></div>
      </div>
    </section>

    <!-- TAB 2: MONTHLY DASHBOARD -->
    <section id="tab-monthly" class="space-y-5 max-w-5xl mx-auto hidden">
      <!-- Month & Year Selector -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span>แดชบอร์ดสรุปรายเดือน</span>
            <span id="monthly-badge-label" class="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200"></span>
          </h2>
          <p class="text-xs text-slate-500">วิเคราะห์รายรับ-รายจ่ายและสัดส่วนกลุ่มประจำเดือน</p>
        </div>

        <div class="flex items-center gap-1.5 self-end sm:self-auto">
          <button onclick="changeMonth(-1)" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">◀</button>
          <select id="monthly-select-month" onchange="renderMonthlyDashboard()" class="px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-800"></select>
          <select id="monthly-select-year" onchange="renderMonthlyDashboard()" class="px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-800"></select>
          <button onclick="changeMonth(1)" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">▶</button>
        </div>
      </div>

      <!-- 3 Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-500 block mb-1">รายรับรวม (Total Income)</span>
          <div id="monthly-total-income" class="text-xl sm:text-2xl font-bold text-emerald-600">฿0.00</div>
          <div id="monthly-income-cats-count" class="mt-2 text-[11px] text-slate-400">0 กลุ่มรายรับ</div>
        </div>
        <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-500 block mb-1">รายจ่ายรวม (Total Expense)</span>
          <div id="monthly-total-expense" class="text-xl sm:text-2xl font-bold text-rose-600">฿0.00</div>
          <div id="monthly-expense-cats-count" class="mt-2 text-[11px] text-slate-400">0 กลุ่มรายจ่าย</div>
        </div>
        <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-500 block mb-1">คงเหลือสุทธิ (Net Savings)</span>
          <div id="monthly-net-balance" class="text-xl sm:text-2xl font-bold text-slate-900">฿0.00</div>
          <div id="monthly-savings-rate" class="mt-2 text-[11px] text-slate-500">อัตราการออม: 0%</div>
        </div>
      </div>

      <!-- Donut Charts: Expense & Income -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Expense Donut -->
        <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              สัดส่วนรายจ่ายแยกตามกลุ่ม
            </h4>
            <span id="donut-expense-total" class="text-sm font-bold text-rose-600">฿0.00</span>
          </div>
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div id="svg-donut-expense" class="relative flex-shrink-0 w-[200px] h-[200px]"></div>
            <div id="donut-expense-legend" class="flex-1 w-full space-y-1.5 max-h-52 overflow-y-auto pr-1"></div>
          </div>
        </div>

        <!-- Income Donut -->
        <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              สัดส่วนรายรับแยกตามกลุ่ม
            </h4>
            <span id="donut-income-total" class="text-sm font-bold text-emerald-600">฿0.00</span>
          </div>
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div id="svg-donut-income" class="relative flex-shrink-0 w-[200px] h-[200px]"></div>
            <div id="donut-income-legend" class="flex-1 w-full space-y-1.5 max-h-52 overflow-y-auto pr-1"></div>
          </div>
        </div>
      </div>

      <!-- Wallet Breakdown -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <h3 class="font-bold text-slate-900 text-sm mb-4">สรุปยอดแยกตามกระเป๋าตังประจำเดือน</h3>
        <div id="monthly-wallet-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"></div>
      </div>

      <!-- Month Transactions Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <h3 class="font-bold text-slate-900 text-sm mb-3">รายการทั้งหมดในเดือน</h3>
        <div id="monthly-tx-list" class="divide-y divide-slate-100 max-h-80 overflow-y-auto"></div>
      </div>
    </section>

    <!-- TAB 3: ANNUAL DASHBOARD -->
    <section id="tab-annual" class="space-y-5 max-w-5xl mx-auto hidden">
      <!-- Year Selector -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span>แดชบอร์ดสรุปรายปี</span>
            <span id="annual-badge-label" class="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200"></span>
          </h2>
          <p class="text-xs text-slate-500">วิเคราะห์รายรับ-รายจ่ายสะสมตลอด 12 เดือน และแยกตามกระเป๋าตัง</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">เลือกปี:</span>
          <select id="annual-select-year" onchange="renderAnnualDashboard()" class="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-800"></select>
        </div>
      </div>

      <!-- Wallet Filter Pills -->
      <div class="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60">
        <span class="text-xs text-slate-500 font-semibold px-2">มุมมอง:</span>
        <button onclick="setAnnualFilter('all')" id="filter-all" class="px-3 py-1 rounded-lg text-xs font-semibold bg-white text-slate-900 shadow-sm border border-slate-200/60">ภาพรวมทั้งหมด (Total)</button>
        <button onclick="setAnnualFilter('SCB')" id="filter-SCB" class="px-3 py-1 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-50">🟣 SCB</button>
        <button onclick="setAnnualFilter('K+')" id="filter-K+" class="px-3 py-1 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50">🟢 K+</button>
        <button onclick="setAnnualFilter('BAAC')" id="filter-BAAC" class="px-3 py-1 rounded-lg text-xs font-semibold text-sky-700 hover:bg-sky-50">🔵 BAAC</button>
        <button onclick="setAnnualFilter('เงินสด')" id="filter-เงินสด" class="px-3 py-1 rounded-lg text-xs font-semibold text-amber-800 hover:bg-amber-50">🟡 เงินสด</button>
      </div>

      <!-- 4 Annual Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-500 block mb-1">รายรับทั้งปี</span>
          <div id="annual-total-income" class="text-xl sm:text-2xl font-bold text-emerald-600">฿0.00</div>
          <div class="text-[11px] text-slate-400 mt-1">ตลอด 12 เดือน</div>
        </div>
        <div class="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-500 block mb-1">รายจ่ายทั้งปี</span>
          <div id="annual-total-expense" class="text-xl sm:text-2xl font-bold text-rose-600">฿0.00</div>
          <div class="text-[11px] text-slate-400 mt-1">ตลอด 12 เดือน</div>
        </div>
        <div class="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-500 block mb-1">คงเหลือสะสม</span>
          <div id="annual-net-balance" class="text-xl sm:text-2xl font-bold text-slate-900">฿0.00</div>
          <div class="text-[11px] text-slate-400 mt-1">เงินออมสะสมสุทธิ</div>
        </div>
        <div class="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-500 block mb-1">อัตราการออม</span>
          <div id="annual-savings-rate" class="text-xl sm:text-2xl font-bold text-slate-800">0%</div>
          <div class="text-[11px] text-slate-400 mt-1">สัดส่วนเงินเก็บเทียบรายได้</div>
        </div>
      </div>

      <!-- 12-Month Double Bar Chart -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h4 class="font-bold text-slate-900 text-sm sm:text-base">เปรียบเทียบรายรับ - รายจ่าย ตลอด 12 เดือน</h4>
            <p id="annual-chart-subtitle" class="text-xs text-slate-500 mt-0.5">มุมมอง: ภาพรวมทั้งหมด</p>
          </div>
          <div class="flex items-center gap-4 text-xs font-semibold">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <span class="text-slate-600">รายรับ (Income)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
              <span class="text-slate-600">รายจ่าย (Expense)</span>
            </div>
          </div>
        </div>

        <div id="annual-barchart-container" class="overflow-x-auto pt-2"></div>
      </div>

      <!-- 12-Month Detailed Data Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 class="font-bold text-slate-900 text-sm sm:text-base">ตารางสรุปข้อมูล 12 เดือน</h3>
        </div>
        <div class="overflow-x-auto -mx-5 sm:mx-0">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th class="py-2.5 px-4 font-semibold">เดือน</th>
                <th class="py-2.5 px-4 font-semibold text-right text-emerald-700">รายรับ</th>
                <th class="py-2.5 px-4 font-semibold text-right text-rose-700">รายจ่าย</th>
                <th class="py-2.5 px-4 font-semibold text-right text-slate-900">คงเหลือ</th>
                <th class="py-2.5 px-4 font-semibold text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody id="annual-table-body" class="divide-y divide-slate-100"></tbody>
            <tfoot id="annual-table-foot"></tfoot>
          </table>
        </div>
      </div>
    </section>

  </main>

  <!-- Mobile Bottom Navigation Bar -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
    <button onclick="switchTab('entry')" id="mob-entry" class="flex flex-col items-center justify-center py-1 px-3 text-slate-900 font-bold">
      <span class="text-xs">บันทึก</span>
    </button>
    <button onclick="switchTab('monthly')" id="mob-monthly" class="flex flex-col items-center justify-center py-1 px-3 text-slate-500 font-medium">
      <span class="text-xs">รายเดือน</span>
    </button>
    <button onclick="switchTab('annual')" id="mob-annual" class="flex flex-col items-center justify-center py-1 px-3 text-slate-500 font-medium">
      <span class="text-xs">รายปี</span>
    </button>
  </div>

  <!-- Settings / Sheets Modal -->
  <div id="settings-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs hidden">
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 class="font-bold text-slate-900 text-base">ตั้งค่า Google Sheets Web App</h3>
        <button onclick="closeSettingsModal()" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Web App URL (doPost/doGet)</label>
        <input type="url" id="modal-webapp-url" placeholder="https://script.google.com/macros/s/.../exec"
          class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 font-mono">
        <p class="text-[11px] text-slate-400 mt-1">ใส่ Web App URL ที่ได้จาก Apps Script Deploy as Web App</p>
      </div>
      <div class="flex items-center gap-2 pt-2">
        <button onclick="saveModalSettings()" class="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold">
          บันทึก URL
        </button>
        <button onclick="resetToSampleData()" class="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium">
          รีเซ็ตข้อมูลตัวอย่าง
        </button>
      </div>
    </div>
  </div>

  <!-- Embedded Logic JavaScript -->
  <script>
    const WALLETS = {
      'SCB': { name: 'SCB', label: 'ธนาคารไทยพาณิชย์ (SCB)', icon: '🟣', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
      'K+': { name: 'K+', label: 'ธนาคารกสิกรไทย (K+)', icon: '🟢', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      'BAAC': { name: 'BAAC', label: 'ธ.ก.ส. (BAAC)', icon: '🔵', badge: 'bg-sky-100 text-sky-800 border-sky-200' },
      'เงินสด': { name: 'เงินสด', label: 'เงินสด (Cash)', icon: '🟡', badge: 'bg-amber-100 text-amber-900 border-amber-200' }
    };

    const INCOME_CATEGORIES = ['เงินเดือน', 'มีคนให้', 'ค่าจ้าง', 'อื่นๆ'];
    const EXPENSE_CATEGORIES = [
      'อาหาร', 'เดินทาง, รถ', 'ของใช้จำเป็น', 'ช้อปปิ้ง', 'บันเทิง', 'บ้าน, สาธารณูปโภค',
      'สุขภาพ, ดูแลตัวเอง', 'ครอบครัว', 'ให้คนอื่น', 'ท่องเที่ยว', 'การศึกษา', 'งาน, ธุรกิจ',
      'ออมเงิน, ลงทุน', 'บัตรเครดิต', 'อื่นๆ'
    ];

    const THAI_MONTHS = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const THAI_SHORT_MONTHS = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    let currentType = 'expense';
    let currentTab = 'entry';
    let selectedMonthlyMonth = new Date().getMonth() + 1;
    let selectedMonthlyYear = new Date().getFullYear();
    let selectedAnnualYear = new Date().getFullYear();
    let currentAnnualFilter = 'all';

    // Mock initial data
    const INITIAL_SAMPLE = [
      { id: '1', date: '2026-10-01', type: 'income', title: 'เงินเดือน', amount: 38000, category: 'เงินเดือน', wallet: 'SCB' },
      { id: '2', date: '2026-10-02', type: 'expense', title: 'ค่าเช่าห้อง', amount: 8500, category: 'บ้าน, สาธารณูปโภค', wallet: 'K+' },
      { id: '3', date: '2026-10-03', type: 'expense', title: 'เติมน้ำมันรถยนต์', amount: 1200, category: 'เดินทาง, รถ', wallet: 'SCB' },
      { id: '4', date: '2026-10-05', type: 'expense', title: 'ซื้อของสด Big C', amount: 1450, category: 'อาหาร', wallet: 'K+' },
      { id: '5', date: '2026-10-07', type: 'income', title: 'ค่าจ้างออกแบบฟรีแลนซ์', amount: 6500, category: 'ค่าจ้าง', wallet: 'K+' },
      { id: '6', date: '2026-10-10', type: 'expense', title: 'ช้อปปิ้งออนไลน์', amount: 980, category: 'ช้อปปิ้ง', wallet: 'K+' },
      { id: '7', date: '2026-10-12', type: 'expense', title: 'อาหารและกาแฟ', amount: 240, category: 'อาหาร', wallet: 'เงินสด' }
    ];

    // LocalStorage helper
    function getStoredTransactions() {
      try {
        const item = localStorage.getItem('STANDALONE_EXPENSE_DATA');
        return item ? JSON.parse(item) : INITIAL_SAMPLE;
      } catch(e) {
        return INITIAL_SAMPLE;
      }
    }
    function saveTransactions(data) {
      try {
        localStorage.setItem('STANDALONE_EXPENSE_DATA', JSON.stringify(data));
      } catch(e) {}
    }
    function getStoredUrl() {
      return localStorage.getItem('STANDALONE_WEBAPP_URL') || '';
    }

    let transactions = getStoredTransactions();

    // Init
    window.addEventListener('DOMContentLoaded', () => {
      document.getElementById('input-date').value = new Date().toISOString().split('T')[0];
      populateCategories();
      populateDropdownYears();
      renderAll();
      syncFromSheets();
    });

    function syncFromSheets() {
      const url = getStoredUrl();
      if (!url) return;
      const getUrl = url.includes('?') ? url + '&action=getTransactions' : url + '?action=getTransactions';
      fetch(getUrl)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && Array.isArray(data.transactions) && data.transactions.length > 0) {
            transactions = data.transactions;
            saveTransactions(transactions);
            renderAll();
          }
        })
        .catch(err => console.log('Sync error:', err));
    }

    function renderAll() {
      renderRecentList();
      renderTodayStats();
      renderMonthlyDashboard();
      renderAnnualDashboard();
    }

    function switchTab(tabId) {
      currentTab = tabId;
      ['entry', 'monthly', 'annual'].forEach(t => {
        document.getElementById('tab-' + t).classList.toggle('hidden', t !== tabId);
        
        // Desktop nav styling
        const navBtn = document.getElementById('nav-' + t);
        if (navBtn) {
          if (t === tabId) {
            navBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all bg-white text-slate-900 shadow-sm border border-slate-200/60';
          } else {
            navBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-slate-600 hover:text-slate-900';
          }
        }
        // Mobile nav styling
        const mobBtn = document.getElementById('mob-' + t);
        if (mobBtn) {
          mobBtn.className = t === tabId
            ? 'flex flex-col items-center justify-center py-1 px-3 text-slate-900 font-bold'
            : 'flex flex-col items-center justify-center py-1 px-3 text-slate-500 font-medium';
        }
      });
      if (tabId === 'monthly') renderMonthlyDashboard();
      if (tabId === 'annual') renderAnnualDashboard();
    }

    function setEntryType(type) {
      currentType = type;
      const btnIncome = document.getElementById('btn-type-income');
      const btnExpense = document.getElementById('btn-type-expense');
      const inputAmount = document.getElementById('input-amount');
      const btnSubmit = document.getElementById('btn-submit');

      if (type === 'income') {
        btnIncome.className = 'py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all bg-emerald-600 text-white shadow-sm';
        btnExpense.className = 'py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all text-slate-600 hover:text-slate-900';
        inputAmount.className = 'w-full pl-11 pr-4 py-3 text-2xl sm:text-3xl font-bold rounded-xl border border-emerald-200 text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-emerald-50/20';
        btnSubmit.className = 'w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-sm transition-all bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2';
        btnSubmit.innerText = 'บันทึกรายรับ';
      } else {
        btnExpense.className = 'py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all bg-rose-600 text-white shadow-sm';
        btnIncome.className = 'py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all text-slate-600 hover:text-slate-900';
        inputAmount.className = 'w-full pl-11 pr-4 py-3 text-2xl sm:text-3xl font-bold rounded-xl border border-rose-200 text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-100 bg-rose-50/20';
        btnSubmit.className = 'w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-sm transition-all bg-rose-600 hover:bg-rose-700 flex items-center justify-center gap-2';
        btnSubmit.innerText = 'บันทึกรายจ่าย';
      }
      populateCategories();
    }

    function populateCategories() {
      const select = document.getElementById('select-category');
      const cats = currentType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      select.innerHTML = cats.map(c => '<option value="' + c + '">' + c + '</option>').join('');

      // quick suggestions
      const quickDiv = document.getElementById('quick-titles');
      const quickItems = currentType === 'income' 
        ? ['เงินเดือน', 'รับจ้างฟรีแลนซ์', 'มีคนโอนให้', 'ขายของ']
        : ['อาหารมื้อเที่ยง', 'กาแฟสด', 'ค่าน้ำมัน', 'ของใช้จำเป็น', 'ช้อปปิ้ง'];
      quickDiv.innerHTML = quickItems.map(item => 
        '<button type="button" onclick="setQuickTitle(\\'' + item + '\\')" class="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600">' + item + '</button>'
      ).join('');
    }

    function setQuickTitle(val) {
      document.getElementById('input-title').value = val;
    }

    function addAmount(val) {
      const el = document.getElementById('input-amount');
      const cur = parseFloat(el.value) || 0;
      el.value = (cur + val).toString();
    }
    function clearAmount() {
      document.getElementById('input-amount').value = '';
    }

    function updateWalletBadgePreview() {
      const sel = document.getElementById('select-wallet').value;
      const w = WALLETS[sel] || WALLETS['เงินสด'];
      const badge = document.getElementById('wallet-preview-badge');
      badge.className = 'px-2.5 py-0.5 rounded-lg font-semibold border ' + w.badge;
      badge.innerText = w.icon + ' ' + w.label;
    }

    // Submit new transaction
    function handleFormSubmit(e) {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('input-amount').value);
      const title = document.getElementById('input-title').value.trim();
      const date = document.getElementById('input-date').value;
      const category = document.getElementById('select-category').value;
      const wallet = document.getElementById('select-wallet').value;

      if (!amount || amount <= 0 || !title) {
        showToast('error', 'กรุณาระบุจำนวนเงินและชื่อรายการ');
        return;
      }

      const newTx = {
        id: 'tx-' + Date.now(),
        date,
        type: currentType,
        title,
        amount,
        category,
        wallet
      };

      transactions.unshift(newTx);
      saveTransactions(transactions);

      // Send to Google Sheets if running inside GAS or WebApp URL configured
      const webAppUrl = getStoredUrl();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(() => showToast('success', 'บันทึกลงชีตสำเร็จ'))
          .withFailureHandler(err => showToast('error', 'เกิดข้อผิดพลาด: ' + err))
          .doPost({ postData: { contents: JSON.stringify(newTx) } });
      } else if (webAppUrl) {
        fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTx)
        }).catch(err => console.log('POST error', err));
      }

      showToast('success', 'บันทึก "' + title + '" ฿' + amount.toLocaleString('th-TH') + ' เรียบร้อย');
      document.getElementById('input-title').value = '';
      document.getElementById('input-amount').value = '';
      renderAll();
    }

    function deleteTransaction(id) {
      transactions = transactions.filter(t => t.id !== id);
      saveTransactions(transactions);
      showToast('info', 'ลบรายการเรียบร้อยแล้ว');
      renderAll();

      const webAppUrl = getStoredUrl();
      if (webAppUrl) {
        fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'delete', id: id })
        }).catch(err => console.log('Delete error', err));
      }
    }

    function renderRecentList() {
      const container = document.getElementById('recent-list');
      const recent = transactions.slice(0, 10);
      document.getElementById('total-count-badge').innerText = 'รวม ' + transactions.length + ' รายการ';

      if (recent.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-slate-400 text-xs">ยังไม่มีรายการบันทึก</div>';
        return;
      }

      container.innerHTML = recent.map(tx => {
        const w = WALLETS[tx.wallet] || WALLETS['เงินสด'];
        const isInc = tx.type === 'income';
        return '<div class="py-3 flex items-center justify-between gap-3 px-2 hover:bg-slate-50 rounded-xl transition-colors">' +
          '<div class="flex items-center gap-3 min-w-0">' +
            '<div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ' + 
              (isInc ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200') + '">' +
              (isInc ? '+' : '-') +
            '</div>' +
            '<div class="min-w-0">' +
              '<div class="font-semibold text-xs sm:text-sm text-slate-900 truncate">' + tx.title + '</div>' +
              '<div class="flex flex-wrap items-center gap-2 mt-0.5">' +
                '<span class="text-[11px] text-slate-400">' + tx.date + '</span>' +
                '<span class="text-[11px] px-2 py-0.2 rounded-md bg-slate-100 text-slate-600">' + tx.category + '</span>' +
                '<span class="text-[10px] px-2 py-0.2 rounded-md font-semibold border ' + w.badge + '">' + w.icon + ' ' + w.name + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="flex items-center gap-2 flex-shrink-0">' +
            '<span class="text-xs sm:text-sm font-bold ' + (isInc ? 'text-emerald-600' : 'text-rose-600') + '">' +
              (isInc ? '+' : '-') + '฿' + tx.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 }) +
            '</span>' +
            '<button onclick="deleteTransaction(\\'' + tx.id + '\\')" class="text-slate-400 hover:text-rose-600 p-1 text-xs">✕</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function renderTodayStats() {
      const today = new Date().toISOString().split('T')[0];
      const todayTxs = transactions.filter(t => t.date === today);
      const inc = todayTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const exp = todayTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      document.getElementById('today-income').innerText = '฿' + inc.toLocaleString('th-TH', { minimumFractionDigits: 2 });
      document.getElementById('today-expense').innerText = '฿' + exp.toLocaleString('th-TH', { minimumFractionDigits: 2 });
    }

    function populateDropdownYears() {
      const currentYr = new Date().getFullYear();
      const years = [currentYr - 1, currentYr, currentYr + 1];
      const mSel = document.getElementById('monthly-select-year');
      const aSel = document.getElementById('annual-select-year');
      const opts = years.map(y => '<option value="' + y + '" ' + (y === currentYr ? 'selected' : '') + '>พ.ศ. ' + (y + 543) + '</option>').join('');
      mSel.innerHTML = opts;
      aSel.innerHTML = opts;

      const mMonthSel = document.getElementById('monthly-select-month');
      mMonthSel.innerHTML = THAI_MONTHS.map((m, idx) => 
        '<option value="' + (idx + 1) + '" ' + ((idx + 1) === selectedMonthlyMonth ? 'selected' : '') + '>' + m + '</option>'
      ).join('');
    }

    function changeMonth(delta) {
      selectedMonthlyMonth += delta;
      if (selectedMonthlyMonth < 1) {
        selectedMonthlyMonth = 12;
        selectedMonthlyYear -= 1;
      } else if (selectedMonthlyMonth > 12) {
        selectedMonthlyMonth = 1;
        selectedMonthlyYear += 1;
      }
      document.getElementById('monthly-select-month').value = selectedMonthlyMonth;
      document.getElementById('monthly-select-year').value = selectedMonthlyYear;
      renderMonthlyDashboard();
    }

    function renderMonthlyDashboard() {
      selectedMonthlyMonth = parseInt(document.getElementById('monthly-select-month').value, 10);
      selectedMonthlyYear = parseInt(document.getElementById('monthly-select-year').value, 10);
      const monthName = THAI_MONTHS[selectedMonthlyMonth - 1];
      document.getElementById('monthly-badge-label').innerText = monthName + ' ' + (selectedMonthlyYear + 543);

      const filtered = transactions.filter(tx => {
        const [y, m] = tx.date.split('-').map(Number);
        return y === selectedMonthlyYear && m === selectedMonthlyMonth;
      });

      let totalInc = 0;
      let totalExp = 0;
      const incCats = {};
      const expCats = {};
      const walletMap = {
        'SCB': { inc: 0, exp: 0 },
        'K+': { inc: 0, exp: 0 },
        'BAAC': { inc: 0, exp: 0 },
        'เงินสด': { inc: 0, exp: 0 }
      };

      filtered.forEach(tx => {
        const amt = tx.amount || 0;
        const w = tx.wallet || 'เงินสด';
        if (tx.type === 'income') {
          totalInc += amt;
          incCats[tx.category] = (incCats[tx.category] || 0) + amt;
          if (walletMap[w]) walletMap[w].inc += amt;
        } else {
          totalExp += amt;
          expCats[tx.category] = (expCats[tx.category] || 0) + amt;
          if (walletMap[w]) walletMap[w].exp += amt;
        }
      });

      const net = totalInc - totalExp;
      const rate = totalInc > 0 ? Math.max(0, (net / totalInc) * 100) : 0;

      document.getElementById('monthly-total-income').innerText = '฿' + totalInc.toLocaleString('th-TH', { minimumFractionDigits: 2 });
      document.getElementById('monthly-total-expense').innerText = '฿' + totalExp.toLocaleString('th-TH', { minimumFractionDigits: 2 });
      document.getElementById('monthly-net-balance').innerText = (net >= 0 ? '+' : '') + '฿' + net.toLocaleString('th-TH', { minimumFractionDigits: 2 });
      document.getElementById('monthly-net-balance').className = 'text-xl sm:text-2xl font-bold ' + (net >= 0 ? 'text-slate-900' : 'text-rose-600');
      document.getElementById('monthly-income-cats-count').innerText = Object.keys(incCats).length + ' กลุ่มรายรับ';
      document.getElementById('monthly-expense-cats-count').innerText = Object.keys(expCats).length + ' กลุ่มรายจ่าย';
      document.getElementById('monthly-savings-rate').innerText = 'อัตราการออม: ' + rate.toFixed(1) + '%';

      // Render Donut charts
      renderDonut('svg-donut-expense', 'donut-expense-legend', 'donut-expense-total', expCats, totalExp, '#F43F5E');
      renderDonut('svg-donut-income', 'donut-income-legend', 'donut-income-total', incCats, totalInc, '#10B981');

      // Render Wallet Cards
      const wGrid = document.getElementById('monthly-wallet-grid');
      wGrid.innerHTML = Object.keys(WALLETS).map(k => {
        const w = WALLETS[k];
        const d = walletMap[k] || { inc: 0, exp: 0 };
        const bal = d.inc - d.exp;
        return '<div class="p-3.5 rounded-xl border bg-slate-50/50 border-slate-200">' +
          '<div class="flex items-center justify-between mb-1.5">' +
            '<span class="font-bold text-xs text-slate-800">' + w.icon + ' ' + w.name + '</span>' +
            '<span class="text-[10px] font-semibold px-2 py-0.2 rounded-full border ' + 
              (bal >= 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200') + '">' +
              (bal >= 0 ? 'คงเหลือ' : 'ติดลบ') +
            '</span>' +
          '</div>' +
          '<div class="text-base font-bold text-slate-900 mb-2">' + (bal >= 0 ? '+' : '') + '฿' + bal.toLocaleString('th-TH') + '</div>' +
          '<div class="text-[11px] pt-2 border-t border-slate-200/60 text-slate-600 space-y-1">' +
            '<div class="flex justify-between"><span>รับ:</span><span class="text-emerald-700 font-medium">+฿' + d.inc.toLocaleString('th-TH') + '</span></div>' +
            '<div class="flex justify-between"><span>จ่าย:</span><span class="text-rose-700 font-medium">-฿' + d.exp.toLocaleString('th-TH') + '</span></div>' +
          '</div>' +
        '</div>';
      }).join('');

      // Monthly List
      const txList = document.getElementById('monthly-tx-list');
      if (filtered.length === 0) {
        txList.innerHTML = '<div class="text-center py-6 text-slate-400 text-xs">ไม่มีรายการในเดือนนี้</div>';
      } else {
        txList.innerHTML = filtered.map(tx => {
          const w = WALLETS[tx.wallet] || WALLETS['เงินสด'];
          const isInc = tx.type === 'income';
          return '<div class="py-2.5 flex items-center justify-between gap-3 text-xs">' +
            '<div class="min-w-0">' +
              '<div class="font-semibold text-slate-900 truncate">' + tx.title + '</div>' +
              '<div class="text-slate-400 text-[11px]">' + tx.date + ' • ' + tx.category + ' • ' + w.name + '</div>' +
            '</div>' +
            '<div class="font-bold ' + (isInc ? 'text-emerald-600' : 'text-rose-600') + '">' +
              (isInc ? '+' : '-') + '฿' + tx.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 }) +
            '</div>' +
          '</div>';
        }).join('');
      }
    }

    // Helper SVG Donut
    function renderDonut(svgId, legendId, totalId, cats, total, defaultColor) {
      document.getElementById(totalId).innerText = '฿' + total.toLocaleString('th-TH', { minimumFractionDigits: 2 });
      const svgContainer = document.getElementById(svgId);
      const legendContainer = document.getElementById(legendId);

      const entries = Object.entries(cats).filter(([_, v]) => v > 0);
      if (total === 0 || entries.length === 0) {
        svgContainer.innerHTML = '<div class="flex items-center justify-center w-full h-full text-xs text-slate-400">ไม่มีข้อมูล</div>';
        legendContainer.innerHTML = '<div class="text-xs text-slate-400">ไม่มีรายการในหมวดนี้</div>';
        return;
      }

      const colors = ['#F43F5E', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#06B6D4', '#EC4899', '#64748B'];
      const size = 200;
      const strokeWidth = 28;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      let accum = 0;

      let circles = '<circle cx="100" cy="100" r="' + radius + '" fill="transparent" stroke="#F1F5F9" stroke-width="' + strokeWidth + '"></circle>';

      entries.forEach(([label, val], idx) => {
        const c = colors[idx % colors.length];
        const pct = val / total;
        const dash = (pct * circumference) + ' ' + circumference;
        const offset = -accum * circumference;
        accum += pct;
        circles += '<circle cx="100" cy="100" r="' + radius + '" fill="transparent" stroke="' + c + '" stroke-width="' + strokeWidth + '" stroke-dasharray="' + dash + '" stroke-dashoffset="' + offset + '"></circle>';
      });

      svgContainer.innerHTML = '<svg width="200" height="200" class="transform -rotate-90">' + circles + '</svg>' +
        '<div class="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none">' +
          '<span class="text-[11px] text-slate-400 font-medium">รวม</span>' +
          '<span class="text-sm font-bold text-slate-900 mt-0.5">' + entries.length + ' กลุ่ม</span>' +
        '</div>';

      legendContainer.innerHTML = entries.map(([label, val], idx) => {
        const c = colors[idx % colors.length];
        const pct = ((val / total) * 100).toFixed(1);
        return '<div class="flex items-center justify-between text-xs p-1 rounded hover:bg-slate-50">' +
          '<div class="flex items-center gap-2 truncate pr-2">' +
            '<span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color:' + c + '"></span>' +
            '<span class="text-slate-700 truncate">' + label + '</span>' +
          '</div>' +
          '<div class="text-right flex-shrink-0">' +
            '<span class="text-slate-400 text-[11px] mr-2">' + pct + '%</span>' +
            '<span class="font-semibold text-slate-800">฿' + val.toLocaleString('th-TH') + '</span>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function setAnnualFilter(filter) {
      currentAnnualFilter = filter;
      ['all', 'SCB', 'K+', 'BAAC', 'เงินสด'].forEach(k => {
        const btn = document.getElementById('filter-' + k);
        if (btn) {
          if (k === filter) {
            btn.className = 'px-3 py-1 rounded-lg text-xs font-semibold bg-white text-slate-900 shadow-sm border border-slate-200/60';
          } else {
            btn.className = 'px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900';
          }
        }
      });
      renderAnnualDashboard();
    }

    function renderAnnualDashboard() {
      selectedAnnualYear = parseInt(document.getElementById('annual-select-year').value, 10);
      document.getElementById('annual-badge-label').innerText = 'พ.ศ. ' + (selectedAnnualYear + 543);
      document.getElementById('annual-chart-subtitle').innerText = 'มุมมอง: ' + 
        (currentAnnualFilter === 'all' ? 'ภาพรวมทั้งหมด (Total)' : WALLETS[currentAnnualFilter].label);

      const monthsData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        name: THAI_MONTHS[i],
        short: THAI_SHORT_MONTHS[i],
        inc: 0,
        exp: 0,
        net: 0
      }));

      let totalInc = 0;
      let totalExp = 0;

      transactions.forEach(tx => {
        const [y, m] = tx.date.split('-').map(Number);
        if (y !== selectedAnnualYear) return;
        if (currentAnnualFilter !== 'all' && tx.wallet !== currentAnnualFilter) return;

        const amt = tx.amount || 0;
        const mIdx = m - 1;
        if (tx.type === 'income') {
          totalInc += amt;
          monthsData[mIdx].inc += amt;
          monthsData[mIdx].net += amt;
        } else {
          totalExp += amt;
          monthsData[mIdx].exp += amt;
          monthsData[mIdx].net -= amt;
        }
      });

      const net = totalInc - totalExp;
      const rate = totalInc > 0 ? Math.max(0, (net / totalInc) * 100) : 0;

      document.getElementById('annual-total-income').innerText = '฿' + totalInc.toLocaleString('th-TH', { minimumFractionDigits: 2 });
      document.getElementById('annual-total-expense').innerText = '฿' + totalExp.toLocaleString('th-TH', { minimumFractionDigits: 2 });
      document.getElementById('annual-net-balance').innerText = (net >= 0 ? '+' : '') + '฿' + net.toLocaleString('th-TH', { minimumFractionDigits: 2 });
      document.getElementById('annual-net-balance').className = 'text-xl sm:text-2xl font-bold ' + (net >= 0 ? 'text-slate-900' : 'text-rose-600');
      document.getElementById('annual-savings-rate').innerText = rate.toFixed(1) + '%';

      // Render 12-Month Bar Chart
      renderAnnualBarChart(monthsData);

      // Render Table
      const tbody = document.getElementById('annual-table-body');
      tbody.innerHTML = monthsData.map(m => {
        const isPos = m.net >= 0;
        return '<tr class="hover:bg-slate-50/70 transition-colors">' +
          '<td class="py-2.5 px-4 font-medium text-slate-800">' + m.name + '</td>' +
          '<td class="py-2.5 px-4 text-right font-medium text-emerald-600">฿' + m.inc.toLocaleString('th-TH', { minimumFractionDigits: 2 }) + '</td>' +
          '<td class="py-2.5 px-4 text-right font-medium text-rose-600">฿' + m.exp.toLocaleString('th-TH', { minimumFractionDigits: 2 }) + '</td>' +
          '<td class="py-2.5 px-4 text-right font-bold ' + (isPos ? 'text-slate-900' : 'text-rose-600') + '">' + 
            (isPos ? '+' : '') + '฿' + m.net.toLocaleString('th-TH', { minimumFractionDigits: 2 }) +
          '</td>' +
          '<td class="py-2.5 px-4 text-center">' +
            '<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full border ' +
              (isPos ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200') + '">' +
              (isPos ? 'เงินเหลือ' : 'ใช้เกิน') +
            '</span>' +
          '</td>' +
        '</tr>';
      }).join('');

      // Table Footer
      const tfoot = document.getElementById('annual-table-foot');
      tfoot.innerHTML = '<tr class="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">' +
        '<td class="py-3 px-4">ผลรวมทั้งปี</td>' +
        '<td class="py-3 px-4 text-right text-emerald-700">฿' + totalInc.toLocaleString('th-TH', { minimumFractionDigits: 2 }) + '</td>' +
        '<td class="py-3 px-4 text-right text-rose-700">฿' + totalExp.toLocaleString('th-TH', { minimumFractionDigits: 2 }) + '</td>' +
        '<td class="py-3 px-4 text-right ' + (net >= 0 ? 'text-slate-900' : 'text-rose-700') + '">' +
          (net >= 0 ? '+' : '') + '฿' + net.toLocaleString('th-TH', { minimumFractionDigits: 2 }) +
        '</td>' +
        '<td class="py-3 px-4 text-center"><span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">ออม ' + rate.toFixed(1) + '%</span></td>' +
      '</tr>';
    }

    function renderAnnualBarChart(months) {
      const maxVal = Math.max(...months.map(m => Math.max(m.inc, m.exp)), 10000);
      const ceilMax = Math.ceil(maxVal / 10000) * 10000;
      const height = 180;

      const container = document.getElementById('annual-barchart-container');
      const barsHtml = months.map(m => {
        const hInc = Math.max((m.inc / ceilMax) * height, 2);
        const hExp = Math.max((m.exp / ceilMax) * height, 2);

        return '<div class="flex-1 flex flex-col items-center justify-end h-full px-1 group cursor-pointer" title="' + m.name + ': รับ ฿' + m.inc.toLocaleString() + ' / จ่าย ฿' + m.exp.toLocaleString() + '">' +
          '<div class="w-full flex items-end justify-center gap-1 max-w-[28px]">' +
            '<div style="height:' + hInc + 'px" class="w-1/2 bg-emerald-500 hover:bg-emerald-600 rounded-t-sm transition-all"></div>' +
            '<div style="height:' + hExp + 'px" class="w-1/2 bg-rose-500 hover:bg-rose-600 rounded-t-sm transition-all"></div>' +
          '</div>' +
          '<div class="text-[11px] mt-2 font-medium text-slate-500">' + m.short + '</div>' +
        '</div>';
      }).join('');

      container.innerHTML = '<div class="min-w-[560px]">' +
        '<div class="relative pl-12 pr-2 flex items-end justify-between h-[200px] pb-4 border-b border-slate-200">' +
          barsHtml +
        '</div>' +
      '</div>';
    }

    // Modal & Toast
    function openSettingsModal() {
      document.getElementById('modal-webapp-url').value = getStoredUrl();
      document.getElementById('settings-modal').classList.remove('hidden');
    }
    function closeSettingsModal() {
      document.getElementById('settings-modal').classList.add('hidden');
    }
    function saveModalSettings() {
      const url = document.getElementById('modal-webapp-url').value.trim();
      localStorage.setItem('STANDALONE_WEBAPP_URL', url);
      showToast('success', 'บันทึกการตั้งค่า Web App URL เรียบร้อย');
      closeSettingsModal();
    }
    function resetToSampleData() {
      transactions = [...INITIAL_SAMPLE];
      saveTransactions(transactions);
      showToast('success', 'รีเซ็ตเป็นข้อมูลตัวอย่างเรียบร้อย');
      closeSettingsModal();
      renderAll();
    }

    function showToast(type, text) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-900';
      toast.className = bg + ' text-white p-3.5 rounded-xl shadow-lg text-xs font-semibold pointer-events-auto transition-all transform duration-300';
      toast.innerText = text;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }
  </script>
</body>
</html>`;
