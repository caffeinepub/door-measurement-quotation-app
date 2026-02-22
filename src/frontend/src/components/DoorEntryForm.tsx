import { useState, useImperativeHandle } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, RotateCcw } from 'lucide-react';
import { useAddDoor } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CoatingType } from '../backend';
import { parseDimensionInput } from '../utils/fractionParser';
import { roundHeight, roundWidth } from '../utils/dimensionRounding';

interface DoorEntryFormProps {
  onEntryAdded: () => void;
  resetRef?: React.MutableRefObject<(() => void) | undefined>;
}

export function DoorEntryForm({ onEntryAdded, resetRef }: DoorEntryFormProps) {
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');

  const addDoorMutation = useAddDoor();

  const resetForm = () => {
    setHeight('');
    setWidth('');
  };

  // Expose reset function via ref
  useImperativeHandle(resetRef, () => resetForm);

  const handleClear = () => {
    resetForm();
    toast.info('Form cleared');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse height input
    const heightResult = parseDimensionInput(height);
    if (!heightResult.isValid || heightResult.decimal <= 0) {
      toast.error('Please enter a valid door height (e.g., 78.25 or 78 2/8)');
      return;
    }

    // Parse width input
    const widthResult = parseDimensionInput(width);
    if (!widthResult.isValid || widthResult.decimal <= 0) {
      toast.error('Please enter a valid door width (e.g., 30.25 or 30 2/8)');
      return;
    }

    // Calculate rounded dimensions
    const heightRounded = roundHeight(heightResult.decimal);
    const widthRounded = roundWidth(widthResult.decimal);

    try {
      // Add all 4 coating types for this door size
      const coatingTypes: CoatingType[] = [
        CoatingType.single,
        CoatingType.double_,
        CoatingType.doubleSagwan,
        CoatingType.laminate,
      ];

      for (const coatingType of coatingTypes) {
        await addDoorMutation.mutateAsync({
          heightEntered: heightResult.decimal,
          widthEntered: widthResult.decimal,
          heightRounded: BigInt(heightRounded),
          widthRounded: BigInt(widthRounded),
          coatingType,
        });
      }

      // Clear form
      resetForm();

      toast.success('Door size added with all coating types');
      onEntryAdded();
    } catch (error) {
      toast.error('Failed to add door entry');
      console.error('Error adding door entry:', error);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Door Entry</CardTitle>
        <CardDescription className="text-base">
          Enter door dimensions (supports fractions like 79 1/4, 30 3/8). All 4 coating types will be calculated automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-base font-semibold">
                Door Height (inches)
              </Label>
              <Input
                id="height"
                type="text"
                placeholder="79 1/4 or 79.25"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="h-14 text-lg"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter as decimal (79.25) or fraction (79 1/4, 79 3/8)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="width" className="text-base font-semibold">
                Door Width (inches)
              </Label>
              <Input
                id="width"
                type="text"
                placeholder="30 1/4 or 30.25"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="h-14 text-lg"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter as decimal (30.25) or fraction (30 1/4, 30 3/8)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1 min-w-[200px] h-14 text-lg"
              disabled={addDoorMutation.isPending}
            >
              {addDoorMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Add Door Size
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="min-w-[150px] h-14 text-lg"
              onClick={handleClear}
              disabled={addDoorMutation.isPending}
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
