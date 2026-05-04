"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SessionTimer() {
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  function startSession() {
    setRunning(true);
    setStartTime(Date.now());
  }

  async function stopSession() {
    if (!startTime) return;

    const durationMinutes = Math.floor((Date.now() - startTime) / 60000);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("sessions").insert({
      user_id: user.id,
      duration_minutes: durationMinutes || 1,
      notes,
    });

    setRunning(false);
    setStartTime(null);
    setNotes("");
    location.reload();
  }

  return (
    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      {!running ? (
        <button
          onClick={startSession}
          className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-zinc-950"
        >
          Start session
        </button>
      ) : (
        <button
          onClick={stopSession}
          className="rounded-xl bg-red-500 px-5 py-3 font-semibold"
        >
          Stop session
        </button>
      )}

      <textarea
        placeholder="What are you working on?"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="mt-4 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3"
      />
    </div>
  );
}