import Link from "next/link";
import { ArrowLeft, Plus, MapPin, Edit, Trash2, Home } from "lucide-react";

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  // Stub data
  const property = {
    id: params.id,
    name: "Le Clos des Vignes",
    address: "12 rue des Vignes",
    postal_code: "33000",
    city: "Bordeaux",
    country: "France"
  };

  const units = [
    { id: "u1", unit_number: "Apt 1", floor: "RDC", rent: 650, status: "occupied", bedrooms: 1 },
    { id: "u2", unit_number: "Apt 2", floor: "1er", rent: 800, status: "vacant", bedrooms: 2 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/properties" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Retour</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{property.address}, {property.postal_code} {property.city}, {property.country}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href={`/dashboard/properties/${property.id}/edit`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Link>
          <button 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-transparent hover:bg-destructive hover:text-destructive-foreground h-9 px-4 py-2"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Units Section */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Unités ({units.length})</h2>
          <Link 
            href={`/dashboard/units/new?property_id=${property.id}`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une unité
          </Link>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Numéro</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Étage</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Loyer Mensuel</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {units.map(unit => (
                <tr key={unit.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    {unit.unit_number}
                  </td>
                  <td className="p-4 align-middle">{unit.floor || "-"}</td>
                  <td className="p-4 align-middle">{unit.rent} €</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${unit.status === 'occupied' ? 'bg-green-100 text-green-800 border-transparent dark:bg-green-900/30 dark:text-green-400' : 'bg-secondary text-secondary-foreground border-transparent'}`}>
                      {unit.status === 'occupied' ? 'Occupé' : 'Vacant'}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Link 
                      href={`/dashboard/units/${unit.id}`}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:text-primary underline underline-offset-4"
                    >
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {units.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Aucune unité dans cette propriété pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
