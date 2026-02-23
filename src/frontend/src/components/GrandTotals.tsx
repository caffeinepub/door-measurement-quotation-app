import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetAllDoorEntries } from '../hooks/useQueries';
import { Loader2, RefreshCw } from 'lucide-react';
import { SINGLE_COATING_RATE, DOUBLE_COATING_RATE, DOUBLE_SAGWAN_RATE, LAMINATE_RATE } from '../utils/coatingRates';

interface GrandTotalsProps {
  refreshTrigger: number;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function GrandTotals({ refreshTrigger }: GrandTotalsProps) {
  const { data: entries, isLoading, error, refetch } = useGetAllDoorEntries(refreshTrigger);

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
        <CardContent className="py-12 text-center">
          <p className="text-destructive mb-4">
            Error loading totals. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!entries || entries.length === 0) {
    return null;
  }

  // Calculate totals by iterating through all door entries
  let totalSquareFeet = 0;
  let singleCoatingTotal = 0;
  let doubleCoatingTotal = 0;
  let doubleSagwanTotal = 0;
  let laminateTotal = 0;

  entries.forEach((entry) => {
    totalSquareFeet += entry.squareFeet;
    singleCoatingTotal += entry.squareFeet * SINGLE_COATING_RATE;
    doubleCoatingTotal += entry.squareFeet * DOUBLE_COATING_RATE;
    doubleSagwanTotal += entry.squareFeet * DOUBLE_SAGWAN_RATE;
    laminateTotal += entry.squareFeet * LAMINATE_RATE;
  });

  // Round the totals
  const singleCoatingAmount = Math.round(singleCoatingTotal);
  const doubleCoatingAmount = Math.round(doubleCoatingTotal);
  const doubleSagwanAmount = Math.round(doubleSagwanTotal);
  const laminateAmount = Math.round(laminateTotal);

  return (
    <Card className="border-2 border-primary/30 bg-primary/10 shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-center pb-4 border-b border-primary/20">
            <h3 className="text-lg font-semibold text-muted-foreground">Total Square Feet</h3>
            <p className="text-4xl font-bold text-primary mt-2">
              {totalSquareFeet.toFixed(2)} sq.ft
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
              <p className="text-sm text-muted-foreground font-medium">Single Coating</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalSquareFeet.toFixed(2)} sq.ft @ ₹{SINGLE_COATING_RATE}/sq.ft
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">
                ₹{formatCurrency(singleCoatingAmount)}
              </p>
            </div>

            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
              <p className="text-sm text-muted-foreground font-medium">Double Coating</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalSquareFeet.toFixed(2)} sq.ft @ ₹{DOUBLE_COATING_RATE}/sq.ft
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">
                ₹{formatCurrency(doubleCoatingAmount)}
              </p>
            </div>

            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
              <p className="text-sm text-muted-foreground font-medium">Double Coating + Sagwan Patti</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalSquareFeet.toFixed(2)} sq.ft @ ₹{DOUBLE_SAGWAN_RATE}/sq.ft
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">
                ₹{formatCurrency(doubleSagwanAmount)}
              </p>
            </div>

            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
              <p className="text-sm text-muted-foreground font-medium">Laminate</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalSquareFeet.toFixed(2)} sq.ft @ ₹{LAMINATE_RATE}/sq.ft
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">
                ₹{formatCurrency(laminateAmount)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
