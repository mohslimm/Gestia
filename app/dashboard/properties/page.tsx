import Link from "next/link";
import { Plus, Building2, MapPin } from "lucide-react";

// Types stub (to be replaced by Supabase generated types)
type Property = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  units_count?: number; // Computed
};

export default async function PropertiesPage() {
  // Stub data instead of fetching from Supabase for MVP UI
  const properties: Property[] = [
    { id: "1", name: "Le Clos des Vignes", address: "12 rue des Vignes", city: "Bordeaux", units_count: 4 },
    { id: "2", name: "Résidence Horizon", address: "45 avenue de la Mer", city: "Marseille", units_count: 10 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propriétés</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos immeubles et visualisez l'ensemble de votre parc locatif.
          </p>
        </div>
        <Link 
          href="/dashboard/properties/new" 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter une propriété
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 mt-8 border rounded-xl border-dashed bg-muted/10">
          <Building2 className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Aucune propriété</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
            Vous n'avez pas encore ajouté de propriété. Commencez par créer votre premier immeuble pour y ajouter des unités.
          </p>
          <Link 
            href="/dashboard/properties/new" 
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une propriété
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link key={property.id} href={`/dashboard/properties/${property.id}`}>
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:border-primary/50 transition-colors h-full flex flex-col cursor-pointer">
                <div className="p-6 flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground">
                      {property.units_count} unité(s)
                    </span>
                  </div>
                  <h3 className="font-semibold leading-none tracking-tight text-lg">
                    {property.name}
                  </h3>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{property.address}<br/>{property.city}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
