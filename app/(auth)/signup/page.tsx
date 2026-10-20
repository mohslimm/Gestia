import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/30">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link href="/" className="text-2xl font-bold text-primary">Gestia</Link>
          <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
          <p className="text-sm text-muted-foreground">
            Rejoignez Gestia pour gérer vos locations simplement.
          </p>
        </div>

        <form action="/api/auth/signup" method="POST" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Jean Dupont"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            S'inscrire avec Magic Link
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Accès direct au Dashboard (Mode Démo)
          </Link>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
