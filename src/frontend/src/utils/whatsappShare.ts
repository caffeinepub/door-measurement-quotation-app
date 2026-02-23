export async function shareViaWhatsApp(
  file: File,
  customerName: string,
  customerMobile: string
): Promise<boolean> {
  const message = `Door Quotation for ${customerName}\nMobile: ${customerMobile}\n\nNote: Calculations use rounded dimensions while displaying actual entered dimensions.`;

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
