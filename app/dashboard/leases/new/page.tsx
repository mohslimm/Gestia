"use client";

import Link from "next/link";
import { ArrowLeft, Upload, File as FileIcon } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NewLeasePage({
  searchParams,
}: {
  searchParams: { unit_id?: string };
}) {
  const unitId = searchParams.unit_id;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function createLease(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);

    const formData = new FormData(event.currentTarget);
    const tenant_id = formData.get("tenant_id");
    const start_date = formData.get("start_date");
    const end_date = formData.get("end_date");
    const monthly_rent = formData.get("monthly_rent");
    const deposit = formData.get("deposit");

    let pdf_url = null;

    try {
      if (file) {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${unitId}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('leases') // Ensure this bucket exists in Supabase!
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('leases')
          .getPublicUrl(filePath);
          
        pdf_url = publicUrl;
      }

      // Next: Call your API to insert lease into DB
      // const res = await fetch('/api/leases', { ... })
      
      alert(pdf_url ? "Bail enregistré avec PDF !" : "Bail enregistré !");
      window.location.href = `/dashboard/units/${unitId}`;
      
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'upload du fichier");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href={unitId ? `/dashboard/units/${unitId}` : "/dashboard/properties"} 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Retour</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Créer un bail</h1>
          <p className="text-muted-foreground mt-1">
            Liez un locataire à l'unité, définissez les dates et uploadez le document signé.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <form onSubmit={createLease} className="flex flex-col gap-6">
            <input type="hidden" name="unit_id" value={unitId || ""} />

            {!unitId && (
              <div className="grid gap-3 p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20 text-sm">
                Attention : Aucun unit_id fourni.
              </div>
            )}

            <div className="grid gap-3">
              <label htmlFor="tenant_id" className="text-sm font-medium leading-none">
                Locataire <span className="text-destructive">*</span>
              </label>
              <select
                id="tenant_id"
                name="tenant_id"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Sélectionnez un locataire existant</option>
                {/* STUB: En réalité, mapper les locataires depuis Supabase */}
                <option value="t1">Alice Martin (alice@example.com)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <label htmlFor="start_date" className="text-sm font-medium leading-none">
                  Date de début <span className="text-destructive">*</span>
                </label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-3">
                <label htmlFor="end_date" className="text-sm font-medium leading-none">
                  Date de fin prévue <span className="text-destructive">*</span>
                </label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <label htmlFor="monthly_rent" className="text-sm font-medium leading-none">
                  Loyer (Charges Comprises) <span className="text-destructive">*</span>
                </label>
                <input
                  id="monthly_rent"
                  name="monthly_rent"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={800} // Default based on unit usually
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-3">
                <label htmlFor="deposit" className="text-sm font-medium leading-none">
                  Dépôt de garantie
                </label>
                <input
                  id="deposit"
                  name="deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="grid gap-3 mt-4 border-t pt-4">
              <label className="text-sm font-medium leading-none">
                Contrat de bail scanné (PDF)
              </label>
              
              <div className="border border-dashed border-input rounded-md flex flex-col items-center justify-center p-6 bg-muted/20">
                {!file ? (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium mb-1">Sélectionnez un fichier PDF</p>
                    <p className="text-xs text-muted-foreground mb-4">Max 10 MB</p>
                    <input
                      type="file"
                      id="pdf_upload"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label 
                      htmlFor="pdf_upload" 
                      className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    >
                      Parcourir les fichiers
                    </label>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <FileIcon className="h-10 w-10 text-primary mb-2" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-xs text-destructive mt-2 hover:underline"
                    >
                      Retirer le fichier
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t pt-6 mt-2">
              <Link 
                href={unitId ? `/dashboard/units/${unitId}` : "/dashboard/properties"} 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Annuler
              </Link>
              <button 
                type="submit"
                disabled={!unitId || uploading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 disabled:opacity-50"
              >
                {uploading ? "Création & Upload en cours..." : "Enregistrer le bail"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
