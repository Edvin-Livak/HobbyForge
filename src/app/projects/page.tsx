"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  game_system: string | null;
  scale: string | null;
  faction: string | null;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsSignedIn(false);
        setIsLoading(false);
        return;
      }

      setIsSignedIn(true);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);
      }

      setIsLoading(false);
    }

    loadProjects();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
        <p className="text-zinc-400">Loading projects...</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
        <div className="mx-auto max-w-3xl">
          <p className="text-zinc-400">Please sign in.</p>

          <Link
            href="/auth"
            className="mt-4 inline-block rounded-xl bg-amber-400 px-5 py-3 font-semibold text-zinc-950 hover:bg-amber-300"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
              ← Back home
            </Link>
            <h1 className="mt-4 text-4xl font-bold">Projects</h1>
            <p className="mt-2 text-zinc-400">
              Your miniature and model-building workspace.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-zinc-950 hover:bg-amber-300"
          >
            New project
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:border-amber-400"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                {project.status}
              </p>

              <h2 className="mt-3 text-xl font-semibold">{project.title}</h2>

              {project.description && (
                <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                  {project.description}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-300">
                {project.game_system && (
                  <span className="rounded-full bg-zinc-800 px-3 py-1">
                    {project.game_system}
                  </span>
                )}
                {project.scale && (
                  <span className="rounded-full bg-zinc-800 px-3 py-1">
                    {project.scale}
                  </span>
                )}
                {project.faction && (
                  <span className="rounded-full bg-zinc-800 px-3 py-1">
                    {project.faction}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-700 p-10 text-center">
            <p className="text-zinc-400">No projects yet.</p>
            <Link
              href="/projects/new"
              className="mt-4 inline-block rounded-xl bg-amber-400 px-5 py-3 font-semibold text-zinc-950 hover:bg-amber-300"
            >
              Create your first project
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}