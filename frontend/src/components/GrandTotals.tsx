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
  const { data: entries, isLoading, isFetching, isPlaceholderData, error, refetch } = useGetAllDoorEntries(refreshTrigger);

  // Only show full-screen loader on true first load (no data at all yet)
  if (isLoading && !entries) {
    return (
      <Card className="border-2 border-primary/30 bg-primary/10 shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Only show error state when there's an actual error AND no cached data to show
  if (error && !entries) {
    return (
      <Card className="border-2 border-destructive/30 bg-destructive/10 shadow-lg">
        <CardContent className="py-12 text-center">
          <p className="text-destructive mb-4">
            Error loading totals. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isFetching}>
            {isFetching ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isFetching ? 'Retrying...' : 'Retry'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!entries || entries.length === 0) {
    return null;
  }

  // Calculate totals by iterating through all door entries (no grouping)
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

  return (
    <Card className="border-2 border-primary/30 bg-primary/10 shadow-lg">
      <CardContent className="py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
              Grand Totals
              {(isFetching || isPlaceholderData) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </h2>
            <p className="text-sm text-muted-foreground">
              Total Square Feet: <span className="font-bold text-lg">{totalSquareFeet.toFixed(2)}</span>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-background rounded-lg p-4 shadow-sm border border-border">
              <div className="text-sm text-muted-foreground mb-1">Single Coating</div>
              <div className="text-xl font-bold text-foreground">
                ₹{formatCurrency(Math.round(singleCoatingTotal))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                @ ₹{SINGLE_COATING_RATE.toFixed(2)}/sq.ft
              </div>
            </div>

            <div className="bg-background rounded-lg p-4 shadow-sm border border-border">
              <div className="text-sm text-muted-foreground mb-1">Double Coating</div>
              <div className="text-xl font-bold text-foreground">
                ₹{formatCurrency(Math.round(doubleCoatingTotal))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                @ ₹{DOUBLE_COATING_RATE.toFixed(2)}/sq.ft
              </div>
            </div>

            <div className="bg-background rounded-lg p-4 shadow-sm border border-border">
              <div className="text-sm text-muted-foreground mb-1">Double + Sagwan Patti</div>
              <div className="text-xl font-bold text-foreground">
                ₹{formatCurrency(Math.round(doubleSagwanTotal))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                @ ₹{DOUBLE_SAGWAN_RATE.toFixed(2)}/sq.ft
              </div>
            </div>

            <div className="bg-background rounded-lg p-4 shadow-sm border border-border">
              <div className="text-sm text-muted-foreground mb-1">Laminate</div>
              <div className="text-xl font-bold text-foreground">
                ₹{formatCurrency(Math.round(laminateTotal))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                @ ₹{LAMINATE_RATE.toFixed(2)}/sq.ft
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
