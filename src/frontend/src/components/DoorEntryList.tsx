import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useGetAllTypes, useDeleteType } from '../hooks/useQueries';
import { Loader2, Package, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { DoorType } from '../backend';

interface DoorEntryListProps {
  refreshTrigger: number;
  onEntryDeleted: () => void;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN');
}

function calculateCoatingAmount(squareFeet: number, rate: number): number {
  return squareFeet * rate;
}

export function DoorEntryList({ refreshTrigger, onEntryDeleted }: DoorEntryListProps) {
  const { data: types, isLoading, error } = useGetAllTypes(refreshTrigger);
  const deleteTypeMutation = useDeleteType();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deleteTypeMutation.mutateAsync(id);
      toast.success('Door size deleted successfully');
      onEntryDeleted();
    } catch (error) {
      toast.error('Failed to delete door size');
      console.error('Error deleting type:', error);
    } finally {
      setDeletingId(null);
    }
  };

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
      <Card className="shadow-md">
        <CardContent className="py-12 text-center text-destructive">
          Error loading door entries. Please try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Door Entries</CardTitle>
        <CardDescription>
          {types && types.length > 0
            ? `${types.length} door ${types.length === 1 ? 'size' : 'sizes'} added`
            : 'No door entries yet'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {types && types.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Sr No</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Single Coating</TableHead>
                  <TableHead className="text-right">Double Coating</TableHead>
                  <TableHead className="text-right">Double Coating + Sagwan Patti</TableHead>
                  <TableHead className="text-right">Laminate</TableHead>
                  <TableHead className="text-right">Sq.Ft</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.map((type, index) => (
                  <TableRow key={type.id.toString()}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-semibold">
                      {type.enteredHeight} × {type.enteredWidth}"
                    </TableCell>
                    <TableCell className="text-right">
                      {type.coatings.singleCoating ? (
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(type.squareFeet, 165))}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {type.coatings.doubleCoating ? (
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(type.squareFeet, 185))}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {type.coatings.doubleSagwan ? (
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(type.squareFeet, 210))}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {type.coatings.laminate ? (
                        <span className="font-semibold">
                          ₹{formatCurrency(calculateCoatingAmount(type.squareFeet, 240))}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {type.squareFeet.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(type.id)}
                        disabled={deletingId === type.id}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
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
