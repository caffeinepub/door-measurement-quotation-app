import { useState, useImperativeHandle } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Loader2, RotateCcw } from 'lucide-react';
import { useAddDoor } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { CoatingType } from '../backend';
import { parseDimensionInput, roundToNearestInch } from '../utils/fractionParser';

interface DoorEntryFormProps {
  onEntryAdded: () => void;
  resetRef?: React.MutableRefObject<(() => void) | undefined>;
}

const COATING_OPTIONS = [
  { key: 'singleCoating', label: 'Single Coating', rate: 165 },
  { key: 'doubleCoating', label: 'Double Coating', rate: 185 },
  { key: 'doubleSagwan', label: 'Double Coating + Sagwan Patti', rate: 210 },
  { key: 'laminate', label: 'Laminate', rate: 240 },
] as const;

export function DoorEntryForm({ onEntryAdded, resetRef }: DoorEntryFormProps) {
  const [coatings, setCoatings] = useState<CoatingType>({
    singleCoating: false,
    doubleCoating: false,
    doubleSagwan: false,
    laminate: false,
  });
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');

  const addDoorMutation = useAddDoor();

  const handleCoatingToggle = (key: keyof CoatingType) => {
    setCoatings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetForm = () => {
    setCoatings({
      singleCoating: false,
      doubleCoating: false,
      doubleSagwan: false,
      laminate: false,
    });
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

    const hasAnyCoating = Object.values(coatings).some((v) => v);
    if (!hasAnyCoating) {
      toast.error('Please select at least one coating type');
      return;
    }

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

    try {
      await addDoorMutation.mutateAsync({
        enteredHeight: heightResult.enteredFormat,
        enteredWidth: widthResult.enteredFormat,
        roundedHeight: BigInt(roundToNearestInch(heightResult.decimal)),
        roundedWidth: BigInt(roundToNearestInch(widthResult.decimal)),
        coatings,
      });

      // Clear form
      resetForm();

      toast.success('Door size added successfully');
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
          Enter door dimensions (supports fractions like 78 2/8) and select coating types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coating Type Multi-Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Coating Types (Select one or more)
            </Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {COATING_OPTIONS.map((option) => (
                <div
                  key={option.key}
                  className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={option.key}
                    checked={coatings[option.key]}
                    onCheckedChange={() => handleCoatingToggle(option.key)}
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor={option.key}
                    className="flex-1 cursor-pointer text-sm font-medium leading-tight"
                  >
                    {option.label}
                    <span className="block text-xs text-muted-foreground mt-1">
                      ₹{option.rate}/sq.ft
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-base font-semibold">
                Door Height (inches)
              </Label>
              <Input
                id="height"
                type="text"
                placeholder="78.25 or 78 2/8"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="h-14 text-lg"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter as decimal (78.25) or fraction (78 2/8)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="width" className="text-base font-semibold">
                Door Width (inches)
              </Label>
              <Input
                id="width"
                type="text"
                placeholder="30.25 or 30 2/8"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="h-14 text-lg"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter as decimal (30.25) or fraction (30 2/8)
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
                  Add to List
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
