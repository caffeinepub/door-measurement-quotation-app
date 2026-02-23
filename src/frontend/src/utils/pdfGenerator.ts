import type { DoorEntry } from "../backend";
import { decimalToFractionDisplay } from "./fractionParser";
import { SINGLE_COATING_RATE, DOUBLE_COATING_RATE, DOUBLE_SAGWAN_RATE, LAMINATE_RATE } from "./coatingRates";

interface DoorGroup {
  heightEntered: number;
  widthEntered: number;
  heightRounded: number;
  widthRounded: number;
  squareFeet: number;
}

export function generateQuotationHTML(
  entries: DoorEntry[],
  customerName: string,
  customerMobile: string
): string {
  // Group entries by size (heightRounded x widthRounded)
  const groupedMap = new Map<string, DoorGroup>();

  entries.forEach((entry) => {
    const key = `${entry.heightRounded}x${entry.widthRounded}`;

    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        heightEntered: entry.heightEntered,
        widthEntered: entry.widthEntered,
        heightRounded: Number(entry.heightRounded),
        widthRounded: Number(entry.widthRounded),
        squareFeet: entry.squareFeet,
      });
    }
  });

  // Calculate coating type totals - ALL coating types for ALL doors
  let singleCoatingTotal = 0;
  let doubleCoatingTotal = 0;
  let doubleSagwanTotal = 0;
  let laminateTotal = 0;

  Array.from(groupedMap.values()).forEach((group) => {
    singleCoatingTotal += group.squareFeet * SINGLE_COATING_RATE;
    doubleCoatingTotal += group.squareFeet * DOUBLE_COATING_RATE;
    doubleSagwanTotal += group.squareFeet * DOUBLE_SAGWAN_RATE;
    laminateTotal += group.squareFeet * LAMINATE_RATE;
  });

  // Generate table rows - calculate ALL coating types for each door
  const tableRows = Array.from(groupedMap.values())
    .map((group) => {
      const heightDisplay = decimalToFractionDisplay(group.heightEntered);
      const widthDisplay = decimalToFractionDisplay(group.widthEntered);

      // Calculate all coating amounts for this door
      const singleAmount = Math.round(group.squareFeet * SINGLE_COATING_RATE);
      const doubleAmount = Math.round(group.squareFeet * DOUBLE_COATING_RATE);
      const doubleSagwanAmount = Math.round(group.squareFeet * DOUBLE_SAGWAN_RATE);
      const laminateAmount = Math.round(group.squareFeet * LAMINATE_RATE);

      return `
        <tr>
          <td>${heightDisplay}" × ${widthDisplay}"</td>
          <td>${group.squareFeet.toFixed(2)}</td>
          <td>₹${singleAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>₹${doubleAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>₹${doubleSagwanAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>₹${laminateAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      `;
    })
    .join("");

  // Calculate totals for the footer row
  const totalSquareFeet = Array.from(groupedMap.values()).reduce(
    (sum, group) => sum + group.squareFeet,
    0
  );

  // Generate coating type summary - ALWAYS show all coating types
  const coatingSummary = `
    <div class="summary-item">
      <span class="summary-label">Single Coating (@ ₹${SINGLE_COATING_RATE.toFixed(2)}/sq.ft):</span>
      <span class="summary-amount">₹${Math.round(singleCoatingTotal).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Double Coating (@ ₹${DOUBLE_COATING_RATE.toFixed(2)}/sq.ft):</span>
      <span class="summary-amount">₹${Math.round(doubleCoatingTotal).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Double Coating + Sagwan Patti (@ ₹${DOUBLE_SAGWAN_RATE.toFixed(2)}/sq.ft):</span>
      <span class="summary-amount">₹${Math.round(doubleSagwanTotal).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Laminate (@ ₹${LAMINATE_RATE.toFixed(2)}/sq.ft):</span>
      <span class="summary-amount">₹${Math.round(laminateTotal).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
  `;

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
      <title>Door Quotation</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @page {
          size: A4;
          margin: 10mm;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #1a1a1a;
          background: white;
          padding: 12px;
          font-size: 14px;
        }

        .container {
          max-width: 100%;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #2c1810;
        }

        h1 {
          font-size: 22px;
          color: #2c1810;
          margin-bottom: 6px;
          font-weight: 700;
        }

        .date {
          font-size: 12px;
          color: #666;
        }

        .customer-info {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 13px;
        }

        .customer-info p {
          margin: 4px 0;
        }

        .customer-info strong {
          color: #2c1810;
          font-weight: 600;
        }

        .table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin-bottom: 16px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          min-width: 600px;
        }

        th, td {
          padding: 8px 6px;
          text-align: left;
          border: 1px solid #ddd;
        }

        th {
          background: #2c1810;
          color: white;
          font-weight: 600;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        td {
          background: white;
        }

        tr:nth-child(even) td {
          background: #f9f9f9;
        }

        .total-row {
          font-weight: 700;
          background: #f0e6d2 !important;
        }

        .total-row td {
          background: #f0e6d2 !important;
          border-top: 2px solid #2c1810;
        }

        .coating-summary {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
        }

        .coating-summary h2 {
          font-size: 16px;
          color: #2c1810;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .summary-divider {
          height: 1px;
          background: #ddd;
          margin: 8px 0 10px 0;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 13px;
        }

        .summary-label {
          color: #333;
          font-weight: 500;
        }

        .summary-amount {
          color: #2c1810;
          font-weight: 700;
        }

        .note {
          background: #fff9e6;
          border-left: 3px solid #f59e0b;
          padding: 10px;
          margin-bottom: 16px;
          font-size: 11px;
          line-height: 1.5;
        }

        .note strong {
          color: #92400e;
          display: block;
          margin-bottom: 4px;
        }

        .footer {
          text-align: center;
          padding-top: 16px;
          border-top: 1px solid #ddd;
          font-size: 11px;
          color: #666;
        }

        .footer p {
          margin: 4px 0;
        }

        @media print {
          body {
            padding: 0;
            font-size: 12px;
          }

          .container {
            max-width: 100%;
          }

          table {
            font-size: 10px;
            min-width: auto;
          }

          th, td {
            padding: 6px 4px;
          }

          .note {
            font-size: 10px;
          }

          @page {
            margin: 8mm;
          }
        }

        @media (max-width: 640px) {
          body {
            font-size: 13px;
            padding: 8px;
          }

          h1 {
            font-size: 20px;
          }

          .customer-info {
            font-size: 12px;
            padding: 10px;
          }

          table {
            font-size: 10px;
          }

          th {
            font-size: 9px;
            padding: 6px 4px;
          }

          td {
            padding: 6px 4px;
          }

          .coating-summary h2 {
            font-size: 14px;
          }

          .summary-item {
            font-size: 12px;
          }

          .note {
            font-size: 10px;
            padding: 8px;
          }

          .footer {
            font-size: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Door Quotation</h1>
          <p class="date">Date: ${currentDate}</p>
        </div>

        <div class="customer-info">
          <p><strong>Customer Name:</strong> ${customerName}</p>
          <p><strong>Mobile:</strong> ${customerMobile}</p>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Door Size</th>
                <th>Sq.Ft</th>
                <th>Single Coating</th>
                <th>Double Coating</th>
                <th>Double + Sagwan</th>
                <th>Laminate</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              <tr class="total-row">
                <td><strong>Total</strong></td>
                <td><strong>${totalSquareFeet.toFixed(2)}</strong></td>
                <td><strong>₹${Math.round(singleCoatingTotal).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                <td><strong>₹${Math.round(doubleCoatingTotal).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                <td><strong>₹${Math.round(doubleSagwanTotal).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                <td><strong>₹${Math.round(laminateTotal).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="coating-summary">
          <h2>Coating Type Summary</h2>
          <div class="summary-divider"></div>
          ${coatingSummary}
        </div>

        <div class="note">
          <strong>Note:</strong> Calculations are done as per standard carpenter rules. Entered sizes are shown for reference.
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Generated by Door Quotation System</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
