import type { DoorEntry } from "../backend";
import { SINGLE_COATING_RATE, DOUBLE_COATING_RATE, DOUBLE_SAGWAN_RATE, LAMINATE_RATE } from "./coatingRates";
import { decimalToFractionDisplay } from "./fractionParser";

export async function shareViaWhatsApp(
  file: File,
  customerName: string,
  customerMobile: string,
  entries: DoorEntry[]
): Promise<boolean> {
  // Calculate totals from all entries (no grouping)
  let totalSquareFeet = 0;
  let singleCoatingTotal = 0;
  let doubleCoatingTotal = 0;
  let doubleSagwanTotal = 0;
  let laminateTotal = 0;

  entries.forEach((entry) => {
    totalSquareFeet += entry.squareFeet;
    singleCoatingTotal += entry.squareFeet * SINGLE_COATING_RATE;
    doubleCoatingTotal += entry.squareFeet * DOUBLE_COATING_RATE;
    doubleSagwanTotal += entry.squareFeet * DOUBLE_SAGWAN_RATE;
    laminateTotal += entry.squareFeet * LAMINATE_RATE;
  });

  // Format door details - each entry as a separate line item
  const doorDetails = entries
    .map((entry, index) => {
      const heightDisplay = decimalToFractionDisplay(entry.heightEntered);
      const widthDisplay = decimalToFractionDisplay(entry.widthEntered);
      const singleAmount = Math.round(entry.squareFeet * SINGLE_COATING_RATE);
      const doubleAmount = Math.round(entry.squareFeet * DOUBLE_COATING_RATE);
      const doubleSagwanAmount = Math.round(entry.squareFeet * DOUBLE_SAGWAN_RATE);
      const laminateAmount = Math.round(entry.squareFeet * LAMINATE_RATE);

      return `${index + 1}. ${heightDisplay}" × ${widthDisplay}" (${entry.squareFeet.toFixed(2)} sq.ft)
   Single: ₹${singleAmount.toLocaleString("en-IN")}
   Double: ₹${doubleAmount.toLocaleString("en-IN")}
   D+Sagwan: ₹${doubleSagwanAmount.toLocaleString("en-IN")}
   Laminate: ₹${laminateAmount.toLocaleString("en-IN")}`;
    })
    .join("\n\n");

  const message = `🚪 *Door Quotation*

*Customer:* ${customerName}
*Mobile:* ${customerMobile}

*Door Details:*
${doorDetails}

━━━━━━━━━━━━━━━━━━━━
*TOTALS (${totalSquareFeet.toFixed(2)} sq.ft)*

Single Coating: ₹${Math.round(singleCoatingTotal).toLocaleString("en-IN")}
Double Coating: ₹${Math.round(doubleCoatingTotal).toLocaleString("en-IN")}
Double + Sagwan: ₹${Math.round(doubleSagwanTotal).toLocaleString("en-IN")}
Laminate: ₹${Math.round(laminateTotal).toLocaleString("en-IN")}

_Note: Calculations are done as per standard carpenter rules._`;

  // Check if Web Share API is available and supports files
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: `Door Quotation - ${customerName}`,
        text: message,
        files: [file],
      });
      return true;
    } catch (error: any) {
      // User cancelled the share or an error occurred
      if (error.name === "AbortError") {
        console.log("Share cancelled by user");
        return false;
      }
      console.error("Error sharing via Web Share API:", error);
      // Fall through to fallback method
    }
  }

  // Fallback: Open WhatsApp Web with pre-filled message
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  // Open WhatsApp in a new window
  const whatsappWindow = window.open(whatsappUrl, "_blank");

  if (whatsappWindow) {
    // Show instructions to the user
    alert(
      "WhatsApp opened in a new window. Please manually attach the quotation file after the message is pre-filled.\n\nNote: On mobile devices, use the 'Share via WhatsApp' button for automatic file attachment."
    );
    return true;
  } else {
    alert("Please allow pop-ups to share via WhatsApp");
    return false;
  }
}
