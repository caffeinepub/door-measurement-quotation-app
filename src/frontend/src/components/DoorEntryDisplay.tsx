import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { DoorEntry } from '../backend';

interface DoorEntryDisplayProps {
  entry: DoorEntry;
  onDelete: (id: bigint) => void;
  isDeleting: boolean;
}

export function DoorEntryDisplay({ entry, onDelete, isDeleting }: DoorEntryDisplayProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="grid flex-1 grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rounded Size</p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {entry.roundedHeight.toString()} × {entry.roundedWidth.toString()}"
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Square Feet</p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {entry.squareFeet.toFixed(2)} sq.ft
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Amount</p>
              <p className="mt-1 text-base font-semibold text-foreground">
                ${entry.amount.toString()}
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(entry.id)}
            disabled={isDeleting}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
