
import { useState } from "react";
import { CalendarDays, Server, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function App() {
  const [status, setStatus] = useState("Belum diuji");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  async function checkAPI() {
    setLoading(true);
    setConnected(false);

    try {
      const response = await fetch("/api/health");

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("API unavailable");
      }

      setStatus(data.message);
      setConnected(true);
    } catch {
      setStatus("Backend gagal terhubung");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-primary p-3 text-primary-foreground">
              <CalendarDays size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Personal Planner
              </h1>

              <p className="text-sm text-muted-foreground">
                Development setup
              </p>
            </div>
          </div>

          <CardTitle>Phase 0</CardTitle>

          <CardDescription>
            Project initialization and connection test.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="text-green-600" size={18} />
            React + Vite
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="text-green-600" size={18} />
            Tailwind CSS
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="text-green-600" size={18} />
            shadcn/ui
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="text-green-600" size={18} />
            Lucide Icons
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Server size={18} />
              <span className="font-medium">Backend API</span>
            </div>

            <p className={`text-sm ${
              connected
                ? "text-green-600"
                : "text-muted-foreground"
            }`}>
              {status}
            </p>
          </div>

          <Button
            className="w-full"
            onClick={checkAPI}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Test Connection"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
