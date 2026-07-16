import { Link } from "react-router-dom";
import { Star, GitFork, Calendar, Users, Trophy, ArrowRight, PenSquare } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";

const latestProjects = [
  {
    id: "p1",
    name: "queue-lite",
    tagline: "A tiny embeddable job queue for Node, no Redis required",
    owner: { displayName: "Arin Mehta", username: "arinmehta", avatar: "AM", avatarColor: "bg-accent-violet" },
    stars: 1240,
    forks: 87,
    tags: ["node", "queues"],
  },
  {
    id: "p2",
    name: "formkit-ui",
    tagline: "Accessible form primitives for React with zero runtime CSS",
    owner: { displayName: "Kofi Boateng", username: "kofi.b", avatar: "KB", avatarColor: "bg-accent-teal" },
    stars: 892,
    forks: 54,
    tags: ["react", "a11y"],
  },
  {
    id: "p3",
    name: "vect-search",
    tagline: "Lightweight vector search you can run on a Raspberry Pi",
    owner: { displayName: "Priya Sharma", username: "priyasharma", avatar: "PS", avatarColor: "bg-accent-coral" },
    stars: 3401,
    forks: 298,
    tags: ["ml", "search"],
  },
];

const latestHackathons = [
  {
    id: "h1",
    title: "BuildFast Global Hackathon",
    startDate: "Aug 14, 2026",
    endDate: "Aug 16, 2026",
    mode: "Remote",
    maxTeamSize: 4,
    status: "Open",
  },
  {
    id: "h2",
    title: "GreenTech Sprint",
    startDate: "Sep 4, 2026",
    endDate: "Sep 6, 2026",
    mode: "Hybrid · Bengaluru",
    maxTeamSize: 5,
    status: "Open",
  },
  {
    id: "h3",
    title: "HealthHack Asia",
    startDate: "Sep 20, 2026",
    endDate: "Sep 21, 2026",
    mode: "Remote",
    maxTeamSize: 3,
    status: "Full",
  },
];

const recentDevelopers = [
  { id: "u1", displayName: "Devon Kessler", username: "devon_k", avatar: "DK", avatarColor: "bg-accent-amber", title: "DevOps · Kubernetes" },
  { id: "u2", displayName: "Lin Shu", username: "linshu", avatar: "LS", avatarColor: "bg-accent-violet", title: "ML engineer" },
  { id: "u3", displayName: "Renata Paz", username: "renata_p", avatar: "RP", avatarColor: "bg-accent-teal", title: "Mobile · Flutter" },
  { id: "u4", displayName: "Sam Wu", username: "sam.wu", avatar: "SW", avatarColor: "bg-accent-coral", title: "Security researcher" },
];

const statusStyles = {
  Open: "bg-accent-teal/15 text-accent-teal border-accent-teal/30",
  Full: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  Closed: "bg-accent-coral/15 text-accent-coral border-accent-coral/30",
};

function SectionHeader({ title, viewAllHref }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display font-semibold text-lg sm:text-xl text-ink">{title}</h2>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="flex items-center gap-1 text-sm text-accent-violet hover:underline shrink-0"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

export default function FeedPage() {
  return (
    <AppShell>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="font-display font-semibold text-2xl mb-1">Feed</h1>
          <p className="text-ink-muted text-sm">What's new across projects, hackathons, and people.</p>
        </div>
        <Button icon={PenSquare}>New post</Button>
      </div>

      <div className="flex flex-col gap-10">
        {/* Latest Projects */}
        <section>
          <SectionHeader title="Latest projects" viewAllHref="/projects" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestProjects.map((p) => (
              <Card key={p.id} hoverable padding="md" className="flex flex-col gap-3">
                <div>
                  <p className="font-mono text-sm text-accent-violet mb-1">{p.name}</p>
                  <p className="text-xs text-ink-muted leading-relaxed">{p.tagline}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 mt-auto border-t border-border-soft">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar user={p.owner} size="xs" />
                    <span className="text-xs text-ink-muted truncate">{p.owner.displayName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-ink-faint text-xs font-mono shrink-0">
                    <span className="flex items-center gap-1">
                      <Star size={12} /> {p.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={12} /> {p.forks}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Latest Hackathons */}
        <section>
          <SectionHeader title="Latest hackathons" viewAllHref="/hackathons/mine" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestHackathons.map((h) => (
              <Card key={h.id} hoverable padding="md" className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-ink text-sm leading-snug">{h.title}</h3>
                  <span
                    className={`shrink-0 font-mono text-[11px] px-2 py-1 rounded-full border ${
                      statusStyles[h.status] || "bg-bg-hover text-ink-muted border-border"
                    }`}
                  >
                    {h.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-ink-faint font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {h.startDate} – {h.endDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Trophy size={12} />
                    {h.mode}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={12} />
                    Max team size {h.maxTeamSize}
                  </span>
                </div>

                <Button variant="secondary" size="sm" className="w-full mt-auto">
                  View details
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Developers */}
        <section>
          <SectionHeader title="Recent developers" viewAllHref="/communities" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentDevelopers.map((dev) => (
              <Card key={dev.id} hoverable padding="md" className="flex flex-col items-center text-center gap-3">
                <Avatar user={dev} size="lg" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{dev.displayName}</p>
                  <p className="text-xs text-ink-faint font-mono truncate">@{dev.username}</p>
                  <p className="text-xs text-ink-muted mt-1 truncate">{dev.title}</p>
                </div>
                <Button variant="secondary" size="sm" className="w-full">
                  View profile
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}