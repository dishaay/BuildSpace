import { Star, GitFork, Users } from "lucide-react";
import Avatar from "../common/Avatar";
import Tag from "../common/Tag";

export default function ProjectCard({ project }) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-ink-faint/40 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-mono font-semibold text-ink group-hover:text-accent-violet transition-colors truncate">
            {project.name}
          </h3>
          <p className="text-sm text-ink-muted mt-1 leading-relaxed">{project.tagline}</p>
        </div>
        {project.lookingForCollaborators && (
          <span className="shrink-0 text-[10px] font-mono font-medium px-2 py-1 rounded-full bg-accent-teal/15 text-accent-teal border border-accent-teal/30">
            open to collab
          </span>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {project.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 mt-auto border-t border-border-soft">
        <div className="flex items-center gap-2">
          <Avatar user={project.owner} size="xs" />
          <span className="text-xs text-ink-muted">{project.owner.displayName}</span>
        </div>
        <div className="flex items-center gap-3 text-ink-faint text-xs font-mono">
          <span className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: project.languageColor }}
            />
            {project.language}
          </span>
          <span className="flex items-center gap-1">
            <Star size={13} /> {project.stars.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={13} /> {project.forks}
          </span>
        </div>
      </div>
    </div>
  );
}
