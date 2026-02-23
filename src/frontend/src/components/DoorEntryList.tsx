import { useState, useMemo } from 'react';
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

interface GroupedDoor {
  heightEntered: number;
  widthEntered: number;
  entries: DoorEntry[];
  squareFeet: number;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN');
}

function calculateCoatingAmount(squareFeet: number, rate: number): number {
  return Math.round(squareFeet * rate);
}

function groupDoorsBySize(entries: DoorEntry[]): GroupedDoor[] {
  const groups = new Map<string, GroupedDoor>();

  for (const entry of entries) {
    const key = `${entry.heightEntered}-${entry.widthEntered}`;
    
    if (!groups.has(key)) {
      groups.set(key, {
        heightEntered: entry.heightEntered,
        widthEntered: entry.widthEntered,
        entries: [],
        squareFeet: entry.squareFeet,
      });
    }
    
    groups.get(key)!.entries.push(entry);
  }

  return Array.from(groups.values());
}

export function DoorEntryList({ refreshTrigger, onEntryDeleted }: DoorEntryListProps) {
  const { data: entries, isLoading, error, refetch } = useGetAllDoorEntries(refreshTrigger);
  const deleteDoorMutation = useDeleteDoorEntry();
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const handleDelete = async (group: GroupedDoor) => {
    const key = `${group.heightEntered}-${group.widthEntered}`;
    setDeletingKey(key);
    try {
      // Delete all entries for this door size
      for (const entry of group.entries) {
        await deleteDoorMutation.mutateAsync(entry.id);
      }
      toast.success('Door size deleted successfully');
      onEntryDeleted();
    } catch (error) {
      toast.error('Failed to delete door size');
      console.error('Error deleting door:', error);
    } finally {
      setDeletingKey(null);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const groupedDoors = entries ? groupDoorsBySize(entries) : [];

  // Calculate totals dynamically
  const totals = useMemo(() => {
    let totalSingleCoating = 0;
    let totalDoubleCoating = 0;
    let totalDoubleSagwan = 0;
    let totalLaminate = 0;
    let totalSquareFeet = 0;

    groupedDoors.forEach((group) => {
      totalSingleCoating += calculateCoatingAmount(group.squareFeet, SINGLE_COATING_RATE);
      totalDoubleCoating += calculateCoatingAmount(group.squareFeet, DOUBLE_COATING_RATE);
      totalDoubleSagwan += calculateCoatingAmount(group.squareFeet, DOUBLE_SAGWAN_RATE);
      totalLaminate += calculateCoatingAmount(group.squareFeet, LAMINATE_RATE);
      totalSquareFeet += group.squareFeet;
    });

    return {
      singleCoating: totalSingleCoating,
      doubleCoating: totalDoubleCoating,
      doubleSagwan: totalDoubleSagwan,
      laminate: totalLaminate,
      squareFeet: totalSquareFeet,
    };
  }, [groupedDoors]);

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md border-destructive/50">
        <CardContent className="py-12 text-center">
          <p className="text-destructive mb-4">
            Error loading door entries. Please try again.
          </p>
          <Button onClick={handleRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Door Entries</CardTitle>
        <CardDescription>
          {groupedDoors.length > 0
            ? `${groupedDoors.length} door ${groupedDoors.length === 1 ? 'size' : 'sizes'} added`
            : 'No door entries yet'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {groupedDoors.length > 0 ? (
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
                {groupedDoors.map((group, index) => {
                  const heightDisplay = decimalToFractionDisplay(group.heightEntered);
                  const widthDisplay = decimalToFractionDisplay(group.widthEntered);
                  const key = `${group.heightEntered}-${group.widthEntered}`;
                  
                  return (
                    <TableRow key={key}>
                      <TableCell className="font-medium px-1 sm:px-4 text-xs sm:text-sm">{index + 1}</TableCell>
                      <TableCell className="font-semibold px-1 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                        {heightDisplay} × {widthDisplay}"
                      </TableCell>
                      <TableCell className="text-right px-1 sm:px-4 text-xs sm:text-sm">
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(group.squareFeet, SINGLE_COATING_RATE))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-1 sm:px-4 text-xs sm:text-sm">
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(group.squareFeet, DOUBLE_COATING_RATE))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-1 sm:px-4 text-xs sm:text-sm">
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(group.squareFeet, DOUBLE_SAGWAN_RATE))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-1 sm:px-4 text-xs sm:text-sm">
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(group.squareFeet, LAMINATE_RATE))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium px-1 sm:px-4 text-xs sm:text-sm">
                        {group.squareFeet.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-1 sm:px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(group)}
                          disabled={deletingKey === key}
                          className="h-6 w-6 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {deletingKey === key ? (
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
