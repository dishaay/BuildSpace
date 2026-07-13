import GithubMark from "../common/GithubMark";
import Avatar from "../common/Avatar";
import Tag from "../common/Tag";
import { Heart, ExternalLink, User,Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-accent-violet transition">

      {/* Title */}
      <div>
        <h3 className="font-display text-lg font-semibold">
          {project.title}
        </h3>

        <p className="text-sm text-ink-muted mt-2">
          {project.description}
        </p>
      </div>

      {project.createdBy?._id === JSON.parse(localStorage.getItem("user"))?._id && (
  <Link
    to={`/projects/edit/${project._id}`}
    className="text-blue-500 hover:underline text-sm"
  >
    Edit
  </Link>
)}

<button
  onClick={handleDelete}
  className="text-red-500 hover:underline text-sm"
>
  Delete
</button>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2">
        {(project.techStack || []).map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </div>

      {/* Owner */}
      <div className="flex items-center gap-3">
        <Avatar user={project.createdBy} size="sm" />

        <div>
          <p className="text-sm font-medium">
            {project.createdBy?.username}
          </p>

          <p className="text-xs text-ink-muted">
            {project.status}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between items-center pt-3 border-t border-border">

        <div className="flex gap-4 text-sm">

          <div className="flex items-center gap-1">
            <Heart size={16} />
            {project.likes?.length || 0}
          </div>

          <div className="flex items-center gap-1">
            <Bookmark size={16} />
            {project.bookmarks?.length || 0}
          </div>

        </div>

        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            className="text-accent-violet hover:underline flex items-center gap-1"
          >
            <GithubMark size={16} />
            GitHub
          </a>
        )}
      </div>

    </div>
  );
}