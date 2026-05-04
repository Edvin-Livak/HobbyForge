"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? null);
      setIsLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setEmail(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 text-zinc-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-bold text-amber-400">
          HobbyForge
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-zinc-300 hover:text-zinc-50">
            Home
          </Link>

          <Link href="/projects" className="text-zinc-300 hover:text-zinc-50">
            Projects
          </Link>

          <Link href="/sessions" className="text-zinc-300 hover:text-zinc-50">
            Sessions
          </Link>

          {!isLoading && !email && (
            <Link
              href="/auth"
              className="rounded-lg bg-amber-400 px-3 py-2 font-semibold text-zinc-950 hover:bg-amber-300"
            >
              Sign in
            </Link>
          )}

          {!isLoading && email && (
            <div className="flex items-center gap-3">
              <span className="hidden text-zinc-400 sm:inline">{email}</span>

              <button
                onClick={handleSignOut}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-zinc-300 hover:bg-zinc-900"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}