import Link from "next/link";
import { ReactNode } from "react";
import { Home, Users, Wallet, Wrench, FileText, Settings, BarChart, Mic } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
            Gestia
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid gap-1 px-4">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground transition-all hover:bg-accent">
                <Home className="h-4 w-4" />
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link href="/dashboard/voice-concierge" className="flex items-center justify-between rounded-lg px-3 py-2 text-amber-500 font-semibold bg-amber-500/10 border border-amber-500/30 transition-all hover:bg-amber-500/20">
                <div className="flex items-center gap-3">
                  <Mic className="h-4 w-4 text-amber-500 animate-pulse" />
                  Voice Concierge
                </div>
                <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-slate-950">AI</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/properties" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
                <Home className="h-4 w-4" />
                Propriétés & Unités
              </Link>
            </li>
            <li>
              <Link href="/dashboard/tenants" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
                <Users className="h-4 w-4" />
                Locataires
              </Link>
            </li>
            <li>
              <Link href="/dashboard/payments" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
                <Wallet className="h-4 w-4" />
                Loyers & Paiements
              </Link>
            </li>
            <li>
              <Link href="/dashboard/tickets" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
                <Wrench className="h-4 w-4" />
                Maintenance
              </Link>
            </li>
            <li>
              <Link href="/dashboard/documents" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
                <FileText className="h-4 w-4" />
                Coffre-fort
              </Link>
            </li>
            <li>
              <Link href="/dashboard/reports" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
                <BarChart className="h-4 w-4" />
                Rapports IA
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t p-4">
          <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
            <Settings className="h-4 w-4" />
            Paramètres
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Tableau de bord</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">Propriétaire</div>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              P
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
