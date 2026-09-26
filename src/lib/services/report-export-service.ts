/**
 * Report Export Service for Monday Hotels Enterprise CRM
 * Provides PDF export, Excel spreadsheet formatting, and Automated Email Digest management.
 */

export interface ReportMetricSummary {
  label: string;
  value: string | number;
  subtext?: string;
  change?: string;
}

export interface PrintableReportData {
  title: string;
  subtitle?: string;
  dateRange: string;
  generatedBy: string;
  metrics: ReportMetricSummary[];
  tableHeaders: string[];
  tableRows: (string | number)[][];
  executiveNotes?: string;
}

export interface EmailDigestSubscription {
  id: string;
  title: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  recipientEmails: string[];
  metricsIncluded: string[];
  activeTab: string;
  status: "ACTIVE" | "PAUSED";
  lastSentAt?: string;
  createdAt: string;
}

const DIGEST_STORAGE_KEY = "monday_hotels_email_digests_v1";

/**
 * Export data array to XML/HTML Excel compatible spreadsheet
 */
export function exportToExcel(filename: string, sheetName: string, headers: string[], dataRows: (string | number)[][]) {
  if (typeof window === "undefined") return;

  const headerHtml = headers.map((h) => `<th style="background-color:#1e293b; color:#f8fafc; font-weight:bold; padding:10px; border:1px solid #475569;">${h}</th>`).join("");
  const rowsHtml = dataRows
    .map(
      (row) =>
        `<tr>` +
        row
          .map(
            (val) =>
              `<td style="padding:8px; border:1px solid #cbd5e1; font-size:13px; font-family:sans-serif; text-align:${typeof val === "number" ? "right" : "left"}">${val ?? ""}</td>`
          )
          .join("") +
        `</tr>`
    )
    .join("");

  const excelTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mxml 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    </head>
    <body>
      <h2 style="font-family:sans-serif; color:#0f172a;">Monday Hotels Enterprise CRM - ${sheetName}</h2>
      <p style="font-family:sans-serif; color:#64748b; font-size:12px;">Generated on: ${new Date().toLocaleString()}</p>
      <table style="border-collapse:collapse; width:100%; font-family:sans-serif;">
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate formatted window and invoke print/PDF download
 */
export function generatePDFPrint(data: PrintableReportData) {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank", "width=1100,height=850");
  if (!printWindow) {
    alert("Please allow popups to generate PDF/Print preview.");
    return;
  }

  const metricsHtml = data.metrics
    .map(
      (m) => `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px 16px;">
      <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">${m.label}</div>
      <div style="font-size:22px; font-weight:800; color:#0f172a; margin-top:4px;">${m.value}</div>
      ${m.subtext ? `<div style="font-size:11px; color:#475569; margin-top:2px;">${m.subtext}</div>` : ""}
    </div>
  `
    )
    .join("");

  const tableHeaderHtml = data.tableHeaders
    .map((h) => `<th style="background:#0f172a; color:#ffffff; font-size:11px; font-weight:700; text-transform:uppercase; padding:10px 12px; text-align:left; border:1px solid #1e293b;">${h}</th>`)
    .join("");

  const tableRowsHtml = data.tableRows
    .map(
      (row, idx) => `
    <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      ${row
        .map(
          (val) => `
        <td style="padding:9px 12px; border:1px solid #e2e8f0; font-size:12px; color:#334155; text-align:${typeof val === "number" ? "right" : "left"}; font-weight:${typeof val === "number" ? "600" : "400"};">
          ${val ?? "-"}
        </td>
      `
        )
        .join("")}
    </tr>
  `
    )
    .join("");

  const contentHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.title} - Monday Hotels Enterprise Report</title>
      <style>
        @page { size: A4 landscape; margin: 15mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background: #ffffff; margin: 0; padding: 24px; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #d97706; padding-bottom: 16px; margin-bottom: 20px; }
        .logo-title { display: flex; align-items: center; gap: 12px; }
        .brand-badge { background: #0f172a; color: #f59e0b; font-weight: 900; padding: 6px 12px; border-radius: 6px; font-size: 14px; letter-spacing: 1px; }
        .title-text h1 { font-size: 20px; margin: 0; color: #0f172a; font-weight: 800; }
        .title-text p { font-size: 12px; color: #64748b; margin: 2px 0 0 0; }
        .meta-info { text-align: right; font-size: 11px; color: #64748b; line-height: 1.5; }
        .metrics-grid { display: grid; grid-template-columns: repeat(${Math.min(data.metrics.length, 4)}, 1fr); gap: 12px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .notes-box { background: #fffbebfb; border: 1px solid #fef3c7; border-left: 4px solid #d97706; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 12px; color: #92400e; }
        .footer { border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 16px; display: flex; justify-content: flex-end; gap: 8px;">
        <button onclick="window.print()" style="background:#d97706; color:#ffffff; font-weight:bold; padding:8px 16px; border:none; border-radius:6px; cursor:pointer;">Print / Save as PDF</button>
        <button onclick="window.close()" style="background:#64748b; color:#ffffff; font-weight:bold; padding:8px 16px; border:none; border-radius:6px; cursor:pointer;">Close</button>
      </div>

      <div class="header-bar">
        <div class="logo-title">
          <div class="brand-badge">MONDAY HOTELS</div>
          <div class="title-text">
            <h1>${data.title}</h1>
            <p>${data.subtitle || "Enterprise Executive Intelligence Report"}</p>
          </div>
        </div>
        <div class="meta-info">
          <div><strong>Date Range:</strong> ${data.dateRange}</div>
          <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
          <div><strong>Generated By:</strong> ${data.generatedBy}</div>
        </div>
      </div>

      ${data.metrics.length > 0 ? `<div class="metrics-grid">${metricsHtml}</div>` : ""}

      ${data.executiveNotes ? `<div class="notes-box"><strong>Executive Commentary:</strong> ${data.executiveNotes}</div>` : ""}

      <table>
        <thead>
          <tr>${tableHeaderHtml}</tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <div class="footer">
        <span>Confidential - Monday Hotels Enterprise CRM Portfolio Analytics</span>
        <span>Page 1 of 1</span>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(contentHtml);
  printWindow.document.close();
}

/**
 * Generate formatted HTML Email Body for automated digest preview
 */
export function generateEmailDigestHTML(
  subscriptionTitle: string,
  frequency: string,
  metrics: ReportMetricSummary[],
  tableHeaders: string[],
  tableRows: (string | number)[][]
): string {
  const metricsCards = metrics
    .map(
      (m) => `
    <td style="padding:10px; width:25%;">
      <div style="background-color:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px; text-align:center;">
        <div style="font-size:10px; text-transform:uppercase; color:#94a3b8; font-weight:bold; letter-spacing:0.5px;">${m.label}</div>
        <div style="font-size:20px; font-weight:bold; color:#f59e0b; margin-top:4px;">${m.value}</div>
        ${m.subtext ? `<div style="font-size:10px; color:#cbd5e1; margin-top:2px;">${m.subtext}</div>` : ""}
      </div>
    </td>
  `
    )
    .join("");

  const rowItemsHtml = tableRows
    .slice(0, 5)
    .map(
      (r, idx) => `
    <tr style="background-color:${idx % 2 === 0 ? "#0f172a" : "#1e293b"};">
      ${r
        .map(
          (c) => `<td style="padding:8px 12px; border-bottom:1px solid #334155; color:#e2e8f0; font-size:12px;">${c ?? "-"}</td>`
        )
        .join("")}
    </tr>
  `
    )
    .join("");

  return `
    <div style="background-color:#020617; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding:24px; color:#f8fafc; max-width:650px; margin:0 auto; border-radius:12px;">
      <!-- Header -->
      <table style="width:100%; border-bottom:2px solid #d97706; padding-bottom:12px; margin-bottom:20px;">
        <tr>
          <td>
            <span style="background-color:#d97706; color:#000; font-weight:bold; padding:4px 8px; border-radius:4px; font-size:11px;">MONDAY HOTELS CRM</span>
            <h2 style="margin:8px 0 0 0; color:#ffffff; font-size:18px;">${subscriptionTitle} (${frequency} Digest)</h2>
          </td>
          <td style="text-align:right; font-size:11px; color:#94a3b8;">
            ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </td>
        </tr>
      </table>

      <!-- Executive Metric Highlights -->
      <div style="margin-bottom:20px;">
        <h3 style="font-size:13px; color:#cbd5e1; text-transform:uppercase; margin-bottom:10px; letter-spacing:0.5px;">Executive Key Performance Highlights</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tr>${metricsCards}</tr>
        </table>
      </div>

      <!-- Quick Data Snapshot Table -->
      <div style="margin-bottom:20px;">
        <h3 style="font-size:13px; color:#cbd5e1; text-transform:uppercase; margin-bottom:10px; letter-spacing:0.5px;">Top Performance Snapshot (First 5 Records)</h3>
        <table style="width:100%; border-collapse:collapse; border:1px solid #334155;">
          <thead>
            <tr style="background-color:#1e293b;">
              ${tableHeaders.map((h) => `<th style="padding:8px 12px; color:#f59e0b; font-size:11px; text-align:left; border-bottom:1px solid #334155;">${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rowItemsHtml}
          </tbody>
        </table>
      </div>

      <!-- Action Footer -->
      <div style="background-color:#0f172a; border:1px solid #334155; border-radius:8px; padding:16px; text-align:center; margin-top:24px;">
        <p style="margin:0 0 12px 0; font-size:12px; color:#94a3b8;">Log into your Monday Hotels Enterprise CRM account for full interactive reports and real-time drilldown.</p>
        <a href="https://mondayhotels-crm.internal/reports" style="background-color:#d97706; color:#000000; text-decoration:none; font-weight:bold; font-size:12px; padding:8px 16px; border-radius:6px; display:inline-block;">Open CRM Executive Dashboard</a>
      </div>

      <div style="text-align:center; font-size:10px; color:#64748b; margin-top:16px;">
        Automated Report Digest System • Monday Hotels Enterprise CRM • Do not reply directly to this email.
      </div>
    </div>
  `;
}

/**
 * Scheduled Email Digest Subscriptions CRUD
 */
export function getScheduledDigests(): EmailDigestSubscription[] {
  if (typeof window === "undefined") return getInitialMockDigests();
  try {
    const raw = localStorage.getItem(DIGEST_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialMockDigests();
      localStorage.setItem(DIGEST_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    return getInitialMockDigests();
  }
}

export function saveScheduledDigest(digest: Omit<EmailDigestSubscription, "id" | "createdAt">): EmailDigestSubscription {
  const current = getScheduledDigests();
  const newDigest: EmailDigestSubscription = {
    ...digest,
    id: "DIGEST-" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newDigest, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(DIGEST_STORAGE_KEY, JSON.stringify(updated));
  }
  return newDigest;
}

export function deleteScheduledDigest(id: string): EmailDigestSubscription[] {
  const current = getScheduledDigests();
  const filtered = current.filter((d) => d.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(DIGEST_STORAGE_KEY, JSON.stringify(filtered));
  }
  return filtered;
}

export function toggleScheduledDigestStatus(id: string): EmailDigestSubscription[] {
  const current = getScheduledDigests();
  const updated: EmailDigestSubscription[] = current.map((d) =>
    d.id === id ? { ...d, status: d.status === "ACTIVE" ? ("PAUSED" as const) : ("ACTIVE" as const) } : d
  );
  if (typeof window !== "undefined") {
    localStorage.setItem(DIGEST_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

function getInitialMockDigests(): EmailDigestSubscription[] {
  const mockData: EmailDigestSubscription[] = [
    {
      id: "DIGEST-WEEKLY-EXEC",
      title: "Weekly Portfolio RevPAR & Pipeline Executive Digest",
      frequency: "WEEKLY",
      recipientEmails: ["executive-board@mondayhotels.com", "gm-delhi@mondayhotels.com"],
      metricsIncluded: ["Net Revenue", "RevPAR", "Pipeline Conversion", "Top Executive Sales"],
      activeTab: "REVENUE",
      status: "ACTIVE",
      lastSentAt: "2026-09-21 09:00:00",
      createdAt: "2026-09-01T08:00:00Z",
    },
    {
      id: "DIGEST-DAILY-LEADS",
      title: "Daily Lead & Reservation Activity Snapshot",
      frequency: "DAILY",
      recipientEmails: ["sales-leads@mondayhotels.com"],
      metricsIncluded: ["Total Leads", "Qualification Rate", "Confirmed Reservations"],
      activeTab: "LEAD_PERFORMANCE",
      status: "ACTIVE",
      lastSentAt: "2026-09-25 08:00:00",
      createdAt: "2026-09-10T10:00:00Z",
    },
  ];
  return mockData;
}
