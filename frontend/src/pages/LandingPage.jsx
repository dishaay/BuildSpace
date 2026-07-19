import { Link } from "react-router-dom";
import { Terminal, ArrowRight, Users, Code2, Trophy, MessageSquare } from "lucide-react";
import ContributionGraph from "../components/common/ContributionGraph";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import { communities, users, currentUser } from "../data/dummyData";

const features = [
  {
    icon: MessageSquare,
    title: "Threads that don't die in 24 hours",
    body: "Discuss real problems in communities organized by stack, not by trending hashtag.",
  },
  {
    icon: Code2,
    title: "Showcase what you actually built",
    body: "Pin projects, show stars and forks, and find people to collaborate with.",
  },
  {
    icon: Trophy,
    title: "Find a hackathon team in minutes",
    body: "Post what you're building and what you're missing. Match by skill, not by luck.",
  },
  {
    icon: Users,
    title: "A feed sorted by relevance, not rage",
    body: "Follow communities that match your stack. No engagement-bait algorithm.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink overflow-x-hidden">
      {/* Nav */}
      <header className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-violet flex items-center justify-center">
            <Terminal size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg">
            build<span className="text-accent-violet">Space</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="text-sm text-ink-muted hover:text-ink px-3 py-2">
            Log in
          </Link>
          <Link to="/register">
            <Button size="sm">Sign up</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-riseIn">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-accent-teal bg-accent-teal/10 border border-accent-teal/20 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulseSoft" />
            200 devs committed something today
          </div>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-6">
            Where developers
            <br />
            <span className="text-accent-violet">ship, discuss,</span>
            <br />
            and find their people.
          </h1>
          <p className="text-ink-muted text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            Communities for your stack, a feed worth reading, and a place to find
            hackathon teammates before the deadline panic sets in.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/register">
              <Button size="lg" icon={ArrowRight} className="flex-row-reverse">
                Create your account
              </Button>
            </Link>
            <Link to="/feed">
              <Button size="lg" variant="secondary">
                Browse without signing in
              </Button>
            </Link>
          </div>
        </div>

        {/* Signature: live commit-style panel */}
        <div className="relative animate-riseIn" style={{ animationDelay: "120ms" }}>
          <div className="absolute -inset-4 bg-accent-violet/10 blur-3xl rounded-full" />
          <div className="relative bg-bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-3 h-3 rounded-full bg-accent-coral/60" />
              <span className="w-3 h-3 rounded-full bg-accent-amber/60" />
              <span className="w-3 h-3 rounded-full bg-accent-teal/60" />
              <span className="ml-2 font-mono text-xs text-ink-faint">arinmehta / activity.log</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Avatar user={currentUser} size="md" />
              <div>
                <p className="font-medium text-sm">{currentUser.displayName}</p>
                <p className="text-xs text-ink-faint font-mono">{currentUser.streak}-day streak 🔥</p>
              </div>
            </div>

            <ContributionGraph seed={7} size="lg" className="mb-5" />

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center gap-2 text-ink-muted">
                <span className="text-accent-teal">+</span> opened PR in <span className="text-accent-violet">queue-lite</span>
              </div>
              <div className="flex items-center gap-2 text-ink-muted">
                <span className="text-accent-amber">→</span> answered thread in <span className="text-accent-violet">#backend-guild</span>
              </div>
              <div className="flex items-center gap-2 text-ink-muted">
                <span className="text-accent-coral">★</span> starred <span className="text-accent-violet">vect-search</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community strip */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-16">
        <p className="text-xs font-mono text-ink-faint mb-4 uppercase tracking-wider">Active communities</p>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {communities.map((c) => (
            <div
              key={c.id}
              className="shrink-0 flex items-center gap-2.5 bg-bg-surface border border-border rounded-full pl-2 pr-4 py-2"
            >
              <span className="w-7 h-7 rounded-full bg-bg-hover flex items-center justify-center text-sm">
                {c.icon}
              </span>
              <span className="text-sm text-ink">{c.displayName}</span>
              <span className="text-xs text-ink-faint font-mono">{(c.members / 1000).toFixed(1)}k</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <h2 className="font-display font-semibold text-2xl sm:text-3xl mb-2">Built for people who build</h2>
        <p className="text-ink-muted mb-10 max-w-xl">
          Not another social feed. A place organized the way developers actually think — by stack, by problem, by project.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-bg-surface border border-border rounded-xl p-5 hover:border-accent-violet/40 transition-colors animate-riseIn"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-9 h-9 rounded-lg bg-accent-violet/15 flex items-center justify-center mb-4">
                <f.icon size={17} className="text-accent-violet" />
              </div>
              <h3 className="font-medium text-ink mb-1.5">{f.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof avatars */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 border-t border-border">
        <div className="bg-bg-surface border border-border rounded-2xl p-8 sm:p-12 flex flex-col items-center text-center">
          <div className="flex -space-x-2 mb-6">
            {[currentUser, ...users].slice(0, 6).map((u) => (
              <div key={u.id} className="ring-2 ring-bg-surface rounded-xl">
                <Avatar user={u} size="md" />
              </div>
            ))}
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl mb-3 max-w-lg">
            Join 14,200+ developers already shipping in public
          </h2>
          <p className="text-ink-muted mb-6 max-w-md">
            Free to join. No recruiter DMs, no engagement farming — just developers talking to developers.
          </p>
          <Link to="/register">
            <Button size="lg" icon={ArrowRight} className="flex-row-reverse">
              Get started free
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint font-mono">
          <span>© 2026 BuildSpace — built by dee, for developers.</span>
          <div className="flex gap-4">
            <span className="hover:text-ink cursor-pointer">Terms</span>
            <span className="hover:text-ink cursor-pointer">Privacy</span>
            <span className="hover:text-ink cursor-pointer">Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
