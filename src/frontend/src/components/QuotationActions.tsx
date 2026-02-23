import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Share2, Loader2 } from 'lucide-react';
import { useGetAllDoorEntries, useDeleteAllDoorEntries } from '../hooks/useQueries';
import { generateQuotationHTML } from '../utils/pdfGenerator';
import { shareViaWhatsApp } from '../utils/whatsappShare';
import { toast } from 'sonner';

interface QuotationActionsProps {
  customerName: string;
  customerMobile: string;
  onClearAll: () => void;
}

export function QuotationActions({ customerName, customerMobile, onClearAll }: QuotationActionsProps) {
  const { data: entries } = useGetAllDoorEntries();
  const deleteAllMutation = useDeleteAllDoorEntries();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const hasEntries = entries && entries.length > 0;
  const hasCustomerInfo = customerName.trim() !== '' && customerMobile.trim() !== '';
  const canGenerate = hasEntries && hasCustomerInfo;

  const handleGeneratePDF = async () => {
    if (!canGenerate) {
      if (!hasCustomerInfo) {
        toast.error('Please enter customer name and mobile number');
      } else {
        toast.error('Please add at least one door entry');
      }
      return;
    }

    setIsGenerating(true);
    try {
      const html = generateQuotationHTML(entries!, customerName, customerMobile);
      
      // Create a blob and open in new window for printing
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 250);
        };
        
        toast.success('Quotation opened for printing');
        
        // Clear all entries and customer info after successful generation
        await deleteAllMutation.mutateAsync();
        onClearAll();
        
        // Clean up the blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      } else {
        toast.error('Please allow pop-ups to generate quotation');
      }
    } catch (error) {
      console.error('Error generating quotation:', error);
      toast.error('Failed to generate quotation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareWhatsApp = async () => {
    if (!canGenerate) {
      if (!hasCustomerInfo) {
        toast.error('Please enter customer name and mobile number');
      } else {
        toast.error('Please add at least one door entry');
      }
      return;
    }

    setIsSharing(true);
    try {
      const html = generateQuotationHTML(entries!, customerName, customerMobile);
      
      // Create a file for sharing
      const blob = new Blob([html], { type: 'text/html' });
      const file = new File([blob], `quotation-${customerName.replace(/\s+/g, '-')}.html`, {
        type: 'text/html',
      });

      const shared = await shareViaWhatsApp(file, customerName, customerMobile, entries!);
      
      if (shared) {
        toast.success('Quotation shared successfully');
        
        // Clear all entries and customer info after successful share
        await deleteAllMutation.mutateAsync();
        onClearAll();
      }
    } catch (error) {
      console.error('Error sharing quotation:', error);
      toast.error('Failed to share quotation');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card className="shadow-md border-primary/20">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleGeneratePDF}
            disabled={!canGenerate || isGenerating}
            className="flex-1"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Generate Quotation
              </>
            )}
          </Button>
          <Button
            onClick={handleShareWhatsApp}
            disabled={!canGenerate || isSharing}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-5 w-5" />
                Share via WhatsApp
              </>
            )}
          </Button>
        </div>
        {!canGenerate && (
          <p className="text-sm text-muted-foreground text-center mt-3">
            {!hasCustomerInfo
              ? 'Enter customer details to generate quotation'
              : 'Add door entries to generate quotation'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
