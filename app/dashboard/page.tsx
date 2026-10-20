import { Home, Users, Wallet, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bonjour !</h1>
        <p className="text-muted-foreground mt-2">
          Voici le résumé de votre activité de gestion locative.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Revenus mensuels</h3>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">0 €</div>
          <p className="text-xs text-muted-foreground mt-1">
            +0% par rapport au mois dernier
          </p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Occupation</h3>
            <Home className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">0/0</div>
          <p className="text-xs text-muted-foreground mt-1">
            Unités louées
          </p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Retards de paiement</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-destructive">0</div>
          <p className="text-xs text-muted-foreground mt-1">
            À relancer d'urgence
          </p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Tickets en cours</h3>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-amber-500">0</div>
          <p className="text-xs text-muted-foreground mt-1">
            0 urgent(s)
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold leading-none tracking-tight">Paiements Récents</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Aucun paiement reçu récemment.
          </div>
        </div>
        <div className="col-span-3 rounded-xl border bg-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold leading-none tracking-tight">Alertes urgentes</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Tout est en ordre.
          </div>
        </div>
      </div>
    </div>
  );
}
