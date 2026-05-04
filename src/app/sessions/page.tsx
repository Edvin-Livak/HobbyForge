"use client";
import SessionTimer from "./session-timer";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setSessions(data || []);
      setIsLoading(false);
    }

    loadSessions();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Sessions</h1>

        <SessionTimer />

        <div className="mt-10 space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <p className="font-semibold">
                {session.duration_minutes} minutes
              </p>
              <p className="text-sm text-zinc-400">{session.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}