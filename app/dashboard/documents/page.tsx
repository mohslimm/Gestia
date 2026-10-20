"use client";

import { useState } from "react";
import { Upload, FileText, Search, Download } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function DocumentsPage() {
  const [uploading, setUploading] = useState(false);

  const documents = [
    { id: "1", name: "Bail_Alice_Martin.pdf", type: "lease", unit: "Apt 2", size: "2.4 MB", date: "2024-01-01" },
    { id: "2", name: "Assurance_Proprietaire.pdf", type: "insurance", unit: "Global", size: "1.2 MB", date: "2023-10-15" },
    { id: "3", name: "Facture_Plomberie_Mai.pdf", type: "invoice", unit: "RDC", size: "0.5 MB", date: "2024-05-02" },
  ];

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = createClient();
    
    // Process each file (MVP logic stub)
    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `documents/${fileName}`;

        // Example bucket "documents"
        // await supabase.storage.from('documents').upload(filePath, file);
        console.log("Uploaded", file.name);
      } catch (error) {
        console.error(error);
      }
    }
    
    setUploading(false);
    alert("Fichiers ajoutés !");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coffre-fort Documents</h1>
          <p className="text-muted-foreground mt-1">
            Stockez de manière sécurisée tous vos baux, assurances, factures, etc.
          </p>
        </div>
        
        <div>
          <input
            type="file"
            id="multi_upload"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label 
            htmlFor="multi_upload" 
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Upload..." : "Ajouter des documents"}
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher par nom..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <select className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <option value="all">Tous les types</option>
          <option value="lease">Bail</option>
          <option value="insurance">Assurance</option>
          <option value="invoice">Facture</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col">
            <div className="p-6 flex-1 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <FileText className="h-8 w-8 text-primary" />
                <button className="text-muted-foreground hover:text-primary transition-colors cursor-pointer p-1">
                  <Download className="h-5 w-5" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold leading-tight text-sm break-words" title={doc.name}>
                  {doc.name}
                </h3>
              </div>
              <div className="mt-auto pt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Type: <span className="capitalize">{doc.type}</span></span>
                  <span>{doc.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unité: {doc.unit}</span>
                  <span>{doc.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
