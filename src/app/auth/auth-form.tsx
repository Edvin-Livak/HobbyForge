"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    setIsLoading(true);
    setMessage("");

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setMessage(result.error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    if (mode === "signup") {
      setMessage("Account created. Check your email if confirmation is enabled.");
      return;
    }

    router.push("/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label className="text-sm font-medium text-zinc-300">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-amber-400"
        />
      </div>

      {message && <p className="text-sm text-zinc-400">{message}</p>}

      <button
        disabled={isLoading}
        className="w-full rounded-xl bg-amber-400 px-5 py-3 font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-60"
      >
        {isLoading
          ? "Working..."
          : mode === "signin"
            ? "Sign in"
            : "Create account"}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="w-full text-sm text-zinc-400 hover:text-zinc-200"
      >
        {mode === "signin"
          ? "Need an account? Sign up"
          : "Already have an account? Sign in"}
      </button>
    </form>
  );
}