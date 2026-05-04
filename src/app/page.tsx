import Link from "next/link";
import { Hammer, Paintbrush, Timer, Images } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-amber-400">
            HobbyForge
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Build, paint, track, and showcase your miniatures.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-zinc-300">
            A creative workspace for model builders: log painting progress,
            manage paints, track hobby sessions, and turn finished projects into
            a portfolio-worthy gallery.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              href="/projects"
              className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-amber-300"
            >
              View projects
            </Link>

            <Link
              href="/projects/new"
              className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-zinc-100 transition hover:bg-zinc-900"
            >
              Create project
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Build logs",
              text: "Document assembly, priming, highlights, weathering, and basing.",
              icon: Hammer,
            },
            {
              title: "Paint library",
              text: "Track brands, colors, recipes, and usage notes.",
              icon: Paintbrush,
            },
            {
              title: "Session timer",
              text: "Log focused hobby sessions with mood and music notes.",
              icon: Timer,
            },
            {
              title: "Gallery",
              text: "Showcase completed models on polished public pages.",
              icon: Images,
            },
          ].map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
              >
                <Icon className="mb-4 h-6 w-6 text-amber-400" />
                <h2 className="font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm text-zinc-400">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
