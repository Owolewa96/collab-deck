import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight">
              A powerful task manager like Jira — totally free.
            </h1>

            <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300 max-w-xl">
              Collab Deck brings boards, issues, sprints, and workflows into one simple,
              collaborative workspace. No limits on projects or users — built for teams who
              want robust workflows without the cost.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#signup"
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-5 py-3 text-sm font-medium hover:bg-emerald-500"
              >
                Get started — it's free
              </a>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-md border border-zinc-200 text-zinc-900 bg-white px-5 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-100"
              >
                See features
              </a>
            </div>

            <div className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              Free forever — unlimited projects, collaborators, and boards.
            </div>
          </div>

          <div className="relative w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center">
            <div className="rounded-xl overflow-hidden shadow-lg w-full h-full bg-zinc-100 dark:bg-zinc-900">
              <Image
                src="/next.svg"
                alt="Collaboration illustration"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100">Features</h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300 max-w-2xl">Everything you need to run your development and product workflows — without the price tag.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Boards & Backlogs</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Flexible boards for kanban and scrum, plus backlogs and prioritization.</p>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Issues & Workflows</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Custom issue types, statuses, and automated workflows to match your process.</p>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Integrations</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Connect Git, Slack, and CI tools to keep work in sync across your stack.</p>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Unlimited Teams</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">No limits on projects, boards, or teammates — collaborate without constraints.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
