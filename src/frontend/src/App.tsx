import { useState, useRef } from 'react';
import { DoorEntryForm } from './components/DoorEntryForm';
import { DoorEntryList } from './components/DoorEntryList';
import { CustomerInfoForm } from './components/CustomerInfoForm';
import { QuotationActions } from './components/QuotationActions';
import { GrandTotals } from './components/GrandTotals';
import { ThemeToggle } from './components/ThemeToggle';
import { Ruler } from 'lucide-react';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const formResetRef = useRef<(() => void) | undefined>(undefined);

  const handleEntryChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleQuotationGenerated = () => {
    // Clear customer information
    setCustomerName('');
    setCustomerMobile('');
    
    // Trigger form reset after quotation is generated and entries are cleared
    if (formResetRef.current) {
      formResetRef.current();
    }
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Ruler className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Door Quotation System</h1>
              <p className="text-xs text-muted-foreground">Professional Coating Services</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Customer Info */}
          <CustomerInfoForm
            customerName={customerName}
            customerMobile={customerMobile}
            onCustomerNameChange={setCustomerName}
            onCustomerMobileChange={setCustomerMobile}
          />

          {/* Door Entry Form */}
          <DoorEntryForm onEntryAdded={handleEntryChange} resetRef={formResetRef} />

          {/* Door Entry List */}
          <DoorEntryList refreshTrigger={refreshTrigger} onEntryDeleted={handleEntryChange} />

          {/* Grand Totals */}
          <GrandTotals refreshTrigger={refreshTrigger} />

          {/* Quotation Actions */}
          <QuotationActions
            customerName={customerName}
            customerMobile={customerMobile}
            refreshTrigger={refreshTrigger}
            onQuotationGenerated={handleQuotationGenerated}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Door Quotation System. Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
