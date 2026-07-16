import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, Calendar, LinkIcon, Trophy, FolderGit2, FileText } from "lucide-react";
import GithubMark from "../components/common/GithubMark";
import AppShell from "../components/layout/AppShell";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";
import Button from "../components/common/Button";
import ContributionGraph from "../components/common/ContributionGraph";
import { getProfile } from "../services/userService";
import { getProjects } from "../services/projectService";
import { getMyHackathons } from "../services/hackathonService";

const tabs = ["Overview", "Projects", "Hackathons", "Posts", "Activity"];

function getId(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value._id || value.id;
}

export default function DeveloperProfilePage() {
  const [profile, setProfile] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [myHackathons, setMyHackathons] = useState([]);
  // No posts service exists yet — kept as an empty list so the Posts tab
  // has something to map over without inventing a data source.
  const [myPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Overview");

  useEffect(() => {
    let ignore = false;

    async function fetchProfileData() {
  setLoading(true);
  setError("");

  try {
    // Get profile
    const profileRes = await getProfile();
    console.log("PROFILE RESPONSE:", profileRes.data);

    const profileData = profileRes.data.user;
    const currentUserId = profileData._id;

    // Get projects
    const projectsRes = await getProjects();
    console.log("PROJECTS RESPONSE:", projectsRes.data);

    // Get hackathons
    const hackathonsRes = await getMyHackathons();
    console.log("HACKATHONS RESPONSE:", hackathonsRes.data);

    const allProjects =
      projectsRes.data.projects ||
      projectsRes.data.data ||
      [];

    setMyHackathons(
    hackathonsRes.data.hackathons || []
);

    if (ignore) return;

    setProfile(profileData);

    setMyProjects(
      allProjects.filter((p) => getId(p.createdBy) === currentUserId)
    );

    setMyHackathons(
  hackathonsRes.data.hackathons || hackathonsRes.data
);

  } catch (err) {
    console.error("FULL ERROR:", err);
    console.error("RESPONSE:", err.response);

    if (!ignore) {
      setError(err.response?.data?.message || "Couldn't load your profile.");
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
  console.log(myHackathons);
console.log(myHackathons.length);
  const stats = [
    { label: "Projects", value: myProjects.length, icon: FolderGit2 },
    { label: "Hackathons", value: myHackathons.length, icon: Trophy },
    { label: "Posts", value: myPosts.length, icon: FileText },
  ];

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
            <div className="flex items-center gap-2 justify-center">
              <GithubMark size={14} /> {profile.github}
            </div>
            <div className="flex items-center gap-2 justify-center">
              <LinkIcon size={14} /> {profile.portfolio}
            </div>
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
                  <p className="text-xs text-ink-faint font-mono">312 contributions this year</p>
                </div>
                <ContributionGraph seed={11} size="md" />
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
                    <div key={p._id || p.id} className="bg-bg-surface border border-border rounded-xl p-4">
                      <p className="font-mono text-sm text-accent-violet mb-1">{p.title}</p>
                      <p className="text-xs text-ink-muted leading-relaxed mb-3">{p.description}</p>
                      <div className="flex items-center gap-3 text-xs text-ink-faint font-mono flex-wrap">
                        {(p.techStack || []).slice(0, 3).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                        {p.status && <span>· {p.status}</span>}
                      </div>
                    </div>
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
                    <div
                      key={h._id || h.id}
                      className="flex items-center justify-between gap-3 bg-bg-surface border border-border rounded-xl px-4 py-3"
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
                    </div>
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
                <div key={p._id || p.id} className="bg-bg-surface border border-border rounded-xl p-4">
                  <p className="font-mono text-sm text-accent-violet mb-1">{p.title}</p>
                  <p className="text-xs text-ink-muted leading-relaxed mb-3">{p.description}</p>
                  <div className="flex items-center gap-3 text-xs text-ink-faint font-mono flex-wrap">
                    {(p.techStack || []).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                    {p.status && <span>· {p.status}</span>}
                  </div>
                </div>
              ))}
              {myProjects.length === 0 && (
                <p className="text-sm text-ink-faint">No pinned projects yet.</p>
              )}
            </div>
          )}

          {tab === "Hackathons" && (
            <div className="flex flex-col gap-3">
              {myHackathons.map((h) => (
                <div
                  key={h._id || h.id}
                  className="flex items-center justify-between gap-3 bg-bg-surface border border-border rounded-xl p-4"
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
                </div>
              ))}
              {myHackathons.length === 0 && (
                <p className="text-sm text-ink-faint">No hackathons yet.</p>
              )}
            </div>
          )}

          {tab === "Posts" && (
            <div className="flex flex-col gap-3">
              {myPosts.map((post) => (
                <div key={post._id || post.id} className="bg-bg-surface border border-border rounded-xl p-4">
                  <p className="font-medium text-ink mb-1">{post.title}</p>
                </div>
              ))}
              {myPosts.length === 0 && <p className="text-sm text-ink-faint">No posts yet.</p>}
            </div>
          )}

          {tab === "Activity" && (
            <div className="flex flex-col gap-3 font-mono text-sm text-ink-muted">
              <p className="text-sm text-ink-faint font-sans">No recent activity yet.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}