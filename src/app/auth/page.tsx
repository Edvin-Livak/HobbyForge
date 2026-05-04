import AuthForm from "./auth-form";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
      <div className="mx-auto max-w-md">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
          HobbyForge
        </p>

        <h1 className="mt-4 text-4xl font-bold">Sign in</h1>
        <p className="mt-2 text-zinc-400">
          Create an account or sign in to manage your projects.
        </p>

        <AuthForm />
      </div>
    </main>
  );
}