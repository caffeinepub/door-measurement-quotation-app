import type { DoorType } from '../backend';

interface QuotationData {
  customerName: string;
  customerMobile: string;
  types: DoorType[];
  totalSquareFeet: number;
  coatingAmounts: {
    singleCoatingAmount: number;
    doubleCoatingAmount: number;
    doubleSagwanAmount: number;
    laminateAmount: number;
  };
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN');
}

function calculateCoatingAmount(squareFeet: number, rate: number): number {
  return squareFeet * rate;
}

export async function generateQuotationPDF(data: QuotationData): Promise<Blob> {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
          font-size: 12px;
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
        
        .dash-cell {
          color: #999;
          text-align: center;
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
          font-size: 16px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #45342a;
        }
        
        .total-sqft strong {
          color: #45342a;
        }
        
        .coating-totals {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .coating-total-item {
          font-size: 14px;
        }
        
        .coating-total-item strong {
          color: #45342a;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }

        .note {
          margin-top: 20px;
          padding: 15px;
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          border-radius: 4px;
          font-size: 13px;
          color: #856404;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Door Quotation Pro</h1>
        <p>Coating & Laminate Edition</p>
      </div>
      
      <div class="date">
        <strong>Date:</strong> ${currentDate}
      </div>
      
      ${
        data.customerName || data.customerMobile
          ? `
      <div class="customer-info">
        <h2>Customer Information</h2>
        ${data.customerName ? `<p><strong>Name:</strong> ${data.customerName}</p>` : ''}
        ${data.customerMobile ? `<p><strong>Mobile:</strong> ${data.customerMobile}</p>` : ''}
      </div>
      `
          : ''
      }
      
      <h2 class="section-title">Door Entries</h2>
      
      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Size</th>
            <th class="text-right">Single Coating</th>
            <th class="text-right">Double Coating</th>
            <th class="text-right">Double Coating + Sagwan Patti</th>
            <th class="text-right">Laminate</th>
            <th class="text-right">Sq.Ft</th>
          </tr>
        </thead>
        <tbody>
          ${data.types
            .map(
              (type, index) => `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${type.enteredHeight} × ${type.enteredWidth}"</strong></td>
              <td class="${type.coatings.singleCoating ? 'amount-cell text-right' : 'dash-cell'}">
                ${type.coatings.singleCoating ? `₹${formatCurrency(calculateCoatingAmount(type.squareFeet, 165))}` : '—'}
              </td>
              <td class="${type.coatings.doubleCoating ? 'amount-cell text-right' : 'dash-cell'}">
                ${type.coatings.doubleCoating ? `₹${formatCurrency(calculateCoatingAmount(type.squareFeet, 185))}` : '—'}
              </td>
              <td class="${type.coatings.doubleSagwan ? 'amount-cell text-right' : 'dash-cell'}">
                ${type.coatings.doubleSagwan ? `₹${formatCurrency(calculateCoatingAmount(type.squareFeet, 210))}` : '—'}
              </td>
              <td class="${type.coatings.laminate ? 'amount-cell text-right' : 'dash-cell'}">
                ${type.coatings.laminate ? `₹${formatCurrency(calculateCoatingAmount(type.squareFeet, 240))}` : '—'}
              </td>
              <td class="text-right"><strong>${type.squareFeet.toFixed(2)}</strong></td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <h2>Totals</h2>
        <div class="total-sqft">
          <strong>Total Square Feet:</strong> ${data.totalSquareFeet.toFixed(2)} sq.ft
        </div>
        <div class="coating-totals">
          ${
            data.coatingAmounts.singleCoatingAmount > 0
              ? `
          <div class="coating-total-item">
            <strong>Single Coating Total:</strong> ₹${formatCurrency(data.coatingAmounts.singleCoatingAmount)}
          </div>
          `
              : ''
          }
          ${
            data.coatingAmounts.doubleCoatingAmount > 0
              ? `
          <div class="coating-total-item">
            <strong>Double Coating Total:</strong> ₹${formatCurrency(data.coatingAmounts.doubleCoatingAmount)}
          </div>
          `
              : ''
          }
          ${
            data.coatingAmounts.doubleSagwanAmount > 0
              ? `
          <div class="coating-total-item">
            <strong>Double Coating + Sagwan Patti Total:</strong> ₹${formatCurrency(data.coatingAmounts.doubleSagwanAmount)}
          </div>
          `
              : ''
          }
          ${
            data.coatingAmounts.laminateAmount > 0
              ? `
          <div class="coating-total-item">
            <strong>Laminate Total:</strong> ₹${formatCurrency(data.coatingAmounts.laminateAmount)}
          </div>
          `
              : ''
          }
        </div>
      </div>

      <div class="note">
        <strong>Note:</strong> Quotation generated based on actual size.
      </div>
      
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Generated by Door Quotation Pro - Coating & Laminate Edition</p>
      </div>
    </body>
    </html>
  `;

  // Create a blob from the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  
  // Open the HTML in a new window for printing
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  
  if (printWindow) {
    printWindow.onload = () => {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  }

  return blob;
}
