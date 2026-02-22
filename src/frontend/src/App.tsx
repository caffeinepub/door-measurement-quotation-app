import { useState, useEffect, useRef } from 'react';
import { DoorEntryForm } from './components/DoorEntryForm';
import { DoorEntryList } from './components/DoorEntryList';
import { CustomerInfoForm } from './components/CustomerInfoForm';
import { QuotationActions } from './components/QuotationActions';
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
    // Trigger form reset after quotation is generated and entries are cleared
    if (formResetRef.current) {
      formResetRef.current();
    }
    handleEntryChange();
  };

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary">
                <Ruler className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Door Quotation Pro
                </h1>
                <p className="text-sm text-muted-foreground">
                  Coating & Laminate Edition
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Customer Information Section */}
          <section>
            <CustomerInfoForm
              customerName={customerName}
              customerMobile={customerMobile}
              onCustomerNameChange={setCustomerName}
              onCustomerMobileChange={setCustomerMobile}
            />
          </section>

          {/* Input Form Section */}
          <section>
            <DoorEntryForm 
              onEntryAdded={handleEntryChange}
              resetRef={formResetRef}
            />
          </section>

          {/* Door Entries List Section */}
          <section>
            <DoorEntryList
              refreshTrigger={refreshTrigger}
              onEntryDeleted={handleEntryChange}
            />
          </section>

          {/* Quotation Actions Section */}
          <section>
            <QuotationActions
              customerName={customerName}
              customerMobile={customerMobile}
              refreshTrigger={refreshTrigger}
              onQuotationGenerated={handleQuotationGenerated}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Door Quotation Pro · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
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
