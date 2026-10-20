"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [currentPlan, setCurrentPlan] = useState("starter"); // 'starter' | 'pro' | 'investor'
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: string) => {
    setLoading(true);
    // STUB: Create Stripe checkout session
    // const res = await fetch('/api/stripe/checkout', { method: 'POST', body: JSON.stringify({ plan }) });
    // const { url } = await res.json();
    // window.location.href = url;
    
    // Simulate API delay
    setTimeout(() => {
      alert(`Redirection vers Stripe Checkout pour le plan ${plan.toUpperCase()}...`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres & Abonnement</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations personnelles et votre abonnement Gestia.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Mon profil</h2>
        </div>
        <div className="p-6 grid gap-4 max-w-xl">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Nom complet</label>
            <input 
              readOnly 
              value="Propriétaire Demo" 
              className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm" 
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <input 
              readOnly 
              value="proprio@example.com" 
              className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm" 
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Plans & Facturation</h2>
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Starter Plan */}
          <div className={`rounded-xl border shadow-sm flex flex-col ${currentPlan === 'starter' ? 'border-primary shadow-md ring-1 ring-primary' : 'bg-card'}`}>
            <div className="p-6 flex-1">
              <h3 className="text-xl font-bold">Starter</h3>
              <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                29$ <span className="ml-1 text-xl font-medium text-muted-foreground">/mois</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Pour les petits propriétaires indépendants.</p>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Jusqu'à 3 unités</li>
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Suivi des loyers</li>
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Portail locataire basique</li>
              </ul>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <button disabled className="w-full text-sm font-medium h-10 rounded-md bg-secondary text-secondary-foreground border">
                Plan Actuel
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className={`rounded-xl border shadow-sm flex flex-col ${currentPlan === 'pro' ? 'border-primary shadow-md ring-1 ring-primary' : 'bg-card'}`}>
            <div className="p-6 flex-1">
              <h3 className="text-xl font-bold text-primary">Pro</h3>
              <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                59$ <span className="ml-1 text-xl font-medium text-muted-foreground">/mois</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Pour gérer un parc immobilier en croissance.</p>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Jusqu'à 10 unités</li>
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Toutes les features Starter</li>
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Automations n8n (Rappels SMS/Email)</li>
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Extraction IA des Baux</li>
              </ul>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <button 
                onClick={() => handleSubscribe('pro')}
                disabled={loading}
                className="w-full text-sm font-medium h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Passer en Pro
              </button>
            </div>
          </div>

          {/* Investor Plan */}
          <div className={`rounded-xl border shadow-sm flex flex-col ${currentPlan === 'investor' ? 'border-primary shadow-md ring-1 ring-primary' : 'bg-card'}`}>
            <div className="p-6 flex-1">
              <h3 className="text-xl font-bold">Investor</h3>
              <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                99$ <span className="ml-1 text-xl font-medium text-muted-foreground">/mois</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Pour les professionnels et investisseurs.</p>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Unités illimitées</li>
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Toutes les features Pro</li>
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Rapports analytiques IA mensuels</li>
                <li className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />Support prioritaire</li>
              </ul>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <button 
                onClick={() => handleSubscribe('investor')}
                disabled={loading}
                className="w-full text-sm font-medium h-10 rounded-md border border-primary text-primary hover:bg-primary/5"
              >
                Passer en Investor
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
