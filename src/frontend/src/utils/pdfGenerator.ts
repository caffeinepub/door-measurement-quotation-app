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
          <td style="padding: 12px; border: 1px solid #ddd;">${heightDisplay}" × ${widthDisplay}"</td>
          <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${group.squareFeet.toFixed(2)}</td>
          <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${
            singleEntry ? formatCurrency(singleEntry.amount) : "-"
          }</td>
          <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${
            doubleEntry ? formatCurrency(doubleEntry.amount) : "-"
          }</td>
          <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${
            doubleSagwanEntry ? formatCurrency(doubleSagwanEntry.amount) : "-"
          }</td>
          <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Door Quotation - ${customerName}</title>
      <style>
        @media print {
          body { margin: 0; }
          @page { margin: 1cm; }
        }
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0 0 10px 0;
          color: #333;
        }
        .customer-info {
          margin-bottom: 30px;
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
        }
        .customer-info p {
          margin: 5px 0;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background-color: #333;
          color: white;
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }
        th.center {
          text-align: center;
        }
        th.right {
          text-align: right;
        }
        tfoot td {
          font-weight: bold;
          background-color: #f0f0f0;
          padding: 12px;
          border: 1px solid #ddd;
        }
        .summary {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 5px;
        }
        .summary h3 {
          margin-top: 0;
          color: #333;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #ddd;
        }
        .summary-item:last-child {
          border-bottom: none;
          font-weight: bold;
          font-size: 1.1em;
          margin-top: 10px;
          padding-top: 15px;
          border-top: 2px solid #333;
        }
        .note {
          margin-top: 30px;
          padding: 15px;
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          font-size: 12px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 20px;
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
            <td style="text-align: center;">${totals.squareFeet.toFixed(2)}</td>
            <td style="text-align: right;">${totals.single > 0 ? formatCurrency(totals.single) : "-"}</td>
            <td style="text-align: right;">${totals.double > 0 ? formatCurrency(totals.double) : "-"}</td>
            <td style="text-align: right;">${totals.doubleSagwan > 0 ? formatCurrency(totals.doubleSagwan) : "-"}</td>
            <td style="text-align: right;">${totals.laminate > 0 ? formatCurrency(totals.laminate) : "-"}</td>
          </tr>
        </tfoot>
      </table>

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
        <strong>Note:</strong> All calculations are based on rounded dimensions according to standard carpenter sizing rules. 
        Actual entered dimensions are displayed in the table for reference.
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Generated by Door Quotation System</p>
      </div>
    </body>
    </html>
  `;
}
