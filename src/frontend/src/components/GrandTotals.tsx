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
  const { data: totals, isLoading, error } = useGetTotalSquareFeet();

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/30 bg-primary/10 shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive/30 bg-destructive/10 shadow-lg">
        <CardContent className="py-12 text-center text-destructive">
          Error loading totals. Please try again.
        </CardContent>
      </Card>
    );
  }

  if (!totals || totals.grandTotal === 0) {
    return null;
  }

  const singleCoatingAmount = Math.round(totals.singleCoating * SINGLE_COATING_RATE);
  const doubleCoatingAmount = Math.round(totals.doubleCoating * DOUBLE_COATING_RATE);
  const doubleSagwanAmount = Math.round(totals.doubleSagwan * DOUBLE_SAGWAN_RATE);
  const laminateAmount = Math.round(totals.laminate * LAMINATE_RATE);

  return (
    <Card className="border-2 border-primary/30 bg-primary/10 shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-center pb-4 border-b border-primary/20">
            <h3 className="text-lg font-semibold text-muted-foreground">Total Square Feet</h3>
            <p className="text-4xl font-bold text-primary mt-2">
              {totals.grandTotal.toFixed(2)} sq.ft
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {totals.singleCoating > 0 && (
              <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                <p className="text-sm text-muted-foreground font-medium">Single Coating</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totals.singleCoating.toFixed(2)} sq.ft @ ₹{SINGLE_COATING_RATE}/sq.ft
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  ₹{formatCurrency(singleCoatingAmount)}
                </p>
              </div>
            )}

            {totals.doubleCoating > 0 && (
              <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                <p className="text-sm text-muted-foreground font-medium">Double Coating</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totals.doubleCoating.toFixed(2)} sq.ft @ ₹{DOUBLE_COATING_RATE}/sq.ft
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  ₹{formatCurrency(doubleCoatingAmount)}
                </p>
              </div>
            )}

            {totals.doubleSagwan > 0 && (
              <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                <p className="text-sm text-muted-foreground font-medium">Double Coating + Sagwan Patti</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totals.doubleSagwan.toFixed(2)} sq.ft @ ₹{DOUBLE_SAGWAN_RATE}/sq.ft
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  ₹{formatCurrency(doubleSagwanAmount)}
                </p>
              </div>
            )}

            {totals.laminate > 0 && (
              <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                <p className="text-sm text-muted-foreground font-medium">Laminate</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totals.laminate.toFixed(2)} sq.ft @ ₹{LAMINATE_RATE}/sq.ft
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  ₹{formatCurrency(laminateAmount)}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
