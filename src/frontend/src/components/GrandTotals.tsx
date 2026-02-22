import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetGrandTotals } from '../hooks/useQueries';
import { Loader2, Calculator } from 'lucide-react';

interface GrandTotalsProps {
  refreshTrigger: number;
}

export function GrandTotals({ refreshTrigger }: GrandTotalsProps) {
  const { data: totals, isLoading, error } = useGetGrandTotals(refreshTrigger);

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 bg-primary/5 shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive/20 bg-destructive/5 shadow-lg">
        <CardContent className="py-12 text-center text-destructive">
          Error loading grand totals. Please try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-primary/5 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Calculator className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Grand Totals</CardTitle>
            <CardDescription>Summary of all door entries</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Square Feet</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {totals?.totalSquareFeet.toFixed(2) || '0.00'}
              <span className="ml-2 text-lg font-normal text-muted-foreground">sq.ft</span>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              ${totals?.totalAmount.toString() || '0'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
