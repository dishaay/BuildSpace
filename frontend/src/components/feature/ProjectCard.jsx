import { useState,useEffect } from "react";
import GithubMark from "../../components/common/GithubMark";
import Avatar from "../../components/common/Avatar";
import Tag from "../common/Tag";
import { Heart, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { toggleLike, toggleBookmark } from "../../services/projectService";

function getId(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value._id || value.id;
}

/**
 * Props:
 * - project: the project object
 * - currentUserId: id of the logged-in user, passed down from the page
 *   (fetched once via getProfile() up there, not re-fetched per card)
 * - onDelete: (project) => void
 */
export default function ProjectCard({ project, currentUserId, onDelete }) {

  useEffect(() => {
    setLiked(
        (project.likes || []).some(
            (id) => getId(id) === currentUserId
        )
    );

    setBookmarked(
        (project.bookmarks || []).some(
            (id) => getId(id) === currentUserId
        )
    );
}, [project, currentUserId]);
  const [liked, setLiked] = useState(
    (project.likes || []).some((id) => getId(id) === currentUserId)
  );
  const [likesCount, setLikesCount] = useState(project.likes?.length || 0);
  const [liking, setLiking] = useState(false);

  const [bookmarked, setBookmarked] = useState(
    (project.bookmarks || []).some((id) => getId(id) === currentUserId)
  );
  const [bookmarksCount, setBookmarksCount] = useState(project.bookmarks?.length || 0);
  const [bookmarking, setBookmarking] = useState(false);

  const isOwner = getId(project.createdBy) === currentUserId;

  async function handleToggleLike(e) {
    e.preventDefault();
    e.stopPropagation();
    if (liking) return;
    setLiking(true);

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((prev) => prev + (wasLiked ? -1 : 1));

    try {
      const res = await toggleLike(project._id);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      setLiked(wasLiked);
      setLikesCount((prev) => prev + (wasLiked ? 1 : -1));
      console.error("Failed to toggle like:", err);
    } finally {
      setLiking(false);
    }
  }

  async function handleToggleBookmark(e) {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarking) return;
    setBookmarking(true);

    const wasBookmarked = bookmarked;
    setBookmarked(!wasBookmarked);
    setBookmarksCount((prev) => prev + (wasBookmarked ? -1 : 1));

    try {
      const res = await toggleBookmark(project._id);
      setBookmarked(res.data.bookmarked);
      setBookmarksCount(res.data.bookmarksCount);
    } catch (err) {
      setBookmarked(wasBookmarked);
      setBookmarksCount((prev) => prev + (wasBookmarked ? 1 : -1));
      console.error("Failed to toggle bookmark:", err);
    } finally {
      setBookmarking(false);
    }
  }

  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-accent-violet transition">

      {/* Clickable Section */}
      <Link
        to={`/projects/${project._id}`}
        className="block"
      >

        {project.thumbnail && (
  <img
    src={project.thumbnail}
    alt={project.title}
    className="w-full h-48 object-cover rounded-lg mb-4"
  />
)}
        {/* Title */}
        <div>
          <h3 className="font-display text-lg font-semibold">
            {project.title}
          </h3>

          <p className="text-sm text-ink-muted mt-2">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(project.techStack || []).map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        {/* Owner */}
        <div className="flex items-center gap-3 mt-4">
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
      </Link>

      {/* Edit/Delete */}
      {isOwner && (
        <div className="flex gap-4">
          <Link
            to={`/projects/edit/${project._id}`}
            className="text-blue-500 hover:underline text-sm"
          >
            Edit
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="text-red-500 hover:underline text-sm"
          >
            Delete
          </button>
        </div>
      )}

      {/* Bottom */}
      <div className="flex justify-between items-center pt-3 border-t border-border">
        <div className="flex gap-4 text-sm">
          <button
            onClick={handleToggleLike}
            disabled={liking}
            className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${
              liked ? "text-accent-coral" : "text-ink-muted hover:text-accent-violet"
            }`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            {likesCount}
          </button>

          <button
            onClick={handleToggleBookmark}
            disabled={bookmarking}
            className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${
              bookmarked ? "text-accent-amber" : "text-ink-muted hover:text-accent-violet"
            }`}
          >
<Bookmark
    size={18}
    fill={bookmarked ? "currentColor" : "none"}
    className={
        bookmarked
            ? "text-accent-violet"
            : "text-ink-muted"
    }
/>            {bookmarksCount}
          </button>
        </div>

        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
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