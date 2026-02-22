import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useAddDoorEntry } from '../hooks/useQueries';
import { toast } from 'sonner';

interface DoorEntryFormProps {
  onEntryAdded: () => void;
}

export function DoorEntryForm({ onEntryAdded }: DoorEntryFormProps) {
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [rate, setRate] = useState('185');

  const addDoorEntryMutation = useAddDoorEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const heightNum = parseFloat(height);
    const widthNum = parseFloat(width);
    const rateNum = parseFloat(rate);

    if (isNaN(heightNum) || heightNum <= 0) {
      toast.error('Please enter a valid door height');
      return;
    }

    if (isNaN(widthNum) || widthNum <= 0) {
      toast.error('Please enter a valid door width');
      return;
    }

    if (isNaN(rateNum) || rateNum <= 0) {
      toast.error('Please enter a valid rate per sq.ft');
      return;
    }

    try {
      await addDoorEntryMutation.mutateAsync({
        height: heightNum,
        width: widthNum,
        rate: rateNum,
      });

      // Clear form
      setHeight('');
      setWidth('');
      setRate('185');

      toast.success('Door entry added successfully');
      onEntryAdded();
    } catch (error) {
      toast.error('Failed to add door entry');
      console.error('Error adding door entry:', error);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Add New Door Entry</CardTitle>
        <CardDescription>
          Enter door dimensions and rate to calculate quotation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium">
                Door Height (inches)
              </Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                placeholder="78.25"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="width" className="text-sm font-medium">
                Door Width (inches)
              </Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                placeholder="30.25"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate" className="text-sm font-medium">
                Rate per Sq.Ft ($)
              </Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                placeholder="185"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="text-base"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={addDoorEntryMutation.isPending}
          >
            {addDoorEntryMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Door Entry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
