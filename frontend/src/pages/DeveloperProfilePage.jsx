import { useState } from "react";
import { MapPin, Calendar, LinkIcon, Flame, Star, GitFork } from "lucide-react";
import GithubMark from "../components/common/GithubMark";
import AppShell from "../components/layout/AppShell";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";
import Button from "../components/common/Button";
import ContributionGraph from "../components/common/ContributionGraph";
import { currentUser, projects, posts } from "../data/dummyData";

const tabs = ["Overview", "Projects", "Posts", "Activity"];

export default function DeveloperProfilePage() {
  const [tab, setTab] = useState("Overview");
  const myProjects = projects.filter((p) => p.owner.id === currentUser.id || p.owner.id === "u1");
  const myPosts = posts.slice(0, 2);

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Left: profile card */}
        <aside className="bg-bg-surface border border-border rounded-xl p-6 flex flex-col items-center text-center lg:sticky lg:top-24">
          <Avatar user={currentUser} size="xl" />
          <h1 className="font-display font-semibold text-xl mt-4">{currentUser.displayName}</h1>
          <p className="font-mono text-sm text-ink-faint">@{currentUser.username}</p>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">{currentUser.bio}</p>

          <Button size="sm" className="mt-4 w-full">Edit profile</Button>

          <div className="w-full flex justify-around mt-5 pt-5 border-t border-border-soft">
            <div>
              <p className="font-display font-semibold text-lg">{currentUser.followers}</p>
              <p className="text-xs text-ink-faint">Followers</p>
            </div>
            <div>
              <p className="font-display font-semibold text-lg">{currentUser.following}</p>
              <p className="text-xs text-ink-faint">Following</p>
            </div>
            <div>
              <p className="font-display font-semibold text-lg flex items-center gap-1 justify-center">
                {currentUser.streak} <Flame size={14} className="text-accent-coral" />
              </p>
              <p className="text-xs text-ink-faint">Streak</p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2.5 mt-5 pt-5 border-t border-border-soft text-sm text-ink-muted">
            <div className="flex items-center gap-2 justify-center">
              <MapPin size={14} /> {currentUser.location}
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Calendar size={14} /> Joined {currentUser.joined}
            </div>
            <div className="flex items-center gap-2 justify-center">
              <GithubMark size={14} /> {currentUser.links.github}
            </div>
            <div className="flex items-center gap-2 justify-center">
              <LinkIcon size={14} /> {currentUser.links.website}
            </div>
          </div>

          <div className="w-full mt-5 pt-5 border-t border-border-soft">
            <p className="text-xs font-mono text-ink-faint uppercase tracking-wider mb-2.5 text-left">
              Skills
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {currentUser.skills.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
        </aside>

        {/* Right: content */}
        <div className="min-w-0">
          <div className="flex items-center gap-1 mb-5 border-b border-border overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors shrink-0 ${
                  tab === t
                    ? "border-accent-violet text-ink"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <div className="flex flex-col gap-5">
              <div className="bg-bg-surface border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-ink">Contribution activity</p>
                  <p className="text-xs text-ink-faint font-mono">312 contributions this year</p>
                </div>
                <ContributionGraph seed={11} size="md" />
              </div>

              <div>
                <p className="text-sm font-medium text-ink mb-3">Pinned projects</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {myProjects.slice(0, 2).map((p) => (
                    <div key={p.id} className="bg-bg-surface border border-border rounded-xl p-4">
                      <p className="font-mono text-sm text-accent-violet mb-1">{p.name}</p>
                      <p className="text-xs text-ink-muted leading-relaxed mb-3">{p.tagline}</p>
                      <div className="flex items-center gap-3 text-xs text-ink-faint font-mono">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: p.languageColor }} />
                          {p.language}
                        </span>
                        <span className="flex items-center gap-1"><Star size={12} /> {p.stars}</span>
                        <span className="flex items-center gap-1"><GitFork size={12} /> {p.forks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "Projects" && (
            <div className="grid sm:grid-cols-2 gap-3">
              {myProjects.map((p) => (
                <div key={p.id} className="bg-bg-surface border border-border rounded-xl p-4">
                  <p className="font-mono text-sm text-accent-violet mb-1">{p.name}</p>
                  <p className="text-xs text-ink-muted leading-relaxed mb-3">{p.tagline}</p>
                  <div className="flex items-center gap-3 text-xs text-ink-faint font-mono">
                    <span className="flex items-center gap-1"><Star size={12} /> {p.stars}</span>
                    <span className="flex items-center gap-1"><GitFork size={12} /> {p.forks}</span>
                  </div>
                </div>
              ))}
              {myProjects.length === 0 && (
                <p className="text-sm text-ink-faint">No pinned projects yet.</p>
              )}
            </div>
          )}

          {tab === "Posts" && (
            <div className="flex flex-col gap-3">
              {myPosts.map((post) => (
                <div key={post.id} className="bg-bg-surface border border-border rounded-xl p-4">
                  <p className="font-mono text-xs text-accent-violet mb-1.5">#{post.community}</p>
                  <p className="font-medium text-ink mb-1">{post.title}</p>
                  <p className="text-xs text-ink-faint font-mono">{post.upvotes} upvotes · {post.comments} comments</p>
                </div>
              ))}
            </div>
          )}

          {tab === "Activity" && (
            <div className="flex flex-col gap-3 font-mono text-sm text-ink-muted">
              <div className="bg-bg-surface border border-border rounded-xl p-4">
                <span className="text-accent-teal">+</span> merged PR in <span className="text-accent-violet">sprig</span>
                <span className="text-ink-faint ml-2 text-xs">2h ago</span>
              </div>
              <div className="bg-bg-surface border border-border rounded-xl p-4">
                <span className="text-accent-amber">→</span> replied in <span className="text-accent-violet">#react-devs</span>
                <span className="text-ink-faint ml-2 text-xs">6h ago</span>
              </div>
              <div className="bg-bg-surface border border-border rounded-xl p-4">
                <span className="text-accent-coral">★</span> starred <span className="text-accent-violet">cronwatch</span>
                <span className="text-ink-faint ml-2 text-xs">1d ago</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
