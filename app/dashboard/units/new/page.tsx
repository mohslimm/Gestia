import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default function NewUnitPage({
  searchParams,
}: {
  searchParams: { property_id?: string };
}) {
  const propertyId = searchParams.property_id;

  async function createUnit(formData: FormData) {
    "use server";
    // Stub
    const propId = formData.get("property_id");
    console.log("Create unit", formData.get("unit_number"));
    redirect(`/dashboard/properties/${propId}`);
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href={propertyId ? `/dashboard/properties/${propertyId}` : "/dashboard/properties"} 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Retour</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajouter une unité</h1>
          <p className="text-muted-foreground mt-1">
            Définissez les caractéristiques (loyer, surface, etc.) de ce nouveau bien.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <form action={createUnit} className="flex flex-col gap-6">
            {/* Hidden field for property references */}
            <input type="hidden" name="property_id" value={propertyId || ""} />

            {!propertyId && (
              <div className="grid gap-3">
                <label className="text-sm font-medium text-destructive">
                  Attention : Aucun property_id fourni. Veuillez sélectionner une propriété d'abord.
                </label>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <label htmlFor="unit_number" className="text-sm font-medium leading-none">
                  Numéro/Nom (ex: Apt 1) <span className="text-destructive">*</span>
                </label>
                <input
                  id="unit_number"
                  name="unit_number"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-3">
                <label htmlFor="floor" className="text-sm font-medium leading-none">
                  Étage
                </label>
                <input
                  id="floor"
                  name="floor"
                  placeholder="ex: RDC, 1er..."
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <label htmlFor="monthly_rent" className="text-sm font-medium leading-none">
                  Loyer mensuel prévu (€) <span className="text-destructive">*</span>
                </label>
                <input
                  id="monthly_rent"
                  name="monthly_rent"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-3">
                <label htmlFor="area_sqft" className="text-sm font-medium leading-none">
                  Surface (m²)
                </label>
                <input
                  id="area_sqft"
                  name="area_sqft"
                  type="number"
                  min="0"
                  step="0.1"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <label htmlFor="bedrooms" className="text-sm font-medium leading-none">
                  Chambres
                </label>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="0"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-3">
                <label htmlFor="bathrooms" className="text-sm font-medium leading-none">
                  Salles de bain
                </label>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t pt-6 mt-2">
              <Link 
                href={propertyId ? `/dashboard/properties/${propertyId}` : "/dashboard/properties"} 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Annuler
              </Link>
              <button 
                type="submit"
                disabled={!propertyId}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 disabled:opacity-50"
              >
                Créer l'unité
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
