import { useState } from "react";
import { Search, Plus } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import CommunityCard from "../components/feature/CommunityCard";
import Button from "../components/common/Button";
import Tag from "../components/common/Tag";
import { communities } from "../data/dummyData";

const filterTags = ["all", "frontend", "node", "databases", "oss", "devops", "ai", "career"];

export default function CommunitiesPage() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  const filtered = communities.filter((c) => {
    const matchesQuery = c.displayName.toLowerCase().includes(query.toLowerCase());
    const matchesTag = activeTag === "all" || c.tags.includes(activeTag);
    return matchesQuery && matchesTag;
  });

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl mb-1">Communities</h1>
          <p className="text-ink-muted text-sm">Find your corner of the stack.</p>
        </div>
        <Button icon={Plus}>Create community</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities..."
            className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterTags.map((t) => (
            <Tag key={t} active={activeTag === t} onClick={() => setActiveTag(t)}>
              {t}
            </Tag>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <CommunityCard key={c.id} community={c} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-ink-faint col-span-full">No communities match that search.</p>
        )}
      </div>
    </AppShell>
  );
}
