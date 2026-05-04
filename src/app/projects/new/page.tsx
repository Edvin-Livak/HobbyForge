import Link from "next/link";
import NewProjectForm from "./new-project-form";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
      <div className="mx-auto max-w-2xl">
        <Link href="/projects" className="text-sm text-zinc-400 hover:text-zinc-200">
          ← Back to projects
        </Link>

        <h1 className="mt-4 text-4xl font-bold">Create project</h1>
        <p className="mt-2 text-zinc-400">
          Start tracking a miniature, model, diorama, or painting project.
        </p>

        <NewProjectForm />
      </div>
    </main>
  );
}