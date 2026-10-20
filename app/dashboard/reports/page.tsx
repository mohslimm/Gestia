import { FileText, Sparkles, Download } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { id: "1", period: "Novembre 2024", total_revenue: 4500, occupancy_rate: 95, date: "2024-12-01" },
    { id: "2", period: "Octobre 2024", total_revenue: 4200, occupancy_rate: 92, date: "2024-11-01" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports IA</h1>
          <p className="text-muted-foreground mt-1">
            Découvrez l'analyse mensuelle de vos performances générée par OpenAI.
          </p>
        </div>
        <button 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          <Sparkles className="h-4 w-4" />
          Générer manuellement
        </button>
      </div>

      <div className="grid gap-6">
        {reports.map((report, idx) => (
          <div key={report.id} className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col md:flex-row gap-6 p-6">
            <div className="md:w-1/3 flex flex-col gap-4 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6">
              <div className="flex items-center gap-2 text-primary">
                <FileText className="h-6 w-6" />
                <h2 className="text-xl font-bold">{report.period}</h2>
              </div>
              
              <div className="grid gap-2 text-sm mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenus perçus:</span>
                  <span className="font-semibold">{report.total_revenue} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux d'occupation:</span>
                  <span className="font-semibold">{report.occupancy_rate} %</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Généré le:</span>
                  <span>{report.date}</span>
                </div>
              </div>

              <button className="mt-auto inline-flex items-center justify-center gap-2 rounded-md border border-input bg-transparent py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors w-full">
                <Download className="h-4 w-4" />
                Exporter en PDF
              </button>
            </div>

            <div className="md:w-2/3 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="font-semibold">Synthèse de l'IA</h3>
              </div>
              <div className="prose prose-sm dark:prose-invert text-muted-foreground bg-muted/20 p-4 rounded-lg flex-1">
                <p>
                  Le mois de {report.period} a été très positif pour l'ensemble de votre parc locatif. 
                  Grâce à l'arrivée d'un nouveau locataire dans <em>Le Clos des Vignes (Apt 2)</em>, votre taux d'occupation a atteint les {report.occupancy_rate}%.
                </p>
                <p>
                  <strong>Points d'attention :</strong> Deux paiements sont arrivés en retard ce mois-ci, justifiant les relances automatiques mises en place. Un ticket de maintenance lié à la plomberie est actuellement en cours et pourrait impacter les charges du mois prochain.
                </p>
                <p>
                  Dans l'ensemble, la rentabilité brute reste stable et en croissance de +7% par rapport au trimestre précédent. Continuer les efforts sur la rotation des locataires sera clé pour le mois de décembre.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
