import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useGetAllDoorEntries, useDeleteDoorEntry } from '../hooks/useQueries';
import { Loader2, Package, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { DoorEntry } from '../backend';
import { SINGLE_COATING_RATE, DOUBLE_COATING_RATE, DOUBLE_SAGWAN_RATE, LAMINATE_RATE } from '../utils/coatingRates';
import { decimalToFractionDisplay } from '../utils/fractionParser';

interface DoorEntryListProps {
  refreshTrigger: number;
  onEntryDeleted: () => void;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN');
}

function calculateCoatingAmount(squareFeet: number, rate: number): number {
  return Math.round(squareFeet * rate);
}

export function DoorEntryList({ refreshTrigger, onEntryDeleted }: DoorEntryListProps) {
  const { data: entries, isLoading, isFetching, isPlaceholderData, error, refetch } = useGetAllDoorEntries(refreshTrigger);
  const deleteDoorMutation = useDeleteDoorEntry();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDelete = async (entry: DoorEntry) => {
    setDeletingId(entry.id);
    try {
      await deleteDoorMutation.mutateAsync(entry.id);
      toast.success('Door entry deleted successfully');
      onEntryDeleted();
    } catch (error) {
      toast.error('Failed to delete door entry');
      console.error('Error deleting door:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  // Calculate totals from all entries (no grouping)
  const totals = entries
    ? entries.reduce(
        (acc, entry) => ({
          singleCoating: acc.singleCoating + calculateCoatingAmount(entry.squareFeet, SINGLE_COATING_RATE),
          doubleCoating: acc.doubleCoating + calculateCoatingAmount(entry.squareFeet, DOUBLE_COATING_RATE),
          doubleSagwan: acc.doubleSagwan + calculateCoatingAmount(entry.squareFeet, DOUBLE_SAGWAN_RATE),
          laminate: acc.laminate + calculateCoatingAmount(entry.squareFeet, LAMINATE_RATE),
          squareFeet: acc.squareFeet + entry.squareFeet,
        }),
        {
          singleCoating: 0,
          doubleCoating: 0,
          doubleSagwan: 0,
          laminate: 0,
          squareFeet: 0,
        }
      )
    : {
        singleCoating: 0,
        doubleCoating: 0,
        doubleSagwan: 0,
        laminate: 0,
        squareFeet: 0,
      };

  // Only show full-screen loader on true first load (no data at all yet)
  if (isLoading && !entries) {
    return (
      <Card className="shadow-md">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Only show error state when there's an actual error AND no cached data to show
  if (error && !entries) {
    return (
      <Card className="shadow-md border-destructive/50">
        <CardContent className="py-12 text-center">
          <p className="text-destructive mb-4">
            Error loading door entries. Please try again.
          </p>
          <Button onClick={handleRetry} variant="outline" size="sm" disabled={isFetching}>
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

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          Door Entries
          {(isFetching || isPlaceholderData) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          {entries && entries.length > 0
            ? `${entries.length} door ${entries.length === 1 ? 'entry' : 'entries'} added`
            : 'No door entries yet'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {entries && entries.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8 sm:w-12 px-1 sm:px-4 text-xs sm:text-sm">Sr</TableHead>
                  <TableHead className="px-1 sm:px-4 text-xs sm:text-sm whitespace-nowrap">Size</TableHead>
                  <TableHead className="text-right px-1 sm:px-4 text-xs sm:text-sm whitespace-nowrap">Single</TableHead>
                  <TableHead className="text-right px-1 sm:px-4 text-xs sm:text-sm whitespace-nowrap">Double</TableHead>
                  <TableHead className="text-right px-1 sm:px-4 text-xs sm:text-sm whitespace-nowrap">D+Sag</TableHead>
                  <TableHead className="text-right px-1 sm:px-4 text-xs sm:text-sm whitespace-nowrap">Lam</TableHead>
                  <TableHead className="text-right px-1 sm:px-4 text-xs sm:text-sm">Sq.Ft</TableHead>
                  <TableHead className="w-8 sm:w-12 px-1 sm:px-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => {
                  const heightDisplay = decimalToFractionDisplay(entry.heightEntered);
                  const widthDisplay = decimalToFractionDisplay(entry.widthEntered);
                  
                  return (
                    <TableRow key={entry.id.toString()}>
                      <TableCell className="font-medium px-1 sm:px-4 text-xs sm:text-sm">{index + 1}</TableCell>
                      <TableCell className="font-semibold px-1 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                        {heightDisplay} × {widthDisplay}"
                      </TableCell>
                      <TableCell className="text-right px-1 sm:px-4 text-xs sm:text-sm">
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(entry.squareFeet, SINGLE_COATING_RATE))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-1 sm:px-4 text-xs sm:text-sm">
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(entry.squareFeet, DOUBLE_COATING_RATE))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-1 sm:px-4 text-xs sm:text-sm">
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(entry.squareFeet, DOUBLE_SAGWAN_RATE))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-1 sm:px-4 text-xs sm:text-sm">
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(entry.squareFeet, LAMINATE_RATE))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium px-1 sm:px-4 text-xs sm:text-sm">
                        {entry.squareFeet.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-1 sm:px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry)}
                          disabled={deletingId === entry.id}
                          className="h-6 w-6 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {deletingId === entry.id ? (
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20 border-t-2 border-amber-900/20">
                  <TableCell colSpan={2} className="font-bold text-xs sm:text-base px-1 sm:px-4">
                    TOTAL
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs sm:text-base px-1 sm:px-4">
                    ₹{formatCurrency(totals.singleCoating)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs sm:text-base px-1 sm:px-4">
                    ₹{formatCurrency(totals.doubleCoating)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs sm:text-base px-1 sm:px-4">
                    ₹{formatCurrency(totals.doubleSagwan)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs sm:text-base px-1 sm:px-4">
                    ₹{formatCurrency(totals.laminate)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs sm:text-base px-1 sm:px-4">
                    {totals.squareFeet.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-1 sm:px-4"></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No door entries yet. Add your first entry above.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
