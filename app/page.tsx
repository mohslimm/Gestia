import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-primary">Bienvenue sur Gestia</h1>
        <p className="text-muted-foreground text-center max-w-lg text-lg">
          L'outil de gestion locative complet pour les propriétaires indépendants.
        </p>
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <Link 
            href="/dashboard" 
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium cursor-pointer shadow-md"
          >
            Accéder au Dashboard
          </Link>
          <Link 
            href="/portal/demo-token" 
            className="px-6 py-3 rounded-md border border-input bg-background hover:bg-muted transition-colors font-medium cursor-pointer"
          >
            Portail Locataire (Démo)
          </Link>
          <Link 
            href="/login" 
            className="px-6 py-3 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium cursor-pointer"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  );
}
