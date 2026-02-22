import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DoorEntryDisplay } from './DoorEntryDisplay';
import { useGetAllEntries, useDeleteEntry } from '../hooks/useQueries';
import { Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

interface DoorEntryListProps {
  refreshTrigger: number;
  onEntryDeleted: () => void;
}

export function DoorEntryList({ refreshTrigger, onEntryDeleted }: DoorEntryListProps) {
  const { data: entries, isLoading, error } = useGetAllEntries(refreshTrigger);
  const deleteEntryMutation = useDeleteEntry();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deleteEntryMutation.mutateAsync(id);
      toast.success('Door entry deleted successfully');
      onEntryDeleted();
    } catch (error) {
      toast.error('Failed to delete door entry');
      console.error('Error deleting entry:', error);
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
          {entries && entries.length > 0
            ? `${entries.length} door ${entries.length === 1 ? 'entry' : 'entries'} added`
            : 'No door entries yet'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {entries && entries.length > 0 ? (
          <div className="space-y-3">
            {entries.map((entry) => (
              <DoorEntryDisplay
                key={entry.id.toString()}
                entry={entry}
                onDelete={handleDelete}
                isDeleting={deletingId === entry.id}
              />
            ))}
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
