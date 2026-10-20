import Link from "next/link";
import { Plus, Search, Users } from "lucide-react";

export default function TenantsPage() {
  const tenants = [
    { id: "1", full_name: "Alice Martin", email: "alice@example.com", phone: "06 12 34 56 78", unit: "Le Clos des Vignes - Apt 2", active: true },
    { id: "2", full_name: "Bob Dupont", email: "bob@example.com", phone: "06 98 76 54 32", unit: "Résidence Horizon - RDC", active: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locataires</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre base de locataires et leurs accès au portail.
          </p>
        </div>
        <Link 
          href="/dashboard/tenants/new" 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau locataire
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher un nom, email..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom complet</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Unité Actuelle</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {tenants.map(tenant => (
              <tr key={tenant.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle font-medium flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center text-primary font-bold text-xs">
                    {tenant.full_name.substring(0,2).toUpperCase()}
                  </div>
                  {tenant.full_name}
                </td>
                <td className="p-4 align-middle">
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span>{tenant.email}</span>
                    <span>{tenant.phone}</span>
                  </div>
                </td>
                <td className="p-4 align-middle">{tenant.unit}</td>
                <td className="p-4 align-middle">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tenant.active ? 'bg-green-100 text-green-800 border-transparent dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                    {tenant.active ? 'Actif' : 'Ancien'}
                  </span>
                </td>
                <td className="p-4 align-middle text-right gap-2">
                  <Link 
                    href={`/dashboard/tenants/${tenant.id}`}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:text-primary underline underline-offset-4"
                  >
                    Détails
                  </Link>
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr>
                <td colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucun locataire trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
