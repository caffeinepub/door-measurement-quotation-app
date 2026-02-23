import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, Share2 } from "lucide-react";
import { useGetAllDoorEntries, useDeleteAllDoorEntries } from "../hooks/useQueries";
import { generateQuotationHTML } from "../utils/pdfGenerator";
import { shareViaWhatsApp } from "../utils/whatsappShare";
import { toast } from "sonner";

interface QuotationActionsProps {
  customerName: string;
  customerMobile: string;
  refreshTrigger: number;
  onClearCustomerInfo: () => void;
}

export function QuotationActions({
  customerName,
  customerMobile,
  refreshTrigger,
  onClearCustomerInfo,
}: QuotationActionsProps) {
  const { data: doorEntries = [] } = useGetAllDoorEntries(refreshTrigger);
  const deleteAllMutation = useDeleteAllDoorEntries();

  const handleGeneratePDF = async () => {
    try {
      // Validate required data
      if (!customerName.trim()) {
        toast.error("Customer name is required to generate quotation");
        return;
      }

      if (!customerMobile.trim()) {
        toast.error("Customer mobile number is required to generate quotation");
        return;
      }

      if (doorEntries.length === 0) {
        toast.error("Please add at least one door entry before generating quotation");
        return;
      }

      // Generate HTML content
      const htmlContent = generateQuotationHTML(
        doorEntries,
        customerName,
        customerMobile
      );

      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Please allow pop-ups to generate quotation");
        return;
      }

      // Write HTML content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };

      // Clear all door entries after successful generation
      await deleteAllMutation.mutateAsync();
      onClearCustomerInfo();

      toast.success(
        "Quotation generated successfully! Note: Calculations use rounded dimensions while displaying actual entered dimensions."
      );
    } catch (error) {
      console.error("Error generating quotation:", error);
      toast.error("Failed to generate quotation. Please try again.");
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      // Validate required data
      if (!customerName.trim()) {
        toast.error("Customer name is required to share quotation");
        return;
      }

      if (!customerMobile.trim()) {
        toast.error("Customer mobile number is required to share quotation");
        return;
      }

      if (doorEntries.length === 0) {
        toast.error("Please add at least one door entry before sharing quotation");
        return;
      }

      // Generate HTML content
      const htmlContent = generateQuotationHTML(
        doorEntries,
        customerName,
        customerMobile
      );

      // Create HTML blob for sharing
      const blob = new Blob([htmlContent], { type: "text/html" });
      const file = new File([blob], `quotation-${customerName}.html`, {
        type: "text/html",
      });

      // Attempt to share via WhatsApp
      const shared = await shareViaWhatsApp(file, customerName, customerMobile);

      if (shared) {
        // Clear all door entries after successful share
        await deleteAllMutation.mutateAsync();
        onClearCustomerInfo();

        toast.success(
          "Quotation shared successfully! Note: Calculations use rounded dimensions while displaying actual entered dimensions."
        );
      }
    } catch (error) {
      console.error("Error sharing quotation:", error);
      toast.error("Failed to share quotation. Please try again.");
    }
  };

  const isDisabled = doorEntries.length === 0 || !customerName.trim() || !customerMobile.trim();

  return (
    <Card className="shadow-md border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="text-xl">Generate Quotation</CardTitle>
        <CardDescription>
          Create a printable quotation or share via WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGeneratePDF}
          disabled={isDisabled}
          className="w-full"
          size="lg"
        >
          <Printer className="mr-2 h-5 w-5" />
          Generate & Print
        </Button>

        <Button
          onClick={handleShareWhatsApp}
          disabled={isDisabled}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Share via WhatsApp
        </Button>

        {isDisabled && (
          <p className="text-sm text-muted-foreground text-center">
            {doorEntries.length === 0
              ? "Add door entries above to generate a quotation"
              : "Enter customer name and mobile number to generate a quotation"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
