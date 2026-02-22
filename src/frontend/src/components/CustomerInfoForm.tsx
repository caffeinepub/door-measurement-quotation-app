import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone } from 'lucide-react';

interface CustomerInfoFormProps {
  customerName: string;
  customerMobile: string;
  onCustomerNameChange: (value: string) => void;
  onCustomerMobileChange: (value: string) => void;
}

export function CustomerInfoForm({
  customerName,
  customerMobile,
  onCustomerNameChange,
  onCustomerMobileChange,
}: CustomerInfoFormProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Customer Information</CardTitle>
        <CardDescription className="text-base">
          Enter customer details for the quotation (optional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-base font-semibold">
              Customer Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="customerName"
                type="text"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => onCustomerNameChange(e.target.value)}
                className="h-14 text-lg pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerMobile" className="text-base font-semibold">
              Mobile Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="customerMobile"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={customerMobile}
                onChange={(e) => onCustomerMobileChange(e.target.value)}
                className="h-14 text-lg pl-11"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
