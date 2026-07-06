import { useState } from "react";
import Button from "../common/Button";
import Tag from "../common/Tag";

export default function CommunityCard({ community, compact = false }) {
  const [joined, setJoined] = useState(false);

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center text-base shrink-0">
          {community.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink truncate">{community.displayName}</p>
          <p className="text-xs text-ink-faint font-mono">{community.members.toLocaleString()} members</p>
        </div>
        <button
          onClick={() => setJoined(!joined)}
          className={`text-xs font-medium px-2.5 py-1 rounded-md border shrink-0 ${
            joined
              ? "border-border text-ink-muted"
              : "border-accent-violet/40 text-accent-violet hover:bg-accent-violet/10"
          }`}
        >
          {joined ? "Joined" : "Join"}
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-bg-surface border border-border border-l-4 ${community.color} rounded-xl p-5 flex flex-col gap-3 hover:border-ink-faint/40 transition-colors`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-bg-hover flex items-center justify-center text-xl">
            {community.icon}
          </div>
          <div>
            <h3 className="font-display font-semibold text-ink">{community.displayName}</h3>
            <p className="text-xs text-ink-faint font-mono">{community.members.toLocaleString()} members</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{community.description}</p>
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex gap-2">
          {community.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <Button
          variant={joined ? "secondary" : "primary"}
          size="sm"
          onClick={() => setJoined(!joined)}
        >
          {joined ? "Joined" : "Join"}
        </Button>
      </div>
    </div>
  );
}
