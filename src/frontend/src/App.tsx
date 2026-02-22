import { useState } from 'react';
import { DoorEntryForm } from './components/DoorEntryForm';
import { DoorEntryList } from './components/DoorEntryList';
import { GrandTotals } from './components/GrandTotals';
import { Ruler } from 'lucide-react';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEntryChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Ruler className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Door Measurement & Quotation
              </h1>
              <p className="text-sm text-muted-foreground">
                Professional door sizing and cost calculator
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Input Form Section */}
          <section>
            <DoorEntryForm onEntryAdded={handleEntryChange} />
          </section>

          {/* Door Entries List Section */}
          <section>
            <DoorEntryList
              refreshTrigger={refreshTrigger}
              onEntryDeleted={handleEntryChange}
            />
          </section>

          {/* Grand Totals Section */}
          <section>
            <GrandTotals refreshTrigger={refreshTrigger} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Door Measurement App · Built with ❤️ using{' '}
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
