import type { DoorEntry } from '../backend';
import { CoatingType } from '../backend';
import { SINGLE_COATING_RATE, DOUBLE_COATING_RATE, DOUBLE_SAGWAN_RATE, LAMINATE_RATE } from './coatingRates';
import { decimalToFractionDisplay } from './fractionParser';

interface GroupedDoor {
  heightEntered: number;
  widthEntered: number;
  squareFeet: number;
}

interface QuotationData {
  customerName: string;
  customerMobile: string;
  entries: DoorEntry[];
  totals: {
    singleCoating: number;
    doubleCoating: number;
    doubleSagwan: number;
    laminate: number;
    grandTotal: number;
  };
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN');
}

function calculateCoatingAmount(squareFeet: number, rate: number): number {
  return Math.round(squareFeet * rate);
}

function groupDoorsBySize(entries: DoorEntry[]): GroupedDoor[] {
  const groups = new Map<string, GroupedDoor>();

  for (const entry of entries) {
    const key = `${entry.heightEntered}-${entry.widthEntered}`;
    
    if (!groups.has(key)) {
      groups.set(key, {
        heightEntered: entry.heightEntered,
        widthEntered: entry.widthEntered,
        squareFeet: entry.squareFeet,
      });
    }
  }

  return Array.from(groups.values());
}

