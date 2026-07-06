import { useState } from "react";
import { Send } from "lucide-react";
import Avatar from "../common/Avatar";
import Tag from "../common/Tag";
import Button from "../common/Button";

export default function TeammateCard({ candidate }) {
  const [requested, setRequested] = useState(false);

  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-ink-faint/40 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar user={candidate.user} size="md" showOnline />
        <div className="min-w-0">
          <p className="font-medium text-ink truncate">{candidate.user.displayName}</p>
          <p className="text-xs text-ink-faint font-mono truncate">@{candidate.user.username}</p>
        </div>
        <span className="ml-auto text-[11px] font-mono px-2 py-1 rounded-full bg-accent-amber/15 text-accent-amber border border-accent-amber/30 shrink-0">
          {candidate.role}
        </span>
      </div>

      <p className="text-sm text-ink-muted leading-relaxed">{candidate.pitch}</p>

      <div className="flex gap-2 flex-wrap">
        {candidate.skills.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>

      <Button
        variant={requested ? "secondary" : "primary"}
        size="sm"
        icon={Send}
        onClick={() => setRequested(!requested)}
        className="mt-1"
      >
        {requested ? "Request sent" : "Team up"}
      </Button>
    </div>
  );
}
