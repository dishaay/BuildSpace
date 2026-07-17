import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, Calendar, LinkIcon, Trophy, FolderGit2, FileText, Sparkles } from "lucide-react";
import GithubMark from "../components/common/GithubMark";
import AppShell from "../components/layout/AppShell";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";
import Button from "../components/common/Button";
import ContributionGraph from "../components/common/ContributionGraph";
import { getProfile, getGithubContributions,getUserById } from "../services/userService";
import { getProjects } from "../services/projectService";
import { getHackathons } from "../services/hackathonService";
import { getPosts } from "../services/postService";
import { useParams } from "react-router-dom";
const tabs = ["Overview", "Projects", "Hackathons", "Posts", "Activity"];

function getId(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value._id || value.id;
}

// Accepts either a bare username ("dishaay") or a full URL
// ("https://github.com/dishaay") and always returns just the username.
function extractGithubUsername(value) {
  if (!value) return null;
  const trimmed = value.trim();
  const match = trimmed.match(/github\.com\/([^/?#]+)/i);
  if (match) return match[1];
  return trimmed.replace(/^@/, "");
}

function githubHref(value) {
  const username = extractGithubUsername(value);
  return username ? `https://github.com/${username}` : null;
}

function toHref(value) {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function formatRelativeTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${Math.max(diffMins, 0)}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function DeveloperProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [myHackathons, setMyHackathons] = useState([]);
  const [myPosts, setMyPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Overview");

  // Real GitHub contribution data — fetched separately and best-effort,
  // since it depends on an external API and a username the user may not
  // have set. Falls back to the placeholder graph if unavailable.
  const [contributionWeeks, setContributionWeeks] = useState(null);
  const [contributionsError, setContributionsError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchProfileData() {
      setLoading(true);
      setError("");

      try {
        let profileRes;

if (id) {
    profileRes = await getUserById(id);
} else {
    profileRes = await getProfile();
}

const profileData = profileRes.data.user;
        const currentUserId = getId(profileData?._id || profileData?.id);

        const [projectsRes, hackathonsRes, postsRes] = await Promise.all([
          getProjects(),
          getHackathons(),
          getPosts(),
        ]);

        const allProjects = projectsRes.data.projects || projectsRes.data.data || [];
        // Confirmed shape: GET /hackathons -> { hackathons: [...] }
        // No /mine endpoint exists on the backend (it collides with the
        // /:id route), so we fetch everything and filter to this user's own.
        const allHackathons = hackathonsRes.data.hackathons || [];
        const allPosts = postsRes.data.posts || [];

        if (ignore) return;

        setProfile(profileData);
        setMyProjects(allProjects.filter((p) => getId(p.createdBy) === currentUserId));
        setMyHackathons(allHackathons.filter((h) => getId(h.createdBy) === currentUserId));
        setMyPosts(allPosts.filter((p) => getId(p.author) === currentUserId));

        // Best-effort: fetch the real GitHub contribution calendar if a
        // GitHub username/URL is set on the profile. Failure here doesn't
        // block the rest of the page — it just falls back to the
        // placeholder graph.
        const username = extractGithubUsername(profileData?.github);
        if (username) {
          try {
            const contribRes = await getGithubContributions(username);
            if (!ignore) setContributionWeeks(contribRes.data.weeks || null);
          } catch (err) {
            console.error("Couldn't fetch GitHub contributions:", err);
            if (!ignore) {
              setContributionsError(
                err.response?.data?.message || "Couldn't load GitHub contributions."
              );
            }
          }
        }
      } catch (err) {
        console.error("DeveloperProfilePage failed to load:", err);
        if (!ignore) {
          setError(err.response?.data?.message || err.message || "Couldn't load your profile.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProfileData();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-ink-muted">Loading profile...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !profile) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-accent-coral">{error || "Profile not found."}</p>
        </div>
      </AppShell>
    );
  }

  const stats = [
    { label: "Projects", value: myProjects.length, icon: FolderGit2 },
    { label: "Hackathons", value: myHackathons.length, icon: Trophy },
    { label: "Posts", value: myPosts.length, icon: FileText },
  ];

  // Derived "Activity" feed — no separate activity-tracking backend exists,
  // so this is just projects/hackathons/posts merged and sorted by date.
  const activityItems = [
    ...myProjects.map((p) => ({
      key: `project-${p._id}`,
      text: `Created project "${p.title}"`,
      date: p.createdAt,
      href: `/projects/${p._id}`,
    })),
    ...myHackathons.map((h) => ({
      key: `hackathon-${h._id}`,
      text: `Posted hackathon "${h.title}"`,
      date: h.createdAt,
      href: `/hackathons/${h._id}`,
    })),
    ...myPosts.map((post) => ({
      key: `post-${post._id}`,
      text: post.content?.length > 80 ? `${post.content.slice(0, 80)}…` : post.content || "Shared a post",
      date: post.createdAt,
      href: `/feed#post-${post._id}`,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Left: profile card */}
        <aside className="bg-bg-surface border border-border rounded-xl p-6 flex flex-col items-center text-center lg:sticky lg:top-24">
          <Avatar user={profile} size="xl" />

          <div className="flex items-center gap-2 flex-wrap justify-center mt-4">
            <h1 className="font-display font-semibold text-xl">{profile.name}</h1>
          </div>
          <p className="font-mono text-sm text-ink-faint">@{profile.username}</p>

          <p className="text-sm text-ink-muted mt-3 leading-relaxed">{profile.bio}</p>

          <Link to="/profile/edit" className="w-full mt-4">
            <Button size="sm" className="w-full">
              Edit profile
            </Button>
          </Link>

          {/* Stats: Projects / Hackathons / Posts */}
          <div className="w-full grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-border-soft">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <s.icon size={14} className="text-accent-violet mb-1" />
                <p className="font-display font-semibold text-lg">{s.value}</p>
                <p className="text-xs text-ink-faint">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col gap-2.5 mt-5 pt-5 border-t border-border-soft text-sm text-ink-muted">
            <div className="flex items-center gap-2 justify-center">
              <MapPin size={14} /> {profile.location}
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Calendar size={14} /> Joined {new Date(profile.createdAt).toLocaleDateString()}
            </div>
            {profile.github && (
              <a
                href={githubHref(profile.github)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 justify-center hover:text-accent-violet transition-colors"
              >
                <GithubMark size={14} /> {profile.github}
              </a>
            )}
            {profile.portfolio && (
              <a
                href={toHref(profile.portfolio)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 justify-center hover:text-accent-violet transition-colors"
              >
                <LinkIcon size={14} /> {profile.portfolio}
              </a>
            )}
          </div>

          <div className="w-full mt-5 pt-5 border-t border-border-soft">
            <p className="text-xs font-mono text-ink-faint uppercase tracking-wider mb-2.5 text-left">
              Skills
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {(profile.skills || []).map((s) => (
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
                  {contributionWeeks ? (
                    <p className="text-xs text-ink-faint font-mono">Live from GitHub</p>
                  ) : (
                    <p className="text-xs text-ink-faint font-mono">
                      {profile.github ? "Preview data" : "Add a GitHub link to see real activity"}
                    </p>
                  )}
                </div>
                <ContributionGraph weeks={contributionWeeks} seed={11} size="md" />
                {contributionsError && (
                  <p className="text-xs text-accent-coral mt-2">{contributionsError}</p>
                )}
              </div>

              {/* My Projects */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-ink">My projects</p>
                  {myProjects.length > 2 && (
                    <button
                      onClick={() => setTab("Projects")}
                      className="text-xs text-accent-violet hover:underline"
                    >
                      See all →
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {myProjects.slice(0, 2).map((p) => (
                    <Link
                      key={p._id}
                      to={`/projects/${p._id}`}
                      className="block bg-bg-surface border border-border rounded-xl p-4 hover:border-accent-violet transition"
                    >
                      <p className="font-mono text-sm text-accent-violet mb-1">{p.title}</p>
                      <p className="text-xs text-ink-muted leading-relaxed mb-3">{p.description}</p>
                      <div className="flex items-center gap-3 text-xs text-ink-faint font-mono flex-wrap">
                        {(p.techStack || []).slice(0, 3).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                        {p.status && <span>· {p.status}</span>}
                      </div>
                    </Link>
                  ))}
                  {myProjects.length === 0 && (
                    <p className="text-sm text-ink-faint">No pinned projects yet.</p>
                  )}
                </div>
              </div>

              {/* My Hackathons */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-ink">My hackathons</p>
                  {myHackathons.length > 2 && (
                    <button
                      onClick={() => setTab("Hackathons")}
                      className="text-xs text-accent-violet hover:underline"
                    >
                      See all →
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2.5">
                  {myHackathons.slice(0, 2).map((h) => (
                    <Link
                      to={`/hackathons/${h._id}`}
                      key={h._id}
                      className="flex items-center justify-between gap-3 bg-bg-surface border border-border rounded-xl px-4 py-3 hover:border-accent-violet transition"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-ink truncate">{h.title}</p>
                        <p className="text-xs text-ink-faint font-mono mt-0.5">
                          Max team size {h.maxTeamSize}
                          {Array.isArray(h.members) ? ` · ${h.members.length} members` : ""}
                        </p>
                      </div>
                      {h.status && (
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-accent-teal/15 text-accent-teal border border-accent-teal/30 shrink-0">
                          {h.status}
                        </span>
                      )}
                    </Link>
                  ))}
                  {myHackathons.length === 0 && (
                    <p className="text-sm text-ink-faint">No hackathons yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "Projects" && (
            <div className="grid sm:grid-cols-2 gap-3">
              {myProjects.map((p) => (
                <Link
                  key={p._id || p.id}
                  to={`/projects/${p._id}`}
                  className="block bg-bg-surface border border-border rounded-xl p-4 hover:border-accent-violet transition"
                >
                  <p className="font-mono text-sm text-accent-violet mb-1">{p.title}</p>
                  <p className="text-xs text-ink-muted leading-relaxed mb-3">{p.description}</p>
                  <div className="flex items-center gap-3 text-xs text-ink-faint font-mono flex-wrap">
                    {(p.techStack || []).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                    {p.status && <span>· {p.status}</span>}
                  </div>
                </Link>
              ))}
              {myProjects.length === 0 && (
                <p className="text-sm text-ink-faint">No pinned projects yet.</p>
              )}
            </div>
          )}

          {tab === "Hackathons" && (
            <div className="flex flex-col gap-3">
              {myHackathons.map((h) => (
                <Link
                  to={`/hackathons/${h._id}`}
                  key={h._id}
                  className="flex items-center justify-between gap-3 bg-bg-surface border border-border rounded-xl p-4 hover:border-accent-violet transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink truncate">{h.title}</p>
                    <p className="text-xs text-ink-faint font-mono mt-1">
                      Max team size {h.maxTeamSize}
                      {Array.isArray(h.members) ? ` · ${h.members.length} members` : ""}
                    </p>
                  </div>
                  {h.status && (
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-accent-teal/15 text-accent-teal border border-accent-teal/30 shrink-0">
                      {h.status}
                    </span>
                  )}
                </Link>
              ))}
              {myHackathons.length === 0 && (
                <p className="text-sm text-ink-faint">No hackathons yet.</p>
              )}
            </div>
          )}

          {tab === "Posts" && (
            <div className="flex flex-col gap-3">
              {myPosts.map((post) => (
                <Link
                  key={post._id || post.id}
                  to={`/feed#post-${post._id}`}
                  className="bg-bg-surface border border-border rounded-xl p-4 hover:border-accent-violet/40 transition-colors block"
                >
                  <p className="text-sm text-ink leading-relaxed line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-3 text-xs text-ink-faint font-mono mt-2.5">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{post.likes?.length || 0} likes</span>
                  </div>
                </Link>
              ))}
              {myPosts.length === 0 && <p className="text-sm text-ink-faint">No posts yet.</p>}
            </div>
          )}

          {tab === "Activity" && (
            <div className="flex flex-col gap-3">
              {activityItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className="flex items-center justify-between gap-3 bg-bg-surface border border-border rounded-xl px-4 py-3 hover:border-accent-violet/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Sparkles size={14} className="text-accent-violet shrink-0" />
                    <p className="text-sm text-ink-muted truncate">{item.text}</p>
                  </div>
                  <span className="text-xs text-ink-faint font-mono shrink-0">
                    {formatRelativeTime(item.date)}
                  </span>
                </Link>
              ))}
              {activityItems.length === 0 && (
                <p className="text-sm text-ink-faint">No recent activity yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}