"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function BuildLogForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSaving(true);
    setErrorMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage("You must be signed in");
      setIsSaving(false);
      return;
    }

    const entry = {
      project_id: projectId,
      user_id: user.id,
      title: String(formData.get("title")),
      body: String(formData.get("body")),
      entry_type: String(formData.get("entry_type")),
    };

    const { data: createdEntry, error: entryError } = await supabase
      .from("build_log_entries")
      .insert(entry)
      .select()
      .single();

    if (entryError) {
      setErrorMessage(entryError.message);
      setIsSaving(false);
      return;
    }

    const image = formData.get("image") as File | null;

    if (image && image.size > 0) {
      const fileExt = image.name.split(".").pop();
      const filePath = `${projectId}/${createdEntry.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, image);

      if (uploadError) {
        setErrorMessage(uploadError.message);
        setIsSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(filePath);

      const { error: photoError } = await supabase.from("photos").insert({
        project_id: projectId,
        log_entry_id: createdEntry.id,
        user_id: user.id,
        image_url: publicUrlData.publicUrl,
        caption: createdEntry.title,
      });

      if (photoError) {
        setErrorMessage(photoError.message);
        setIsSaving(false);
        return;
      }
    }

    form.reset();
    setIsSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <div>
        <label className="text-sm font-medium text-zinc-300">Entry title</label>
        <input
          name="title"
          required
          placeholder="Basecoat completed"
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-50 outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">Type</label>
        <select
          name="entry_type"
          defaultValue="basecoat"
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-50 outline-none focus:border-amber-400"
        >
          <option value="assembly">Assembly</option>
          <option value="priming">Priming</option>
          <option value="basecoat">Basecoat</option>
          <option value="layering">Layering</option>
          <option value="highlighting">Highlighting</option>
          <option value="weathering">Weathering</option>
          <option value="basing">Basing</option>
          <option value="photography">Photography</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">Notes</label>
        <textarea
          name="body"
          rows={4}
          placeholder="Used a thin olive basecoat, then drybrushed edges..."
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-50 outline-none focus:border-amber-400"
        />
      </div>

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

      <div>
        <label className="text-sm font-medium text-zinc-300">
          Progress photo
        </label>
        <input
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-50 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:font-semibold file:text-zinc-950 hover:file:bg-amber-300"
        />
      </div>

      <button
        disabled={isSaving}
        className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Add log entry"}
      </button>
    </form>
  );
}
