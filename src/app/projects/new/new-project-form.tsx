"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function NewProjectForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const project = {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      game_system: String(formData.get("game_system")),
      scale: String(formData.get("scale")),
      faction: String(formData.get("faction")),
      status: String(formData.get("status")),
    };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage("You must be signed in");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from("projects").insert({
      ...project,
      user_id: user.id,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSaving(false);
      return;
    }

    router.push("/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label className="text-sm font-medium text-zinc-300">Title</label>
        <input
          name="title"
          required
          placeholder="GDI Mammoth Tank"
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">Description</label>
        <textarea
          name="description"
          rows={4}
          placeholder="A weathered Command & Conquer inspired tank build..."
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 outline-none focus:border-amber-400"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-300">
            Game/system
          </label>
          <input
            name="game_system"
            placeholder="Command & Conquer"
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-300">Scale</label>
          <input
            name="scale"
            placeholder="1:35"
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-300">Faction</label>
          <input
            name="faction"
            placeholder="GDI, Nod, Soviet, Axis..."
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-300">Status</label>
          <select
            name="status"
            defaultValue="planning"
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-50 outline-none focus:border-amber-400"
          >
            <option value="planning">Planning</option>
            <option value="in_progress">In progress</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

      <button
        disabled={isSaving}
        className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-zinc-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Create project"}
      </button>
    </form>
  );
}
