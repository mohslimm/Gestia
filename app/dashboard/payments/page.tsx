"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([
    { id: "1", tenant: "Alice Martin", unit: "Apt 2", due_date: "2024-05-01", amount: 800, status: "pending" },
    { id: "2", tenant: "Bob Dupont", unit: "RDC", due_date: "2024-05-01", amount: 650, status: "paid" },
    { id: "3", tenant: "Charlie", unit: "Apt 1", due_date: "2024-04-01", amount: 700, status: "late" },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements & Loyers</h1>
          <p className="text-muted-foreground mt-1">
            Suivez l'état des encaissements et mettez à jour les statuts manuellement.
          </p>
        </div>
        <button 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        >
          Générer les loyers du mois
        </button>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Locataire</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Unité</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Échéance</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Montant</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {payments.map(payment => (
              <tr key={payment.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle font-medium">{payment.tenant}</td>
                <td className="p-4 align-middle text-muted-foreground">{payment.unit}</td>
                <td className="p-4 align-middle">{payment.due_date}</td>
                <td className="p-4 align-middle">{payment.amount} €</td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    {payment.status === 'paid' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {payment.status === 'pending' && <Clock className="h-4 w-4 text-amber-500" />}
                    {payment.status === 'late' && <AlertCircle className="h-4 w-4 text-destructive" />}
                    <select 
                      value={payment.status}
                      onChange={(e) => updateStatus(payment.id, e.target.value)}
                      className="h-8 rounded-md border border-input bg-transparent px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="pending">En attente</option>
                      <option value="paid">Payé</option>
                      <option value="late">En retard</option>
                      <option value="partial">Partiel</option>
                    </select>
                  </div>
                </td>
                <td className="p-4 align-middle text-right">
                  <button className="text-xs font-medium text-primary hover:underline">
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
