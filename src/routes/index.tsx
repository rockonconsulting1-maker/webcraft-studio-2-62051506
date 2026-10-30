import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Gauge,
  Layers,
  ShieldCheck,
  Sparkles,
  Zap,
  Check,
  Star,
  Quote,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ember — Analytics for fast-moving teams" },
      {
        name: "description",
        content:
          "Ember turns raw product data into clear, actionable insight. Real-time analytics, beautiful dashboards, and answers in seconds — not sprints.",
      },
      { property: "og:title", content: "Ember — Analytics for fast-moving teams" },
      {
        property: "og:description",
        content:
          "Ember turns raw product data into clear, actionable insight. Real-time analytics, beautiful dashboards, and answers in seconds.",
      },
      {
        property: "og:image",
        content:
          "https://vibe.filesafe.space/1793387525362051506/assets/307f963b-bdb9-4dd4-b089-fc8f523e261d.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content:
          "https://vibe.filesafe.space/1793387525362051506/assets/307f963b-bdb9-4dd4-b089-fc8f523e261d.png",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: Zap,
    title: "Real-time pipelines",
    desc: "Events land in your dashboards in under a second. No batch jobs, no waiting, no stale numbers.",
  },
  {
    icon: BarChart3,
    title: "Dashboards in minutes",
    desc: "Drag, drop, and ship. Beautiful charts that your whole team can read — and trust.",
  },
  {
    icon: Layers,
    title: "One source of truth",
    desc: "Unify product, billing, and marketing data without the spreadsheet archaeology.",
  },
  {
    icon: Gauge,
    title: "Sub-second queries",
    desc: "Ask anything. Ember answers across billions of rows before you finish your sentence.",
  },
  {
    icon: ShieldCheck,
    title: "SOC 2 secure",
    desc: "Row-level permissions, audit logs, and encryption at rest. Compliance, handled.",
  },
  {
    icon: Sparkles,
    title: "AI answers",
    desc: "Ask in plain English. Ember writes the query, builds the chart, and explains the trend.",
  },
];

const stats = [
  { value: "1.2B+", label: "events / day" },
  { value: "430ms", label: "median query" },
  { value: "99.98%", label: "uptime" },
  { value: "12k+", label: "teams onboard" },
];

const testimonials = [
  {
    quote:
      "We replaced three tools and a data engineer with Ember. Our weekly review went from a half-day to fifteen minutes.",
    name: "Priya Nair",
    role: "VP Product, Loopline",
  },
  {
    quote:
      "The dashboards are the first thing I open every morning. It finally feels like the whole company is reading the same book.",
    name: "Marcus Halvorsen",
    role: "Founder, Northwind",
  },
  {
    quote:
      "I asked Ember why retention dipped on Tuesday. It showed me the exact cohort, the broken flow, and the ticket to fix it.",
    name: "Dana Whitfield",
    role: "Head of Growth, Pivotal",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/month",
    desc: "For small teams testing the waters.",
    features: ["Up to 1M events / month", "3 dashboards", "7-day retention", "Community support"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$99",
    cadence: "/month",
    desc: "For teams shipping every week.",
    features: [
      "Up to 50M events / month",
      "Unlimited dashboards",
      "1-year retention",
      "AI answers",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "",
    desc: "For data-heavy organizations.",
    features: [
      "Unlimited events",
      "SSO & SAML",
      "Unlimited retention",
      "Dedicated success manager",
      "SOC 2 & HIPAA",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

const logos = ["Loopline", "Northwind", "Pivotal", "Cobalt", "Heron", "Verve"];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg ember-gradient text-primary-foreground">
              <Flame className="h-4 w-4" />
            </span>
            <span className="font-display text-2xl leading-none">Ember</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#testimonials" className="transition-colors hover:text-foreground">
              Customers
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Sign in
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(closest-side, var(--ember), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Now with AI answers — ask anything, get the chart
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight text-balance sm:text-7xl">
              Analytics that move <span className="ember-text italic">at the speed</span> of your
              product
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-balance">
              Ember turns raw events into clear, actionable insight — real-time dashboards,
              sub-second queries, and answers in plain English. Built for teams that ship every day.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50"
              >
                See how it works
              </a>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              No credit card · 14-day trial · Cancel anytime
            </p>
          </div>

          {/* Hero visual */}
          <div className="relative mt-16 sm:mt-20">
            <div className="absolute -inset-x-4 -top-4 bottom-0 rounded-3xl bg-surface/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <img
                src="https://vibe.filesafe.space/1793387525362051506/assets/307f963b-bdb9-4dd4-b089-fc8f523e261d.png"
                alt="Ember analytics dashboard showing real-time data with warm ember-glowing visualizations"
                className="aspect-[16/9] w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logo strip */}
      <section className="border-y border-border bg-surface/30 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
            Trusted by data teams at
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((l) => (
              <span key={l} className="font-display text-xl text-muted-foreground/70">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium text-primary">Features</span>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-balance sm:text-5xl">
              Everything you need to <span className="ember-text italic">understand</span> your
              numbers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-balance">
              One platform replaces your warehouse, BI tool, and the person you always ping for
              "just one chart."
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-background p-8 transition-colors hover:bg-surface"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface text-primary transition-colors group-hover:border-primary/50">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-5xl tracking-tight ember-text sm:text-6xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium text-primary">Customers</span>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-balance sm:text-5xl">
              Teams that <span className="ember-text italic">ship faster</span> with Ember
            </h2>
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-8"
              >
                <Quote className="h-7 w-7 text-primary/40" />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-foreground">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-5">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium text-primary">Pricing</span>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-balance sm:text-5xl">
              Simple plans that <span className="ember-text italic">scale</span> with you
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-balance">
              Start free. Upgrade when you're ready. No surprises on the invoice.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  p.highlighted
                    ? "border-primary bg-card shadow-2xl"
                    : "border-border bg-surface/40"
                }`}
              >
                {p.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most popular
                  </span>
                )}
                <div className="font-display text-2xl">{p.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl tracking-tight">{p.price}</span>
                  {p.cadence && <span className="text-muted-foreground">{p.cadence}</span>}
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
                    p.highlighted
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center sm:p-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
              style={{
                background: "radial-gradient(closest-side, var(--ember-glow), transparent 70%)",
              }}
            />
            <div className="relative">
              <Star className="mx-auto h-8 w-8 text-primary" />
              <h2 className="mt-6 font-display text-4xl tracking-tight text-balance sm:text-5xl">
                Ready to see your data <span className="ember-text italic">clearly?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground text-balance">
                Join 12,000+ teams who replaced their analytics stack with Ember. Set up takes five
                minutes.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50"
                >
                  Book a demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg ember-gradient text-primary-foreground">
              <Flame className="h-3.5 w-3.5" />
            </span>
            <span className="font-display text-xl">Ember</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Docs
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Security
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
          </nav>
          <p className="text-xs text-muted-foreground">© 2026 Ember Analytics, Inc.</p>
        </div>
      </footer>
    </div>
  );
}

function Flame({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6 2 1.1 3 3 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
