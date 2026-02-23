import { CustomerInfoForm } from "./components/CustomerInfoForm";
import { DoorEntryForm } from "./components/DoorEntryForm";
import { DoorEntryList } from "./components/DoorEntryList";
import { GrandTotals } from "./components/GrandTotals";
import { QuotationActions } from "./components/QuotationActions";
import { ThemeToggle } from "./components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { useState, useRef } from "react";

function App() {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const formResetRef = useRef<(() => void) | undefined>(undefined);

  const handleClearAll = () => {
    setCustomerName("");
    setCustomerMobile("");
    if (formResetRef.current) {
      formResetRef.current();
    }
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEntryChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Door Quotation System
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <CustomerInfoForm
          customerName={customerName}
          customerMobile={customerMobile}
          onCustomerNameChange={setCustomerName}
          onCustomerMobileChange={setCustomerMobile}
        />

        <DoorEntryForm onEntryAdded={handleEntryChange} resetRef={formResetRef} />

        <DoorEntryList refreshTrigger={refreshTrigger} onEntryDeleted={handleEntryChange} />

        <GrandTotals refreshTrigger={refreshTrigger} />

        <QuotationActions
          customerName={customerName}
          customerMobile={customerMobile}
          onClearAll={handleClearAll}
        />
      </main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Door Quotation System. Built with ❤️
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

export default App;
