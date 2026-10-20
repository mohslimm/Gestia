import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPropertyPage() {
  async function createProperty(formData: FormData) {
    "use server";
    // Stub function: This is where Supabase insert will happen
    console.log("Creating property", formData.get("name"));
    redirect("/dashboard/properties");
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/properties" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Retour</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajouter une propriété</h1>
          <p className="text-muted-foreground mt-1">
            Saisissez les informations de votre nouvel immeuble ou propriété.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <form action={createProperty} className="flex flex-col gap-6">
            <div className="grid gap-3">
              <label htmlFor="name" className="text-sm font-medium leading-none">
                Nom de la propriété <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="ex: Le Clos des Vignes"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <div className="grid gap-3">
              <label htmlFor="address" className="text-sm font-medium leading-none">
                Adresse complète
              </label>
              <input
                id="address"
                name="address"
                placeholder="12 rue des Vignes"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <label htmlFor="postal_code" className="text-sm font-medium leading-none">
                  Code postal
                </label>
                <input
                  id="postal_code"
                  name="postal_code"
                  placeholder="33000"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid gap-3">
                <label htmlFor="city" className="text-sm font-medium leading-none">
                  Ville
                </label>
                <input
                  id="city"
                  name="city"
                  placeholder="Bordeaux"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid gap-3">
              <label htmlFor="country" className="text-sm font-medium leading-none">
                Pays
              </label>
              <input
                id="country"
                name="country"
                defaultValue="France"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-end gap-4 border-t pt-6 mt-2">
              <Link 
                href="/dashboard/properties"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Annuler
              </Link>
              <button 
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                Créer la propriété
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
