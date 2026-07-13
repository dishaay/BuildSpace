import { getProfile } from "../../services/userService";

import { useEffect, useState } from "react";
import { Trophy, FolderGit2, Users, ExternalLink, Globe } from "lucide-react";
import GithubMark from "../../components/common/GithubMark";
import LinkedinMark from "../../components/common/LinkedinMark";

const statusStyles = {
  "In Progress": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

function SectionHeading({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={16} className="text-indigo-400" />
      <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">{children}</h2>
    </div>
  );
}

export default function PublicProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await getProfile();
        const data = res?.data?.data || res?.data || res;
        if (!ignore) setProfile(data);
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Couldn't load this profile.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 max-w-sm text-center">
          {error || "Profile not found."}
        </div>
      </div>
    );
  }

  const {
    username,
    displayName,
    avatarUrl,
    profilePicture,
    bio,
    skills = [],
    githubUrl,
    linkedinUrl,
    portfolioUrl,
    lookingForTeam,
    projects = [],
    hackathons = [],
  } = profile;

  const avatarSrc = profilePicture || avatarUrl;

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
              {avatarSrc ? (
                <img src={avatarSrc} alt={username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-semibold text-slate-500">
                  {(displayName || username || "?").slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-100">
                  {displayName || username}
                </h1>
                {lookingForTeam && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    <Users size={12} />
                    Looking for a team
                  </span>
                )}
              </div>
              {username && <p className="text-sm text-slate-500 font-mono mt-0.5">@{username}</p>}
              {bio && <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-xl">{bio}</p>}

              {/* Social links */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 flex-wrap">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-300 border border-slate-700 hover:border-indigo-500/50 hover:text-indigo-300 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <GithubMark size={14} />
                    GitHub
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-300 border border-slate-700 hover:border-indigo-500/50 hover:text-indigo-300 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <LinkedinMark size={14} />
                    LinkedIn
                  </a>
                )}
                {portfolioUrl && (
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-300 border border-slate-700 hover:border-indigo-500/50 hover:text-indigo-300 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <Globe size={14} />
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-6">
          <SectionHeading icon={FolderGit2}>Projects</SectionHeading>

          {projects.length === 0 ? (
            <p className="text-sm text-slate-500">No projects shared yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <a
                  key={p._id || p.id}
                  href={`/projects/${p._id || p.id}`}
                  className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/40 transition-colors"
                >
                  <div className="w-full h-28 bg-slate-800 flex items-center justify-center overflow-hidden">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-mono text-slate-600">No thumbnail</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {p.title}
                      </p>
                      <ExternalLink
                        size={13}
                        className="text-slate-600 group-hover:text-indigo-300 transition-colors shrink-0 mt-0.5"
                      />
                    </div>
                    {p.status && (
                      <span
                        className={`inline-block mt-2 text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                          statusStyles[p.status] || "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    )}
                    {Array.isArray(p.techStack) && p.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.techStack.slice(0, 4).map((t) => (
                          <span key={t} className="text-[11px] font-mono text-slate-500">
                            {t}
                            {p.techStack.indexOf(t) < Math.min(p.techStack.length, 4) - 1 ? " ·" : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Hackathons */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <SectionHeading icon={Trophy}>Hackathons</SectionHeading>

          {hackathons.length === 0 ? (
            <p className="text-sm text-slate-500">No hackathons attended yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {hackathons.map((h) => (
                <div
                  key={h._id || h.id}
                  className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">{h.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {h.date}
                      {h.role ? ` · ${h.role}` : ""}
                    </p>
                  </div>
                  {h.result && (
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
                      {h.result}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}