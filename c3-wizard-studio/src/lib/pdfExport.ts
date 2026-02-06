// PDF Export utilities for C3 forms
// Uses browser print functionality for PDF generation

import type { ContributionResult } from './contributionCalculations';

export interface C3ExportData {
  companyName: string;
  registrationNumber: string;
  month: number;
  year: number;
  scheduleNumber?: number;
  contributions: ContributionResult[];
  totals: {
    totalEmployees: number;
    totalWages: number;
    totalHolidayPay: number;
    totalBonus: number;
    totalSsEmployee: number;
    totalSsEmployer: number;
    totalLevyEmployee: number;
    totalLevyEmployer: number;
    totalPeEmployee: number;
    totalPeEmployer: number;
    grandTotal: number;
  };
  generatedAt: string;
  generatedBy: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'XCD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function generateC3PrintHTML(data: C3ExportData): string {
  const employeeRows = data.contributions.map((c, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${c.ssn}</td>
      <td>${c.firstName} ${c.lastName}</td>
      <td class="amount">${formatCurrency(c.week1Wages)}</td>
      <td class="amount">${formatCurrency(c.week2Wages)}</td>
      <td class="amount">${formatCurrency(c.week3Wages)}</td>
      <td class="amount">${formatCurrency(c.week4Wages)}</td>
      <td class="amount">${formatCurrency(c.week5Wages || 0)}</td>
      <td class="amount">${formatCurrency(c.holidayPay)}</td>
      <td class="amount">${formatCurrency(c.bonus)}</td>
      <td class="amount">${formatCurrency(c.totalWages)}</td>
      <td class="amount">${formatCurrency(c.ssEmployee)}</td>
      <td class="amount">${formatCurrency(c.ssEmployer)}</td>
      <td class="amount">${formatCurrency(c.levyEmployee)}</td>
      <td class="amount">${formatCurrency(c.levyEmployer)}</td>
      <td class="amount">${formatCurrency(c.peEmployee)}</td>
      <td class="amount">${formatCurrency(c.peEmployer)}</td>
      <td class="amount total">${formatCurrency(c.grandTotal)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>C3 Form - ${data.companyName} - ${MONTHS[data.month - 1]} ${data.year}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 10px;
          padding: 20px;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #1a5c4c;
        }
        .header h1 {
          color: #1a5c4c;
          font-size: 18px;
          margin-bottom: 5px;
        }
        .header h2 {
          font-size: 14px;
          color: #333;
        }
        .company-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .company-info div {
          text-align: left;
        }
        .company-info label {
          font-weight: bold;
          color: #666;
        }
        .company-info span {
          display: block;
          font-size: 12px;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          margin-bottom: 20px;
        }
        th {
          background: #1a5c4c;
          color: white;
          padding: 6px 4px;
          text-align: center;
          font-weight: bold;
          border: 1px solid #1a5c4c;
        }
        td {
          padding: 4px;
          border: 1px solid #ddd;
          text-align: center;
        }
        td.amount {
          text-align: right;
          font-family: monospace;
        }
        td.total {
          font-weight: bold;
          background: #f0f0f0;
        }
        .totals-row {
          background: #e8f5e9;
          font-weight: bold;
        }
        .summary {
          margin-top: 20px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .summary h3 {
          color: #1a5c4c;
          margin-bottom: 10px;
          font-size: 12px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        .summary-section h4 {
          font-size: 10px;
          color: #666;
          margin-bottom: 5px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 3px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 2px 0;
        }
        .summary-row.grand-total {
          font-size: 14px;
          font-weight: bold;
          color: #1a5c4c;
          border-top: 2px solid #1a5c4c;
          margin-top: 10px;
          padding-top: 10px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          font-size: 9px;
          color: #666;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          body {
            padding: 10px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ST. KITTS AND NEVIS SOCIAL SECURITY BOARD</h1>
        <h2>C3 Contribution Return Form</h2>
      </div>

      <div class="company-info">
        <div>
          <label>Employer Name:</label>
          <span>${data.companyName}</span>
        </div>
        <div>
          <label>Registration No:</label>
          <span>${data.registrationNumber}</span>
        </div>
        <div>
          <label>Period:</label>
          <span>${MONTHS[data.month - 1]} ${data.year}</span>
        </div>
        <div>
          <label>Schedule No:</label>
          <span>${data.scheduleNumber || 'N/A'}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>SSN</th>
            <th>Employee Name</th>
            <th>Week 1</th>
            <th>Week 2</th>
            <th>Week 3</th>
            <th>Week 4</th>
            <th>Week 5</th>
            <th>Holiday</th>
            <th>Bonus</th>
            <th>Total Wages</th>
            <th>SS (Ee)</th>
            <th>SS (Er)</th>
            <th>Levy (Ee)</th>
            <th>Levy (Er)</th>
            <th>PE (Ee)</th>
            <th>PE (Er)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${employeeRows}
          <tr class="totals-row">
            <td colspan="10" style="text-align: right; font-weight: bold;">TOTALS:</td>
            <td class="amount">${formatCurrency(data.totals.totalWages)}</td>
            <td class="amount">${formatCurrency(data.totals.totalSsEmployee)}</td>
            <td class="amount">${formatCurrency(data.totals.totalSsEmployer)}</td>
            <td class="amount">${formatCurrency(data.totals.totalLevyEmployee)}</td>
            <td class="amount">${formatCurrency(data.totals.totalLevyEmployer)}</td>
            <td class="amount">${formatCurrency(data.totals.totalPeEmployee)}</td>
            <td class="amount">${formatCurrency(data.totals.totalPeEmployer)}</td>
            <td class="amount total">${formatCurrency(data.totals.grandTotal)}</td>
          </tr>
        </tbody>
      </table>

      <div class="summary">
        <h3>CONTRIBUTION SUMMARY</h3>
        <div class="summary-grid">
          <div class="summary-section">
            <h4>Wages</h4>
            <div class="summary-row">
              <span>Total Wages:</span>
              <span>${formatCurrency(data.totals.totalWages)}</span>
            </div>
            <div class="summary-row">
              <span>Holiday Pay:</span>
              <span>${formatCurrency(data.totals.totalHolidayPay)}</span>
            </div>
            <div class="summary-row">
              <span>Bonus:</span>
              <span>${formatCurrency(data.totals.totalBonus)}</span>
            </div>
          </div>
          <div class="summary-section">
            <h4>Employee Contributions</h4>
            <div class="summary-row">
              <span>Social Security:</span>
              <span>${formatCurrency(data.totals.totalSsEmployee)}</span>
            </div>
            <div class="summary-row">
              <span>Levy:</span>
              <span>${formatCurrency(data.totals.totalLevyEmployee)}</span>
            </div>
            <div class="summary-row">
              <span>Severance/PE:</span>
              <span>${formatCurrency(data.totals.totalPeEmployee)}</span>
            </div>
          </div>
          <div class="summary-section">
            <h4>Employer Contributions</h4>
            <div class="summary-row">
              <span>Social Security:</span>
              <span>${formatCurrency(data.totals.totalSsEmployer)}</span>
            </div>
            <div class="summary-row">
              <span>Levy:</span>
              <span>${formatCurrency(data.totals.totalLevyEmployer)}</span>
            </div>
            <div class="summary-row">
              <span>Severance/PE:</span>
              <span>${formatCurrency(data.totals.totalPeEmployer)}</span>
            </div>
          </div>
        </div>
        <div class="summary-row grand-total">
          <span>GRAND TOTAL:</span>
          <span>${formatCurrency(data.totals.grandTotal)}</span>
        </div>
      </div>

      <div class="footer">
        <div>Generated: ${data.generatedAt}</div>
        <div>Generated By: ${data.generatedBy}</div>
        <div>C3 Wizard - St. Kitts and Nevis Social Security</div>
      </div>
    </body>
    </html>
  `;
}

export function exportC3ToPDF(data: C3ExportData): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to export the C3 form');
    return;
  }
  
  const html = generateC3PrintHTML(data);
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print();
  };
}

export function exportC3ToExcel(data: C3ExportData): void {
  // Generate CSV content
  const headers = [
    'SSN', 'First Name', 'Last Name',
    'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5',
    'Holiday Pay', 'Bonus', 'Total Wages',
    'SS Employee', 'SS Employer', 'Levy Employee', 'Levy Employer',
    'PE Employee', 'PE Employer', 'Grand Total'
  ];

  const rows = data.contributions.map(c => [
    c.ssn,
    c.firstName,
    c.lastName,
    c.week1Wages,
    c.week2Wages,
    c.week3Wages,
    c.week4Wages,
    c.week5Wages || 0,
    c.holidayPay,
    c.bonus,
    c.totalWages,
    c.ssEmployee,
    c.ssEmployer,
    c.levyEmployee,
    c.levyEmployer,
    c.peEmployee,
    c.peEmployer,
    c.grandTotal
  ]);

  // Add totals row
  rows.push([
    '', 'TOTALS', '',
    '', '', '', '', '',
    data.totals.totalHolidayPay,
    data.totals.totalBonus,
    data.totals.totalWages,
    data.totals.totalSsEmployee,
    data.totals.totalSsEmployer,
    data.totals.totalLevyEmployee,
    data.totals.totalLevyEmployer,
    data.totals.totalPeEmployee,
    data.totals.totalPeEmployer,
    data.totals.grandTotal
  ]);

  const csvContent = [
    // Header info
    `C3 Contribution Report`,
    `Company: ${data.companyName}`,
    `Registration: ${data.registrationNumber}`,
    `Period: ${MONTHS[data.month - 1]} ${data.year}`,
    `Generated: ${data.generatedAt}`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `C3_${data.companyName}_${MONTHS[data.month - 1]}_${data.year}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Payment Receipt interfaces and functions
export interface PaymentReceiptData {
  receiptNumber: string;
  transactionId: string;
  transactionDate: string;
  payerName: string;
  paymentAmount: number;
  ssContribution: number;
  levyContribution: number;
  peContribution: number;
  penalties: number;
  paymentMethod: string;
}

function formatReceiptDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatReceiptCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Export payment receipt as PDF using browser print
 */
export function exportPaymentReceiptPDF(data: PaymentReceiptData): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to download the receipt');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Receipt - ${data.receiptNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        .header {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0 0;
          font-size: 14px;
        }
        .content {
          border: 1px solid #e5e7eb;
          border-top: none;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .receipt-info {
          background: #f9fafb;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .receipt-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .receipt-info-item label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .receipt-info-item span {
          font-weight: bold;
          color: #111827;
        }
        .breakdown {
          margin-bottom: 20px;
        }
        .breakdown h3 {
          font-size: 16px;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }
        .breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .breakdown-item:last-child {
          border-bottom: none;
        }
        .breakdown-item label {
          color: #4b5563;
        }
        .breakdown-item span {
          font-weight: 500;
        }
        .total {
          display: flex;
          justify-content: space-between;
          padding: 20px;
          background: #f0fdf4;
          border-radius: 6px;
          margin-top: 20px;
          border: 2px solid #10b981;
        }
        .total label {
          font-size: 18px;
          font-weight: bold;
          color: #111827;
        }
        .total span {
          font-size: 24px;
          font-weight: bold;
          color: #10b981;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #9ca3af;
          font-size: 12px;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>PAYMENT RECEIPT</h1>
        <p>Social Security Board - St. Kitts and Nevis</p>
      </div>
      
      <div class="content">
        <div class="receipt-info">
          <div class="receipt-info-grid">
            <div class="receipt-info-item">
              <label>Receipt Number</label>
              <span>${data.receiptNumber}</span>
            </div>
            <div class="receipt-info-item">
              <label>Transaction ID</label>
              <span>${data.transactionId || 'N/A'}</span>
            </div>
            <div class="receipt-info-item">
              <label>Date</label>
              <span>${formatReceiptDate(data.transactionDate)}</span>
            </div>
            <div class="receipt-info-item">
              <label>Payment Method</label>
              <span>${data.paymentMethod}</span>
            </div>
            <div class="receipt-info-item" style="grid-column: span 2;">
              <label>Payer</label>
              <span>${data.payerName}</span>
            </div>
          </div>
        </div>
        
        <div class="breakdown">
          <h3>Payment Breakdown</h3>
          <div class="breakdown-item">
            <label>Social Security Contribution</label>
            <span>${formatReceiptCurrency(data.ssContribution)}</span>
          </div>
          <div class="breakdown-item">
            <label>Levy Contribution</label>
            <span>${formatReceiptCurrency(data.levyContribution)}</span>
          </div>
          <div class="breakdown-item">
            <label>PE/EI Contribution</label>
            <span>${formatReceiptCurrency(data.peContribution)}</span>
          </div>
          <div class="breakdown-item">
            <label>Penalties/Fines</label>
            <span>${formatReceiptCurrency(data.penalties)}</span>
          </div>
        </div>
        
        <div class="total">
          <label>TOTAL AMOUNT PAID</label>
          <span>${formatReceiptCurrency(data.paymentAmount)}</span>
        </div>
      </div>
      
      <div class="footer">
        <p>This is a computer-generated receipt and does not require a signature.</p>
        <p>For inquiries, contact info@ssb.kn or call +1 (869) 465-2535</p>
        <p>Generated by C3 Wizard on ${new Date().toLocaleString()}</p>
      </div>
      
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
}
