import Link from "next/link";
import { ReactNode } from "react";
import { UserCircle } from "lucide-react";

export default function PortalLayout({ 
  children,
  params
}: { 
  children: ReactNode,
  params: { token: string } 
}) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 justify-center border-b bg-background shadow-sm">
        <div className="flex w-full max-w-5xl items-center justify-between px-6">
          <Link href={`/portal/${params.token}`} className="flex items-center gap-2 font-bold text-xl text-primary">
            Gestia <span className="text-sm font-normal text-muted-foreground ml-2">Portail Locataire</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <UserCircle className="h-5 w-5" />
            Mon espace
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground bg-background">
        <p>Propulsé par Gestia - Logiciel de gestion locative</p>
      </footer>
    </div>
  );
}
