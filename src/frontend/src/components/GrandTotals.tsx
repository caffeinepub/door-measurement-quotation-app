import { Card, CardContent } from '@/components/ui/card';
import { useGetTotalSquareFeet } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import { SINGLE_COATING_RATE, DOUBLE_COATING_RATE, DOUBLE_SAGWAN_RATE, LAMINATE_RATE } from '../utils/coatingRates';

interface GrandTotalsProps {
  refreshTrigger: number;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN');
}

export function GrandTotals({ refreshTrigger }: GrandTotalsProps) {
  const { data: totals, isLoading, error } = useGetTotalSquareFeet(refreshTrigger);

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

  if (!totals) {
    return null;
  }

  const singleCoatingAmount = Math.round(totals.singleCoating * SINGLE_COATING_RATE);
  const doubleCoatingAmount = Math.round(totals.doubleCoating * DOUBLE_COATING_RATE);
  const doubleSagwanAmount = Math.round(totals.doubleSagwan * DOUBLE_SAGWAN_RATE);
  const laminateAmount = Math.round(totals.laminate * LAMINATE_RATE);

  return (
    <div className="space-y-4">
      {/* Total Square Feet */}
      <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Total Square Feet
        </p>
        <p className="mt-2 text-2xl font-bold text-foreground">
          {totals.grandTotal.toFixed(2)}
          <span className="ml-2 text-base font-normal text-muted-foreground">sq.ft</span>
        </p>
      </div>

      {/* Coating Totals */}
      <div className="grid gap-4 sm:grid-cols-2">
        {totals.singleCoating > 0 && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Total Single Coating
            </p>
            <p className="mt-2 text-xl font-bold text-foreground">
              ₹{formatCurrency(singleCoatingAmount)}
            </p>
          </div>
        )}

        {totals.doubleCoating > 0 && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Total Double Coating
            </p>
            <p className="mt-2 text-xl font-bold text-foreground">
              ₹{formatCurrency(doubleCoatingAmount)}
            </p>
          </div>
        )}

        {totals.doubleSagwan > 0 && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Total Double + Sagwan
            </p>
            <p className="mt-2 text-xl font-bold text-foreground">
              ₹{formatCurrency(doubleSagwanAmount)}
            </p>
          </div>
        )}

        {totals.laminate > 0 && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/10 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Total Laminate
            </p>
            <p className="mt-2 text-xl font-bold text-foreground">
              ₹{formatCurrency(laminateAmount)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
