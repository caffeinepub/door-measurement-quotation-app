import { Card, CardContent } from '@/components/ui/card';
import { useGetTotalSquareFeet, useGetCoatingAmounts } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface GrandTotalsProps {
  refreshTrigger: number;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN');
}

export function GrandTotals({ refreshTrigger }: GrandTotalsProps) {
  const { data: totalSquareFeet, isLoading: isLoadingSqFt, error: errorSqFt } = useGetTotalSquareFeet(refreshTrigger);
  const { data: coatingAmounts, isLoading: isLoadingAmounts, error: errorAmounts } = useGetCoatingAmounts(refreshTrigger);

  const isLoading = isLoadingSqFt || isLoadingAmounts;
  const error = errorSqFt || errorAmounts;

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/30 bg-primary/10 shadow-lg">
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive/30 bg-destructive/10 shadow-lg">
        <CardContent className="py-6 text-center text-destructive text-sm">
          Error loading totals
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Square Feet */}
      <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Total Square Feet
        </p>
        <p className="mt-2 text-2xl font-bold text-foreground">
          {totalSquareFeet?.toFixed(2) || '0.00'}
          <span className="ml-2 text-base font-normal text-muted-foreground">sq.ft</span>
        </p>
      </div>

      {/* Coating Totals */}
      <div className="grid gap-4 sm:grid-cols-2">
        {coatingAmounts && coatingAmounts.singleCoatingAmount > 0 && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Single Coating Total
            </p>
            <p className="mt-2 text-xl font-bold text-primary">
              ₹{formatCurrency(coatingAmounts.singleCoatingAmount)}
            </p>
          </div>
        )}

        {coatingAmounts && coatingAmounts.doubleCoatingAmount > 0 && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Double Coating Total
            </p>
            <p className="mt-2 text-xl font-bold text-primary">
              ₹{formatCurrency(coatingAmounts.doubleCoatingAmount)}
            </p>
          </div>
        )}

        {coatingAmounts && coatingAmounts.doubleSagwanAmount > 0 && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Double Coating + Sagwan Patti Total
            </p>
            <p className="mt-2 text-xl font-bold text-primary">
              ₹{formatCurrency(coatingAmounts.doubleSagwanAmount)}
            </p>
          </div>
        )}

        {coatingAmounts && coatingAmounts.laminateAmount > 0 && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Laminate Total
            </p>
            <p className="mt-2 text-xl font-bold text-primary">
              ₹{formatCurrency(coatingAmounts.laminateAmount)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
