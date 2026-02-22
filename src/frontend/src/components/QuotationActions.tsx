import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Printer } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useGetAllTypes, useGetTotalSquareFeet, useGetCoatingAmounts, useDeleteType } from '../hooks/useQueries';
import { generateQuotationPDF } from '../utils/pdfGenerator';
import { shareViaWhatsApp } from '../utils/whatsappShare';
import { toast } from 'sonner';

interface QuotationActionsProps {
  customerName: string;
  customerMobile: string;
  refreshTrigger: number;
  onQuotationGenerated: () => void;
}

export function QuotationActions({
  customerName,
  customerMobile,
  refreshTrigger,
  onQuotationGenerated,
}: QuotationActionsProps) {
  const { data: types } = useGetAllTypes(refreshTrigger);
  const { data: totalSquareFeet } = useGetTotalSquareFeet(refreshTrigger);
  const { data: coatingAmounts } = useGetCoatingAmounts(refreshTrigger);
  const deleteTypeMutation = useDeleteType();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const handleGeneratePDF = async () => {
    if (!types || types.length === 0) {
      toast.error('Please add at least one door entry before generating quotation');
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await generateQuotationPDF({
        customerName,
        customerMobile,
        types,
        totalSquareFeet: totalSquareFeet || 0,
        coatingAmounts: coatingAmounts || {
          singleCoatingAmount: 0,
          doubleCoatingAmount: 0,
          doubleSagwanAmount: 0,
          laminateAmount: 0,
        },
      });

      setPdfBlob(blob);

      // Clear all entries after successful PDF generation
      if (types && types.length > 0) {
        for (const type of types) {
          await deleteTypeMutation.mutateAsync(type.id);
        }
      }

      const doorCount = types.length;
      toast.success(
        `Quotation generated for ${doorCount} door ${doorCount === 1 ? 'size' : 'sizes'}. Entries cleared.`
      );
      
      // Notify parent to reset form
      onQuotationGenerated();
    } catch (error) {
      console.error('Error generating quotation:', error);
      toast.error('Failed to generate quotation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareWhatsApp = async () => {
    if (!pdfBlob) {
      toast.error('Please generate quotation first before sharing');
      return;
    }

    try {
      await shareViaWhatsApp(pdfBlob, customerName);
      toast.success('Opening WhatsApp...');
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast.error('Failed to share via WhatsApp. Please try again.');
    }
  };

  return (
    <Card className="shadow-md border-2 border-accent/30 bg-accent/5">
      <CardHeader>
        <CardTitle className="text-2xl">Generate Quotation</CardTitle>
        <CardDescription className="text-base">
          Create and share professional quotations (Print to save as PDF)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button
            size="lg"
            className="flex-1 min-w-[200px] h-14 text-lg"
            onClick={handleGeneratePDF}
            disabled={isGenerating || !types || types.length === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Printer className="mr-2 h-5 w-5" />
                Generate Quotation PDF
              </>
            )}
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="min-w-[200px] h-14 text-lg"
            onClick={handleShareWhatsApp}
            disabled={!pdfBlob}
          >
            <SiWhatsapp className="mr-2 h-5 w-5" />
            Share via WhatsApp
          </Button>
        </div>

        {types && types.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Add door entries above to generate quotation
          </p>
        )}

        {pdfBlob && (
          <p className="mt-4 text-sm text-muted-foreground text-center">
            💡 Tip: Use your browser's Print function (Ctrl+P / Cmd+P) and select "Save as PDF" to download the quotation
          </p>
        )}
      </CardContent>
    </Card>
  );
}
