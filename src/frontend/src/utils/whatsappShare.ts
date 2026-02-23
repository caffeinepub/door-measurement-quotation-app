import type { DoorEntry } from "../backend";
import { SINGLE_COATING_RATE, DOUBLE_COATING_RATE, DOUBLE_SAGWAN_RATE, LAMINATE_RATE } from "./coatingRates";
import { decimalToFractionDisplay } from "./fractionParser";

interface DoorGroup {
  heightEntered: number;
  widthEntered: number;
  heightRounded: number;
  widthRounded: number;
  squareFeet: number;
}

function groupDoorsBySize(entries: DoorEntry[]): DoorGroup[] {
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

  return Array.from(groupedMap.values());
}

export async function shareViaWhatsApp(
  file: File,
  customerName: string,
  customerMobile: string,
  entries: DoorEntry[]
): Promise<boolean> {
  // Group doors by size
  const groupedDoors = groupDoorsBySize(entries);

  // Calculate totals
  let totalSquareFeet = 0;
  let singleCoatingTotal = 0;
  let doubleCoatingTotal = 0;
  let doubleSagwanTotal = 0;
  let laminateTotal = 0;

  groupedDoors.forEach((group) => {
    totalSquareFeet += group.squareFeet;
    singleCoatingTotal += group.squareFeet * SINGLE_COATING_RATE;
    doubleCoatingTotal += group.squareFeet * DOUBLE_COATING_RATE;
    doubleSagwanTotal += group.squareFeet * DOUBLE_SAGWAN_RATE;
    laminateTotal += group.squareFeet * LAMINATE_RATE;
  });

  // Format door details
  const doorDetails = groupedDoors
    .map((group, index) => {
      const heightDisplay = decimalToFractionDisplay(group.heightEntered);
      const widthDisplay = decimalToFractionDisplay(group.widthEntered);
      const singleAmount = Math.round(group.squareFeet * SINGLE_COATING_RATE);
      const doubleAmount = Math.round(group.squareFeet * DOUBLE_COATING_RATE);
      const doubleSagwanAmount = Math.round(group.squareFeet * DOUBLE_SAGWAN_RATE);
      const laminateAmount = Math.round(group.squareFeet * LAMINATE_RATE);

      return `${index + 1}. ${heightDisplay}" × ${widthDisplay}" (${group.squareFeet.toFixed(2)} sq.ft)
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
