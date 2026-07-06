import { useState } from "react";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import TeammateCard from "../components/feature/TeammateCard";
import Button from "../components/common/Button";
import { hackathons, teammateCandidates } from "../data/dummyData";

export default function HackathonFinderPage() {
  const [activeHackathon, setActiveHackathon] = useState(hackathons[0].id);

  const candidates = teammateCandidates.filter((t) => t.hackathon === activeHackathon);

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl mb-1">Hackathon partner finder</h1>
          <p className="text-ink-muted text-sm">Post what you're building. Find who's missing from your team.</p>
        </div>
        <Button icon={Plus}>Post your pitch</Button>
      </div>

      {/* Hackathon selector strip */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {hackathons.map((h) => (
          <button
            key={h.id}
            onClick={() => setActiveHackathon(h.id)}
            className={`text-left bg-bg-surface border rounded-xl p-4 transition-colors ${
              activeHackathon === h.id
                ? "border-accent-violet shadow-glow"
                : "border-border hover:border-ink-faint/40"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-accent-coral/15 text-accent-coral border border-accent-coral/30">
                {h.daysLeft}d left
              </span>
            </div>
            <h3 className="font-display font-semibold text-ink mb-1 leading-snug">{h.name}</h3>
            <p className="text-xs text-ink-muted mb-3">{h.theme}</p>
            <div className="flex flex-col gap-1 text-xs text-ink-faint font-mono">
              <span className="flex items-center gap-1.5"><Calendar size={12} /> {h.date}</span>
              <span className="flex items-center gap-1.5"><MapPin size={12} /> {h.mode}</span>
              <span className="flex items-center gap-1.5"><Users size={12} /> {h.participants.toLocaleString()} registered</span>
            </div>
          </button>
        ))}
      </div>

      {/* Candidates */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-ink">
          {candidates.length} developer{candidates.length !== 1 ? "s" : ""} looking for a team
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((c) => (
          <TeammateCard key={c.id} candidate={c} />
        ))}
        {candidates.length === 0 && (
          <p className="text-sm text-ink-faint col-span-full">
            No one's posted for this hackathon yet — be the first.
          </p>
        )}
      </div>
    </AppShell>
  );
}
