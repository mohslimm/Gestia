import Link from "next/link";
import { ArrowLeft, User, FileText, Wrench } from "lucide-react";

export default function UnitDetailsPage({ params }: { params: { id: string } }) {
  // Stub
  const unit = {
    id: params.id,
    unit_number: "Apt 2",
    property_id: "prop1",
    property_name: "Le Clos des Vignes",
    floor: "1er",
    area_sqft: 45.5,
    monthly_rent: 800,
    status: "occupied", // 'vacant' | 'occupied' | 'maintenance'
  };

  const currentTenant = {
    id: "t1",
    full_name: "Alice Martin",
    email: "alice@example.com",
    phone: "06 12 34 56 78"
  };

  const currentLease = {
    id: "l1",
    start_date: "2024-01-01",
    end_date: "2025-01-01",
    monthly_rent: 800,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href={`/dashboard/properties/${unit.property_id}`} 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Unité : {unit.unit_number}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm">
              <span>{unit.property_name}</span>
              <span>•</span>
              <span>Étage {unit.floor}</span>
              <span>•</span>
              <span>{unit.area_sqft} m²</span>
            </div>
          </div>
        </div>
        <div>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${unit.status === 'occupied' ? 'bg-green-100 text-green-800 border-transparent dark:bg-green-900/30 dark:text-green-400' : 'bg-secondary text-secondary-foreground border-transparent'}`}>
            {unit.status === 'occupied' ? 'Occupé' : 'Vacant'}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Locataire actuel */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 font-semibold">
              <User className="h-5 w-5 text-primary" />
              <h3>Locataire Actuel</h3>
            </div>
            
            {currentTenant ? (
              <div className="grid gap-2 text-sm">
                <div className="font-medium text-base">{currentTenant.full_name}</div>
                <div className="text-muted-foreground">{currentTenant.email}</div>
                <div className="text-muted-foreground">{currentTenant.phone}</div>
                <div className="mt-2 pt-4 border-t">
                  <Link href={`/dashboard/tenants/${currentTenant.id}`} className="text-primary hover:underline text-sm font-medium">
                    Voir la fiche locataire &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground flex flex-col gap-3">
                <p>Aucun locataire assigné à cette unité.</p>
                <Link 
                  href={`/dashboard/tenants/new?unit_id=${unit.id}`}
                  className="inline-flex w-fit items-center justify-center rounded-md text-sm font-medium border px-4 py-2 hover:bg-accent"
                >
                  Ajouter un locataire
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bail en cours */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 font-semibold">
              <FileText className="h-5 w-5 text-primary" />
              <h3>Bail Actif</h3>
            </div>
            
            {currentLease ? (
              <div className="grid gap-2 text-sm grid-cols-2">
                <div className="text-muted-foreground">Début</div>
                <div className="font-medium text-right">{currentLease.start_date}</div>
                <div className="text-muted-foreground">Fin</div>
                <div className="font-medium text-right">{currentLease.end_date}</div>
                <div className="text-muted-foreground">Loyer charges comprises</div>
                <div className="font-medium text-right">{currentLease.monthly_rent} €</div>
                <div className="col-span-2 mt-2 pt-4 border-t">
                  <Link href={`/dashboard/leases/${currentLease.id}`} className="text-primary hover:underline text-sm font-medium">
                    Consulter le bail &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground flex flex-col gap-3">
                <p>Aucun bail actif pour cette unité.</p>
                <Link 
                  href={`/dashboard/leases/new?unit_id=${unit.id}`}
                  className="inline-flex w-fit items-center justify-center rounded-md text-sm font-medium border px-4 py-2 hover:bg-accent"
                >
                  Créer un bail
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tickets liés */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wrench className="h-5 w-5" /> Tickets de maintenance récents
        </h2>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-8 text-center text-muted-foreground text-sm">
            Aucun ticket de maintenance pour cette unité.
          </div>
        </div>
      </div>
    </div>
  );
}
