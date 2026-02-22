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

  const hasEntries = types && types.length > 0;

  const handleGeneratePDF = async () => {
    if (!hasEntries || !totalSquareFeet || !coatingAmounts) {
      toast.error('Please add at least one door entry');
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await generateQuotationPDF({
        customerName,
        customerMobile,
        types,
        totalSquareFeet,
        coatingAmounts,
      });

      setPdfBlob(blob);
      
      // Clear all entries after successful PDF generation
      if (types) {
        for (const type of types) {
          await deleteTypeMutation.mutateAsync(type.id);
        }
      }

      toast.success('Quotation generated based on actual size.');
      onQuotationGenerated();
    } catch (error) {
      toast.error('Failed to generate quotation');
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = async () => {
    if (!pdfBlob) {
      toast.error('Please generate a quotation first');
      return;
    }

    try {
      await shareViaWhatsApp(pdfBlob, customerName);
    } catch (error) {
      toast.error('Failed to share via WhatsApp');
      console.error('Error sharing via WhatsApp:', error);
    }
  };

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
          disabled={!hasEntries || isGenerating}
          size="lg"
          className="w-full h-14 text-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Printer className="mr-2 h-5 w-5" />
              Generate & Print Quotation
            </>
          )}
        </Button>

        {pdfBlob && (
          <Button
            onClick={handleWhatsAppShare}
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg border-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
          >
            <SiWhatsapp className="mr-2 h-5 w-5" />
            Share via WhatsApp
          </Button>
        )}

        {!hasEntries && (
          <p className="text-sm text-muted-foreground text-center">
            Add door entries above to generate a quotation
          </p>
        )}
      </CardContent>
    </Card>
  );
}
