import { DoorEntry } from "../backend";
import { decimalToFractionDisplay } from "./fractionParser";
import { SINGLE_COATING_RATE, DOUBLE_COATING_RATE, DOUBLE_SAGWAN_RATE, LAMINATE_RATE } from "./coatingRates";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getCoatingLabel(coatingType: string): string {
  switch (coatingType) {
    case "single":
      return "Single Coating";
    case "double":
      return "Double Coating";
    case "doubleSagwan":
      return "Double Coating + Sagwan Patti";
    case "laminate":
      return "Laminate";
    default:
      return coatingType;
  }
}

function getCoatingRate(coatingType: string): number {
  switch (coatingType) {
    case "single":
      return SINGLE_COATING_RATE;
    case "double":
      return DOUBLE_COATING_RATE;
    case "doubleSagwan":
      return DOUBLE_SAGWAN_RATE;
    case "laminate":
      return LAMINATE_RATE;
    default:
      return 0;
  }
}

interface GroupedEntry {
  heightEntered: number;
  widthEntered: number;
  heightRounded: bigint;
  widthRounded: bigint;
  squareFeet: number;
  entries: {
    coatingType: string;
    amount: number;
  }[];
}

export function generateQuotationHTML(
  doorEntries: DoorEntry[],
  customerName: string,
  customerMobile: string
): string {
  // Group entries by size
  const groupedMap = new Map<string, GroupedEntry>();

  doorEntries.forEach((entry) => {
    const key = `${entry.heightEntered}-${entry.widthEntered}`;
    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        heightEntered: entry.heightEntered,
        widthEntered: entry.widthEntered,
        heightRounded: entry.heightRounded,
        widthRounded: entry.widthRounded,
        squareFeet: entry.squareFeet,
        entries: [],
      });
    }

    const group = groupedMap.get(key)!;
    const rate = getCoatingRate(entry.coatingType);
    const amount = entry.squareFeet * rate;

    group.entries.push({
      coatingType: entry.coatingType,
      amount,
    });
  });

  const grouped = Array.from(groupedMap.values());

  // Calculate totals
  const totals = {
    squareFeet: 0,
    single: 0,
    double: 0,
    doubleSagwan: 0,
    laminate: 0,
  };

  grouped.forEach((group) => {
    totals.squareFeet += group.squareFeet;
    group.entries.forEach((entry) => {
      switch (entry.coatingType) {
        case "single":
          totals.single += entry.amount;
          break;
        case "double":
          totals.double += entry.amount;
          break;
        case "doubleSagwan":
          totals.doubleSagwan += entry.amount;
          break;
        case "laminate":
          totals.laminate += entry.amount;
          break;
      }
    });
  });

  // Generate table rows
  const tableRows = grouped
    .map((group) => {
      const heightDisplay = decimalToFractionDisplay(group.heightEntered);
      const widthDisplay = decimalToFractionDisplay(group.widthEntered);

      const singleEntry = group.entries.find((e) => e.coatingType === "single");
      const doubleEntry = group.entries.find((e) => e.coatingType === "double");
      const doubleSagwanEntry = group.entries.find(
        (e) => e.coatingType === "doubleSagwan"
      );
      const laminateEntry = group.entries.find(
        (e) => e.coatingType === "laminate"
      );

      return `
        <tr>
          <td>${heightDisplay}" × ${widthDisplay}"</td>
          <td class="center">${group.squareFeet.toFixed(2)}</td>
          <td class="right">${
            singleEntry ? formatCurrency(singleEntry.amount) : "-"
          }</td>
          <td class="right">${
            doubleEntry ? formatCurrency(doubleEntry.amount) : "-"
          }</td>
          <td class="right">${
            doubleSagwanEntry ? formatCurrency(doubleSagwanEntry.amount) : "-"
          }</td>
          <td class="right">${
            laminateEntry ? formatCurrency(laminateEntry.amount) : "-"
          }</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Door Quotation - ${customerName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          padding: 10px;
          font-size: 11px;
          line-height: 1.4;
        }
        
        @media screen and (min-width: 640px) {
          body {
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
            font-size: 14px;
          }
        }
        
        @media print {
          body { 
            margin: 0;
            padding: 10px;
            font-size: 10px;
          }
          @page { 
            margin: 0.5cm;
            size: A4;
          }
          .no-print {
            display: none !important;
          }
        }
        
        .header {
          text-align: center;
          margin-bottom: 15px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        
        .header h1 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 1.5em;
        }
        
        .header p {
          font-size: 0.9em;
        }
        
        .customer-info {
          margin-bottom: 15px;
          background: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
        }
        
        .customer-info p {
          margin: 3px 0;
          font-size: 1em;
        }
        
        .table-container {
          overflow-x: auto;
          margin-bottom: 15px;
          -webkit-overflow-scrolling: touch;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 100%;
          font-size: 0.85em;
        }
        
        @media screen and (min-width: 640px) {
          table {
            font-size: 1em;
          }
        }
        
        th {
          background-color: #333;
          color: white;
          padding: 6px 4px;
          text-align: left;
          border: 1px solid #ddd;
          font-size: 0.9em;
          white-space: nowrap;
        }
        
        @media screen and (min-width: 640px) {
          th {
            padding: 12px 8px;
            font-size: 1em;
          }
        }
        
        td {
          padding: 6px 4px;
          border: 1px solid #ddd;
          font-size: 0.9em;
        }
        
        @media screen and (min-width: 640px) {
          td {
            padding: 10px 8px;
            font-size: 1em;
          }
        }
        
        th.center, td.center {
          text-align: center;
        }
        
        th.right, td.right {
          text-align: right;
        }
        
        tfoot td {
          font-weight: bold;
          background-color: #f0f0f0;
          padding: 8px 4px;
          border: 1px solid #ddd;
        }
        
        @media screen and (min-width: 640px) {
          tfoot td {
            padding: 12px 8px;
          }
        }
        
        .summary {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 5px;
          margin-bottom: 15px;
        }
        
        @media screen and (min-width: 640px) {
          .summary {
            padding: 20px;
          }
        }
        
        .summary h3 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #333;
          font-size: 1.2em;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #ddd;
          font-size: 0.95em;
        }
        
        @media screen and (min-width: 640px) {
          .summary-item {
            padding: 8px 0;
            font-size: 1em;
          }
        }
        
        .summary-item:last-child {
          border-bottom: none;
          font-weight: bold;
          font-size: 1.05em;
          margin-top: 8px;
          padding-top: 12px;
          border-top: 2px solid #333;
        }
        
        .note {
          margin-top: 15px;
          padding: 10px;
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          font-size: 0.85em;
          line-height: 1.5;
        }
        
        @media screen and (min-width: 640px) {
          .note {
            margin-top: 30px;
            padding: 15px;
            font-size: 0.9em;
          }
        }
        
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 0.8em;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        
        @media screen and (min-width: 640px) {
          .footer {
            margin-top: 40px;
            font-size: 0.85em;
            padding-top: 20px;
          }
        }
        
        @media print {
          .header h1 {
            font-size: 18px;
          }
          table {
            font-size: 9px;
          }
          th, td {
            padding: 4px 2px;
          }
          .summary {
            padding: 8px;
          }
          .summary h3 {
            font-size: 12px;
          }
          .summary-item {
            font-size: 9px;
            padding: 4px 0;
          }
          .note {
            padding: 6px;
            font-size: 8px;
          }
          .footer {
            font-size: 8px;
            margin-top: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Door Quotation</h1>
        <p>Date: ${new Date().toLocaleDateString("en-IN")}</p>
      </div>

      <div class="customer-info">
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Mobile:</strong> ${customerMobile}</p>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Door Size</th>
              <th class="center">Sq.Ft</th>
              <th class="right">Single Coating</th>
              <th class="right">Double Coating</th>
              <th class="right">Double + Sagwan</th>
              <th class="right">Laminate</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td class="center">${totals.squareFeet.toFixed(2)}</td>
              <td class="right">${totals.single > 0 ? formatCurrency(totals.single) : "-"}</td>
              <td class="right">${totals.double > 0 ? formatCurrency(totals.double) : "-"}</td>
              <td class="right">${totals.doubleSagwan > 0 ? formatCurrency(totals.doubleSagwan) : "-"}</td>
              <td class="right">${totals.laminate > 0 ? formatCurrency(totals.laminate) : "-"}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="summary">
        <h3>Coating Type Summary</h3>
        ${
          totals.single > 0
            ? `<div class="summary-item">
          <span>Single Coating (@ ${formatCurrency(SINGLE_COATING_RATE)}/sq.ft):</span>
          <span>${formatCurrency(totals.single)}</span>
        </div>`
            : ""
        }
        ${
          totals.double > 0
            ? `<div class="summary-item">
          <span>Double Coating (@ ${formatCurrency(DOUBLE_COATING_RATE)}/sq.ft):</span>
          <span>${formatCurrency(totals.double)}</span>
        </div>`
            : ""
        }
        ${
          totals.doubleSagwan > 0
            ? `<div class="summary-item">
          <span>Double Coating + Sagwan Patti (@ ${formatCurrency(DOUBLE_SAGWAN_RATE)}/sq.ft):</span>
          <span>${formatCurrency(totals.doubleSagwan)}</span>
        </div>`
            : ""
        }
        ${
          totals.laminate > 0
            ? `<div class="summary-item">
          <span>Laminate (@ ${formatCurrency(LAMINATE_RATE)}/sq.ft):</span>
          <span>${formatCurrency(totals.laminate)}</span>
        </div>`
            : ""
        }
      </div>

      <div class="note">
        <strong>Note:</strong> All calculations are based on rounded dimensions according to standard carpenter sizing rules. Actual entered dimensions are displayed in the table for reference.
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Generated by Door Quotation System</p>
      </div>
    </body>
    </html>
  `;
}
