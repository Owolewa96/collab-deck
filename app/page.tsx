
import Image from "next/image";
import Navbar from "./components/Navbar";
import TestimonialSlider from "../components/TestimonialSlider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="changa-one-regular text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight">
              A powerful task manager like Jira — totally free.
            </h1>

            <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300 max-w-xl">
              Collab Deck brings boards, issues, sprints, and workflows into one simple,
              collaborative workspace. No limits on projects or users — built for teams who
              want robust workflows without the cost.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/auth/signup"
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
            <div className="rounded-xl overflow-hidden w-full h-full bg-zinc-100 dark:bg-zinc-900">
              <Image
                src="/images/hero-image.gif"
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
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Packed with powerful features
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Everything you need to manage projects, collaborate seamlessly, and ship faster—all without breaking the bank.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group relative bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-lg transition overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-50 to-transparent dark:from-emerald-900/10 opacity-0 group-hover:opacity-100 transition"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Kanban & Scrum Boards</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Flexible boards for any workflow. Drag and drop tasks, customize columns, and manage sprints effortlessly.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-lg transition overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                <span className="text-xl">⚙️</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Custom Workflows</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Define custom statuses, issue types, and automation rules that match your exact team process.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-lg transition overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-purple-50 to-transparent dark:from-purple-900/10 opacity-0 group-hover:opacity-100 transition"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                <span className="text-xl">🔗</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Deep Integrations</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Connect GitHub, Slack, Figma, and more. Keep your entire stack in sync with Collab Deck.</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-lg transition overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-transparent dark:from-orange-900/10 opacity-0 group-hover:opacity-100 transition"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
                <span className="text-xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Real-time Collaboration</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Comment, mention teammates, and chat directly on tasks. Real-time updates keep everyone on the same page.</p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group relative bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-lg transition overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-pink-50 to-transparent dark:from-pink-900/10 opacity-0 group-hover:opacity-100 transition"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-3">
                <span className="text-xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Analytics & Reporting</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Track velocity, burndown, and team metrics with beautiful dashboards and detailed reports.</p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="group relative bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-lg transition overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-50 to-transparent dark:from-cyan-900/10 opacity-0 group-hover:opacity-100 transition"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-3">
                <span className="text-xl">🔐</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Enterprise Security</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">SSO, role-based access control, and audit logs. Built for teams that demand security.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Loved by teams worldwide
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            See what teams are saying about Collab Deck
          </p>
        </div>

        <TestimonialSlider />
      </section>
    </main>
    </>
  );
}