export async function generateQuotationPDF(data: QuotationData): Promise<Blob> {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const groupedDoors = groupDoorsBySize(data.entries);

  const singleCoatingAmount = Math.round(data.totals.singleCoating * SINGLE_COATING_RATE);
  const doubleCoatingAmount = Math.round(data.totals.doubleCoating * DOUBLE_COATING_RATE);
  const doubleSagwanAmount = Math.round(data.totals.doubleSagwan * DOUBLE_SAGWAN_RATE);
  const laminateAmount = Math.round(data.totals.laminate * LAMINATE_RATE);

  // Generate HTML content for the quotation
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Door Quotation</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          background: white;
          color: #333;
        }
        
        .header {
          background: #45342a;
          color: white;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
          border-radius: 8px;
        }
        
        .header h1 {
          font-size: 32px;
          margin-bottom: 8px;
        }
        
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .date {
          text-align: right;
          margin-bottom: 20px;
          font-size: 14px;
          color: #666;
        }
        
        .customer-info {
          background: #f5f0eb;
          padding: 20px;
          margin-bottom: 30px;
          border-radius: 8px;
          border-left: 4px solid #45342a;
        }
        
        .customer-info h2 {
          font-size: 18px;
          margin-bottom: 12px;
          color: #45342a;
        }
        
        .customer-info p {
          font-size: 14px;
          margin-bottom: 6px;
        }
        
        .section-title {
          font-size: 20px;
          margin-bottom: 15px;
          color: #45342a;
          border-bottom: 2px solid #45342a;
          padding-bottom: 8px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        
        thead {
          background: #45342a;
          color: white;
        }
        
        th, td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }
        
        th {
          font-weight: bold;
          font-size: 11px;
        }
        
        td {
          font-size: 12px;
        }
        
        .text-right {
          text-align: right;
        }
        
        tbody tr:nth-child(even) {
          background: #f9f9f9;
        }
        
        tbody tr:hover {
          background: #f5f0eb;
        }
        
        .amount-cell {
          font-weight: bold;
          color: #45342a;
        }
        
        .totals {
          background: #f5f0eb;
          padding: 25px;
          border-radius: 8px;
          border: 2px solid #45342a;
        }
        
        .totals h2 {
          font-size: 20px;
          margin-bottom: 15px;
          color: #45342a;
        }
        
        .total-sqft {
          font-size: 18px;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 6px;
          border-left: 4px solid #45342a;
        }
        
        .total-sqft strong {
          color: #45342a;
        }
        
        .coating-totals {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .coating-total-item {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #45342a;
        }
        
        .coating-total-item .label {
          font-size: 12px;
          color: #666;
          margin-bottom: 6px;
          text-transform: uppercase;
          font-weight: bold;
        }
        
        .coating-total-item .amount {
          font-size: 18px;
          font-weight: bold;
          color: #45342a;
        }
        
        .note {
          margin-top: 30px;
          padding: 15px;
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          border-radius: 6px;
          font-size: 13px;
          color: #856404;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .header {
            break-inside: avoid;
          }
          
          table {
            break-inside: avoid;
          }
          
          .totals {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Door Measurement & Quotation</h1>
        <p>Professional Door Coating Services</p>
      </div>
      
      <div class="date">
        <strong>Date:</strong> ${currentDate}
      </div>
      
      <div class="customer-info">
        <h2>Customer Information</h2>
        <p><strong>Name:</strong> ${data.customerName}</p>
        <p><strong>Mobile:</strong> ${data.customerMobile}</p>
      </div>
      
      <h2 class="section-title">Door Details</h2>
      
      <table>
        <thead>
          <tr>
            <th style="width: 60px;">Sr No</th>
            <th>Size (Actual)</th>
            <th class="text-right">Single Coating</th>
            <th class="text-right">Double Coating</th>
            <th class="text-right">Double + Sagwan</th>
            <th class="text-right">Laminate</th>
            <th class="text-right">Sq.Ft</th>
          </tr>
        </thead>
        <tbody>
          ${groupedDoors
            .map(
              (door, index) => {
                const heightDisplay = decimalToFractionDisplay(door.heightEntered);
                const widthDisplay = decimalToFractionDisplay(door.widthEntered);
                return `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${heightDisplay} × ${widthDisplay}"</strong></td>
              <td class="text-right amount-cell">₹${formatCurrency(calculateCoatingAmount(door.squareFeet, SINGLE_COATING_RATE))}</td>
              <td class="text-right amount-cell">₹${formatCurrency(calculateCoatingAmount(door.squareFeet, DOUBLE_COATING_RATE))}</td>
              <td class="text-right amount-cell">₹${formatCurrency(calculateCoatingAmount(door.squareFeet, DOUBLE_SAGWAN_RATE))}</td>
              <td class="text-right amount-cell">₹${formatCurrency(calculateCoatingAmount(door.squareFeet, LAMINATE_RATE))}</td>
              <td class="text-right"><strong>${door.squareFeet.toFixed(2)}</strong></td>
            </tr>
          `;
              }
            )
            .join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <h2>Summary</h2>
        
        <div class="total-sqft">
          <strong>Total Square Feet:</strong> ${data.totals.grandTotal.toFixed(2)} sq.ft
        </div>
        
        <div class="coating-totals">
          ${
            data.totals.singleCoating > 0
              ? `
          <div class="coating-total-item">
            <div class="label">Total Single Coating</div>
            <div class="amount">₹${formatCurrency(singleCoatingAmount)}</div>
          </div>
          `
              : ''
          }
          
          ${
            data.totals.doubleCoating > 0
              ? `
          <div class="coating-total-item">
            <div class="label">Total Double Coating</div>
            <div class="amount">₹${formatCurrency(doubleCoatingAmount)}</div>
          </div>
          `
              : ''
          }
          
          ${
            data.totals.doubleSagwan > 0
              ? `
          <div class="coating-total-item">
            <div class="label">Total Double + Sagwan</div>
            <div class="amount">₹${formatCurrency(doubleSagwanAmount)}</div>
          </div>
          `
              : ''
          }
          
          ${
            data.totals.laminate > 0
              ? `
          <div class="coating-total-item">
            <div class="label">Total Laminate</div>
            <div class="amount">₹${formatCurrency(laminateAmount)}</div>
          </div>
          `
              : ''
          }
        </div>
      </div>
      
      <div class="note">
        <strong>Note:</strong> Calculation done as per standard rounded size, display shows actual size.
      </div>
      
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>For any queries, please contact us.</p>
      </div>
    </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Failed to open print window. Please allow pop-ups.');
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load
  await new Promise((resolve) => {
    printWindow.onload = resolve;
    setTimeout(resolve, 500);
  });

  // Trigger print dialog
  printWindow.print();

  // Convert HTML to blob for sharing
  const blob = new Blob([htmlContent], { type: 'text/html' });
  return blob;
}
