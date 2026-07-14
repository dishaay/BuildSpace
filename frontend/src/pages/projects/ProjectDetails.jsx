import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { Github, ExternalLink, Loader2, ArrowLeft, Star, GitFork } from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import Avatar from "../../components/common/Avatar";
import Tag from "../../components/common/Tag";
import Button from "../../components/common/Button";

const statusStyles = {
  "In Progress": "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  Completed: "bg-accent-teal/15 text-accent-teal border-accent-teal/30",
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchProject() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/projects/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = res.data?.data || res.data;
        if (!ignore) setProject(data);
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message || "Couldn't load this project. It may not exist."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProject();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto flex items-center justify-center py-24">
          <div className="flex items-center gap-2.5 text-ink-muted text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading project...
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !project) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">
          <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-4 py-3 mb-4">
            {error || "Project not found."}
          </div>
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate("/projects")}>
            Back to showcase
          </Button>
        </div>
      </AppShell>
    );
  }
const {
  title,
  description,
  inspiration,
  journey,
  challenges,
  futurePlans,
  screenshots = [],
  techStack = [],
  tags = [],
  githubLink,
  liveLink,
  thumbnail,
  status,
  createdBy,
} = project;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-5"
        >
          <ArrowLeft size={15} />
          Back to showcase
        </button>

        <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
          {/* Thumbnail */}
          <div className="w-full h-56 sm:h-72 bg-bg-hover flex items-center justify-center overflow-hidden">
            {thumbnail ? (
              <img src={thumbnail} alt={`${title} thumbnail`} className="w-full h-full object-cover" />
            ) : (
              <span className="font-mono text-xs text-ink-faint">No thumbnail provided</span>
            )}
          </div>

          <div className="p-5 sm:p-7">
            {/* Title + status */}
            <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
              <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink">{title}</h1>
              {status && (
                <span
                  className={`shrink-0 font-mono text-xs px-2.5 py-1 rounded-full border ${
                    statusStyles[status] || "bg-bg-hover text-ink-muted border-border"
                  }`}
                >
                  {status}
                </span>
              )}
            </div>

            {/* Creator */}
            {createdBy && (
              <Link
                to={`/profile/${createdBy._id || createdBy.id || ""}`}
                className="inline-flex items-center gap-2.5 mb-5 group w-fit"
              >
                <Avatar
                  user={{
                    avatar:
                      createdBy.avatar ||
                      (createdBy.displayName || createdBy.username || "?").slice(0, 2).toUpperCase(),
                    avatarColor: createdBy.avatarColor || "bg-accent-violet",
                  }}
                  size="sm"
                />
                <div>
                  <p className="text-sm text-ink group-hover:text-accent-violet transition-colors">
                    {createdBy.displayName || createdBy.username}
                  </p>
                  {createdBy.username && (
                    <p className="text-xs text-ink-faint font-mono">@{createdBy.username}</p>
                  )}
                </div>
              </Link>
            )}

            {/* Stars / forks, if provided by the API */}
            {(stars !== undefined || forks !== undefined) && (
              <div className="flex items-center gap-4 text-xs text-ink-faint font-mono mb-5">
                {stars !== undefined && (
                  <span className="flex items-center gap-1">
                    <Star size={13} /> {stars}
                  </span>
                )}
                {forks !== undefined && (
                  <span className="flex items-center gap-1">
                    <GitFork size={13} /> {forks}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap mb-6">
              {description}
            </p>
            {inspiration && (
  <section className="mb-6">
    <h2 className="font-semibold text-lg mb-2">
      Inspiration
    </h2>

    <p className="text-ink-muted whitespace-pre-wrap">
      {inspiration}
    </p>
  </section>
)}
{project.inspiration && (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-2">
      Inspiration
    </h2>

    <p className="text-ink-muted whitespace-pre-wrap">
      {project.inspiration}
    </p>
  </div>
)}
{project.journey && (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-2">
      Development Journey
    </h2>

    <p className="text-ink-muted whitespace-pre-wrap">
      {project.journey}
    </p>
  </div>
)}
{project.challenges && (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-2">
      Challenges Faced
    </h2>

    <p className="text-ink-muted whitespace-pre-wrap">
      {project.challenges}
    </p>
  </div>
)}
{project.futurePlans && (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-2">
      Future Improvements
    </h2>

    <p className="text-ink-muted whitespace-pre-wrap">
      {project.futurePlans}
    </p>
  </div>
)}

            {/* Tech stack */}
            {techStack.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-mono text-ink-faint uppercase tracking-wider mb-2.5">
                  Tech stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            )}

{project.screenshots?.length > 0 && (
  <div className="mb-8">
    <h2 className="font-display text-lg font-semibold mb-4">
      Screenshots
    </h2>

    <div className="grid md:grid-cols-2 gap-4">
      {project.screenshots.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Screenshot ${index + 1}`}
          className="rounded-xl border border-border object-cover"
        />
      ))}
    </div>
  </div>
)}
            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-mono text-ink-faint uppercase tracking-wider mb-2.5">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Tag key={t}>#{t}</Tag>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-5 border-t border-border-soft flex-wrap">
              {githubLink && (
                <a href={githubLink} target="_blank" rel="noreferrer">
                  <Button variant="secondary" icon={Github}>
                    View on GitHub
                  </Button>
                </a>
              )}
              {liveLink && (
                <a href={liveLink} target="_blank" rel="noreferrer">
                  <Button icon={ExternalLink} className="flex-row-reverse">
                    Live demo
                  </Button>
                </a>
              )}
              {!githubLink && !liveLink && (
                <p className="text-xs text-ink-faint">No links provided for this project.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-6 mt-6">

<div className="flex items-center gap-8 mb-6">

<button className="flex items-center gap-2 hover:text-accent-violet">
<Heart />
{project.likes?.length || 0}
</button>

<button className="flex items-center gap-2 hover:text-accent-violet">
<MessageCircle />
{project.comments?.length || 0}
</button>

</div>

<CommentSection />

</div>
    </AppShell>
  );
}