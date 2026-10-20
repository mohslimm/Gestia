"use client";

import Link from "next/link";
import { ArrowLeft, Upload, FileImageIcon } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NewTicketPage({ params }: { params: { token: string } }) {
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    
    // Upload de la photo vers un bucket public si besoin, puis enregistrement en BDD
    try {
      if (file) {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `tickets/${fileName}`;

        const { error } = await supabase.storage.from('maintenance').upload(filePath, file);
        if (error) console.error("Upload error:", error);
      }
      
      alert("Demande d'intervention envoyée à votre propriétaire.");
      window.location.href = `/portal/${params.token}`;
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href={`/portal/${params.token}`} 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Signaler un problème</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Décrivez votre problème afin qu'une intervention soit planifiée.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          
          <div className="grid gap-3">
            <label htmlFor="title" className="text-sm font-medium leading-none">
              Sujet / Titre <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              name="title"
              required
              placeholder="ex: Fuite d'eau dans la salle de bain"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="grid gap-3">
            <label htmlFor="priority" className="text-sm font-medium leading-none">
              Urgence <span className="text-destructive">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              required
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="low">Faible - Peut attendre</option>
              <option value="normal" selected>Normal - Gênant mais pas bloquant</option>
              <option value="high">Haute - Très gênant</option>
              <option value="urgent">Urgent - Dégât des eaux, coupure électrique, etc.</option>
            </select>
          </div>

          <div className="grid gap-3">
            <label htmlFor="description" className="text-sm font-medium leading-none">
              Description détaillée
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Expliquez la situation..."
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            ></textarea>
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-medium leading-none">
              Photo du problème (Optionnel)
            </label>
            <div className="border border-dashed border-input rounded-md flex flex-col items-center justify-center p-6 bg-muted/20">
              {!file ? (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Cliquer pour ajouter une image</p>
                  <input
                    type="file"
                    id="photo_upload"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label 
                    htmlFor="photo_upload" 
                    className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors border bg-background hover:bg-accent h-8 px-3"
                  >
                    Parcourir
                  </label>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <FileImageIcon className="h-10 w-10 text-primary mb-2" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-destructive mt-2 hover:underline"
                  >
                    Retirer la photo
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t pt-6 mt-2">
            <button 
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 disabled:opacity-50"
            >
              {submitting ? "Envoi..." : "Envoyer la demande"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
