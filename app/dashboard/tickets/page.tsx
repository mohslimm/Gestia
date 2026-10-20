"use client";

import { useState } from "react";
import { Wrench, Search } from "lucide-react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([
    { id: "1", title: "Fuite sous l'évier", unit: "Apt 2", priority: "high", status: "open", date: "2024-05-10" },
    { id: "2", title: "Chauffage en panne", unit: "RDC", priority: "urgent", status: "in_progress", date: "2024-05-09", assigned_to: "Plombier Dupont" },
    { id: "3", title: "Serrure boîte aux lettres", unit: "Apt 2", priority: "low", status: "resolved", date: "2024-04-20" },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400';
      case 'high': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400';
      case 'normal': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400';
      case 'low': return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les demandes de réparation soumises par vos locataires.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher un ticket..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Titre</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Unité</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priorité</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle font-medium flex gap-2 items-center">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  {ticket.title}
                </td>
                <td className="p-4 align-middle text-muted-foreground">{ticket.unit}</td>
                <td className="p-4 align-middle">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority === 'urgent' ? 'Urgent' : ticket.priority === 'high' ? 'Haute' : ticket.priority === 'normal' ? 'Normale' : 'Basse'}
                  </span>
                </td>
                <td className="p-4 align-middle text-muted-foreground">{ticket.date}</td>
                <td className="p-4 align-middle">
                  <select 
                    value={ticket.status}
                    onChange={(e) => updateStatus(ticket.id, e.target.value)}
                    className="h-8 rounded-md border border-input bg-transparent px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="open">Ouvert</option>
                    <option value="in_progress">En cours</option>
                    <option value="resolved">Résolu</option>
                    <option value="closed">Fermé</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
