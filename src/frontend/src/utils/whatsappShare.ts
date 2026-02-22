export async function shareViaWhatsApp(pdfBlob: Blob, customerName: string): Promise<void> {
  const fileName = `Door_Quotation_${customerName || 'Customer'}_${
    new Date().toISOString().split('T')[0]
  }.html`;

  // Check if Web Share API is available and supports files
  if (navigator.share && navigator.canShare) {
    const file = new File([pdfBlob], fileName, { type: 'text/html' });

    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Door Quotation',
          text: `Door quotation for ${customerName || 'customer'}. Quotation generated based on actual size.`,
          files: [file],
        });
        return;
      } catch (error) {
        // User cancelled or error occurred, fall through to alternative method
        if ((error as Error).name !== 'AbortError') {
          console.error('Web Share API error:', error);
        }
      }
    }
  }

  // Fallback: Open WhatsApp Web with a message
  const message = encodeURIComponent(
    `Door Quotation for ${customerName || 'customer'}\n\nQuotation generated based on actual size.\n\nGenerated on ${new Date().toLocaleDateString()}\n\nNote: The quotation document has been generated. Please save it as PDF using your browser's print function (Print > Save as PDF) and attach it to this message.`
  );

  // For mobile devices, use WhatsApp app URL scheme
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const whatsappUrl = isMobile
    ? `whatsapp://send?text=${message}`
    : `https://web.whatsapp.com/send?text=${message}`;

  // Open WhatsApp
  window.open(whatsappUrl, '_blank');
}
