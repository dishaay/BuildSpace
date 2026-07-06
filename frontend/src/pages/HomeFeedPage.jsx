import { useState } from "react";
import { TrendingUp, Clock, Flame, PenSquare } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import PostCard from "../components/feature/PostCard";
import CommunityCard from "../components/feature/CommunityCard";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import { posts, communities, users, currentUser } from "../data/dummyData";

const sortOptions = [
  { key: "top", label: "Top", icon: TrendingUp },
  { key: "new", label: "New", icon: Clock },
  { key: "hot", label: "Hot", icon: Flame },
];

export default function HomeFeedPage() {
  const [sort, setSort] = useState("top");

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[220px_1fr_280px] gap-6 items-start">
        {/* Left rail */}
        <aside className="hidden lg:flex flex-col gap-1 sticky top-24">
          <p className="text-xs font-mono text-ink-faint uppercase tracking-wider px-2 mb-2">
            Your communities
          </p>
          {communities.slice(0, 5).map((c) => (
            <CommunityCard key={c.id} community={c} compact />
          ))}
          <button className="text-sm text-accent-violet px-2 py-2 text-left hover:underline">
            See all communities →
          </button>
        </aside>

        {/* Center feed */}
        <div className="min-w-0">
          <div className="bg-bg-surface border border-border rounded-xl p-3 flex items-center gap-3 mb-4">
            <Avatar user={currentUser} size="sm" />
            <button className="flex-1 text-left text-sm text-ink-faint bg-bg-hover rounded-lg px-4 py-2.5 hover:bg-bg-raised transition-colors">
              Start a discussion...
            </button>
            <Button size="sm" icon={PenSquare}>
              Post
            </Button>
          </div>

          <div className="flex items-center gap-1 mb-4">
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sort === opt.key
                    ? "bg-accent-violet/15 text-accent-violet"
                    : "text-ink-muted hover:bg-bg-hover hover:text-ink"
                }`}
              >
                <opt.icon size={14} />
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 sticky top-24">
          <div className="bg-bg-surface border border-border rounded-xl p-4">
            <p className="text-xs font-mono text-ink-faint uppercase tracking-wider mb-3">
              Who's online
            </p>
            <div className="flex flex-col gap-2.5">
              {users.filter((u) => u.online).map((u) => (
                <div key={u.id} className="flex items-center gap-2.5">
                  <Avatar user={u} size="xs" showOnline />
                  <span className="text-sm text-ink truncate">{u.displayName}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-surface border border-border rounded-xl p-4">
            <p className="text-xs font-mono text-ink-faint uppercase tracking-wider mb-3">
              Trending tags
            </p>
            <div className="flex flex-wrap gap-2">
              {["react", "typescript", "kubernetes", "rust", "llm", "postgres"].map((t) => (
                <span
                  key={t}
                  className="font-mono text-xs px-2.5 py-1 rounded-md bg-bg-hover text-ink-muted hover:text-accent-violet cursor-pointer transition-colors"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
