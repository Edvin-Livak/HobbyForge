"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BuildLogForm from "./build-log-form";

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  game_system: string | null;
  scale: string | null;
  faction: string | null;
};

export default function ProjectPage() {
  const params = useParams();
  const projectId = String(params.projectId);

  const [project, setProject] = useState<Project | null>(null);
  const [buildLogs, setBuildLogs] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: projectData } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", user.id)
        .single();

      const { data: logData } = await supabase
        .from("build_log_entries")
        .select("*, photos (*)")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const { data: photoData } = await supabase
        .from("photos")
        .select("*")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setProject(projectData);
      setBuildLogs(logData || []);
      setPhotos(photoData || []);
      setIsLoading(false);
    }

    loadProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
        <p className="text-zinc-400">Loading project...</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
        <p className="text-zinc-400">Project not found or you are not signed in.</p>
        <Link href="/auth" className="mt-4 inline-block text-amber-400">
          Go to sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
      <div className="mx-auto max-w-5xl">
        <Link href="/projects" className="text-sm text-zinc-400 hover:text-zinc-200">
          ← Back to projects
        </Link>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
            {project.status}
          </p>

          <h1 className="mt-4 text-5xl font-bold">{project.title}</h1>

          {project.description && (
            <p className="mt-5 max-w-3xl text-lg text-zinc-300">
              {project.description}
            </p>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <InfoCard label="Game/system" value={project.game_system} />
            <InfoCard label="Scale" value={project.scale} />
            <InfoCard label="Faction" value={project.faction} />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Build log">
            <BuildLogForm projectId={project.id} />

            <div className="mt-8 space-y-4">
              {buildLogs.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-zinc-100">{entry.title}</h3>
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-amber-400">
                      {entry.entry_type}
                    </span>
                  </div>

                  {entry.body && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-400">
                      {entry.body}
                    </p>
                  )}

                  {entry.photos?.map((photo: any) => (
                    <img
                      key={photo.id}
                      src={photo.image_url}
                      alt={photo.caption || entry.title}
                      className="mt-4 max-h-80 w-full rounded-xl object-cover"
                    />
                  ))}

                  <p className="mt-4 text-xs text-zinc-600">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Gallery">
            {photos.length === 0 && (
              <p className="text-sm text-zinc-400">No images yet.</p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-xl border border-zinc-800"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption || "Project image"}
                    className="h-40 w-full object-cover transition group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Paints used">
            <p className="text-sm text-zinc-400">
              Soon you’ll connect paints and recipes to this project.
            </p>
          </Panel>

          <Panel title="Sessions">
            <Link href="/sessions" className="text-sm text-amber-400 hover:text-amber-300">
              Go to session timer →
            </Link>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 font-medium text-zinc-100">{value || "—"}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}