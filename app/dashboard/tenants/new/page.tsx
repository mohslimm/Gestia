import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default function NewTenantPage({
  searchParams,
}: {
  searchParams: { unit_id?: string };
}) {
  const unitId = searchParams.unit_id;

  async function createTenant(formData: FormData) {
    "use server";
    console.log("Create tenant", formData.get("full_name"));
    redirect(unitId ? `/dashboard/units/${unitId}` : "/dashboard/tenants");
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href={unitId ? `/dashboard/units/${unitId}` : "/dashboard/tenants"} 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Retour</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajouter un locataire</h1>
          <p className="text-muted-foreground mt-1">
            Renseignez les coordonnées du locataire pour pouvoir lui créer un bail et ouvrir son accès portail.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <form action={createTenant} className="flex flex-col gap-6">
            <input type="hidden" name="unit_id" value={unitId || ""} />

            <div className="grid gap-3">
              <label htmlFor="full_name" className="text-sm font-medium leading-none">
                Nom complet <span className="text-destructive">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                required
                placeholder="ex: Marie Curie"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="marie@email.com"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-3">
                <label htmlFor="phone" className="text-sm font-medium leading-none">
                  Téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t pt-6 mt-2">
              <Link 
                href={unitId ? `/dashboard/units/${unitId}` : "/dashboard/tenants"} 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Annuler
              </Link>
              <button 
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                Enregistrer le locataire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
