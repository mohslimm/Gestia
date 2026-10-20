import Link from "next/link";
import { FileText, Wrench, Download, AlertCircle, Calendar } from "lucide-react";

export default function PortalDashboardPage({ params }: { params: { token: string } }) {
  // Stub tenant data based on token
  const tenant = {
    full_name: "Alice Martin",
    unit: "Apt 2 - Le Clos des Vignes",
    lease_end: "2025-01-01",
    monthly_rent: 800,
  };

  const receipts = [
    { id: "1", date: "Mai 2024", amount: 800, url: "#" },
    { id: "2", date: "Avril 2024", amount: 800, url: "#" },
    { id: "3", date: "Mars 2024", amount: 800, url: "#" },
  ];

  const tickets = [
    { id: "1", title: "Fuite sous l'évier", status: "open", date: "2024-05-10" }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bonjour, {tenant.full_name}</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenue sur votre portail locataire. Retrouvez ici toutes les informations de votre location.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Résumé du bail */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 font-semibold text-lg text-primary border-b pb-4">
            <Calendar className="h-5 w-5" /> Mon Bail
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Logement :</span>
              <span className="font-medium text-right">{tenant.unit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Loyer / mois :</span>
              <span className="font-bold text-lg">{tenant.monthly_rent} €</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date de fin prévue :</span>
              <span className="font-medium">{tenant.lease_end}</span>
            </div>
          </div>
        </div>

        {/* Support & Maintenance */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2 font-semibold text-lg text-amber-600">
              <AlertCircle className="h-5 w-5" /> Maintenance
            </div>
            <Link 
              href={`/portal/${params.token}/tickets/new`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-8 px-3"
            >
              Signaler un problème
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {tickets.length > 0 ? (
              tickets.map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between text-sm p-3 border rounded-lg bg-muted/20">
                  <div className="flex flex-col">
                    <span className="font-medium">{ticket.title}</span>
                    <span className="text-xs text-muted-foreground">{ticket.date}</span>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ticket.status === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    {ticket.status === 'open' ? 'En cours' : 'Résolu'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Aucun signalement en cours.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quittances et Documents */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Mes Quittances de Loyer
          </h2>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Mois</th>
                <th className="px-6 py-3 font-medium">Montant</th>
                <th className="px-6 py-3 text-right font-medium">Document</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium">{receipt.date}</td>
                  <td className="px-6 py-4">{receipt.amount} €</td>
                  <td className="px-6 py-4 text-right">
                    <a href={receipt.url} className="inline-flex items-center justify-center gap-1 text-primary hover:underline font-medium text-xs">
                      <Download className="h-4 w-4" /> Télécharger
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
