import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import GithubMark from "../../components/common/GithubMark";
import { toggleLike } from "../../services/projectService";
import { getComments, createComment } from "../../services/commentService";
import { getProfile } from "../../services/userService";
import { toggleBookmark } from "../../services/projectService"

import {
  ExternalLink,
  Loader2,
  ArrowLeft,
  Star,
  GitFork,
  Heart,
  MessageCircle,
  Bookmark,
} from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import Avatar from "../../components/common/Avatar";
import Tag from "../../components/common/Tag";
import Button from "../../components/common/Button";

const statusStyles = {
  "In Progress": "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  Completed: "bg-accent-teal/15 text-accent-teal border-accent-teal/30",
};

function getId(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value._id || value.id;
}

function formatTimestamp(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liking, setLiking] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchProject() {
  setLoading(true);
  setError("");

  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`/api/projects/${id}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    
    const data =
      res.data?.project ||
      res.data?.data ||
      res.data;
    console.log(res.data);
    console.log("LIKES:", data.likes);
console.log("BOOKMARKS:", data.bookmarks);
    if (ignore) return;

    setProject(data);

    setLikesCount(data?.likes?.length || 0);

    try {
      const profileRes = await getProfile();

      const profile =
        profileRes.data.user;

      const myId = getId(
        profile?._id || profile?.id
      );

      if (!ignore) {
        setCurrentUserId(myId);

        // LIKE STATE
        setLiked(
          (data?.likes || []).some(
            (likeId) =>
              getId(likeId) === myId
          )
        );

        // BOOKMARK STATE
        setBookmarked(
          (data?.bookmarks || []).some(
            (bookmarkId) =>
              getId(bookmarkId) === myId
          )
        );
      }
    } catch {
      // user not logged in
    }
  } catch (err) {
    if (!ignore) {
      setError(
        err.response?.data?.message ||
          "Couldn't load this project. It may not exist."
      );
    }
  } finally {
    if (!ignore) {
      setLoading(false);
    }
  }
}

    fetchProject();
    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    let ignore = false;

    async function fetchComments() {
      setCommentsLoading(true);
      try {
        const res = await getComments(id);
        if (!ignore) setComments(res.data.comments || []);
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        if (!ignore) setCommentsLoading(false);
      }
    }

    fetchComments();
    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleToggleLike() {
    if (liking) return;
    setLiking(true);

    // Optimistic update — flip it immediately, roll back if the request fails.
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((prev) => prev + (wasLiked ? -1 : 1));

    try {
      const res = await toggleLike(id);
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
  const handleToggleBookmark = async () => {
  try {
    console.log("bookmark ca")
    await toggleBookmark(id);
    setBookmarked((prev) => !prev);
    console.log("BOOKMARK CLICKED");
  } catch (err) {
    console.log(err);
  }
};
  async function handleSubmitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentError("");
    setPostingComment(true);

    try {
      const res = await createComment(id, { text: commentText.trim() });
      setComments((prev) => [res.data.comment, ...prev]);
      setCommentText("");
    } catch (err) {
      setCommentError(err.response?.data?.message || "Couldn't post your comment.");
    } finally {
      setPostingComment(false);
    }
  }

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
  stars,
  forks,
} = project;
console.log("LIKED:", liked);
console.log("BOOKMARKED:", bookmarked);
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
                  <Button variant="secondary" icon={GithubMark}>
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
      <div className="max-w-3xl mx-auto border-t border-border pt-6 mt-6">

<div className="flex items-center gap-8 mb-6">
  <button
    onClick={handleToggleLike}
    disabled={liking}
    className={`flex items-center gap-2 transition-all disabled:opacity-50 ${
      liked
        ? "text-red-500"
        : "text-ink-muted hover:text-red-500"
    }`}
  >
    <Heart
    size={18}
    fill={liked ? "currentColor" : "none"}
    className={
        liked
            ? "text-red-500"
            : "text-ink-muted"
    }
/>
    {likesCount}
  </button>

  <button
    onClick={handleToggleBookmark}
    className={`flex items-center gap-2 transition-all ${
      bookmarked
        ? "text-accent-violet"
        : "text-ink-muted hover:text-accent-violet"
    }`}
  >
    <Bookmark
      size={18}
      className={
        bookmarked
          ? "fill-accent-violet text-accent-violet"
          : ""
      }
    />
  </button>

  <span className="flex items-center gap-2 text-ink-muted">
    <MessageCircle size={18} />
    {comments.length}
  </span>
</div>
{/* Comment form */}
<form onSubmit={handleSubmitComment} className="flex flex-col gap-2.5 mb-6">
  {commentError && (
    <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-3.5 py-2.5">
      {commentError}
    </div>
  )}
  <textarea
    rows={3}
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    placeholder="Leave a comment..."
    disabled={postingComment}
    className="w-full bg-bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors resize-none disabled:opacity-50"
  />
  <Button type="submit" size="sm" disabled={postingComment || !commentText.trim()} className="self-end">
    {postingComment ? "Posting..." : "Post comment"}
  </Button>
</form>

{/* Comment list */}
{commentsLoading ? (
  <div className="flex items-center gap-2 text-sm text-ink-muted">
    <Loader2 size={14} className="animate-spin" />
    Loading comments...
  </div>
) : comments.length === 0 ? (
  <p className="text-sm text-ink-faint">No comments yet — be the first to say something.</p>
) : (
  <div className="flex flex-col gap-4">
    {comments.map((c) => (
      <div key={c._id || c.id} className="flex gap-3">
        <Avatar
          user={{
            avatar: (c.user?.name || c.user?.username || "?").slice(0, 2).toUpperCase(),
            avatarColor: "bg-accent-violet",
          }}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-ink">
              {c.user?.name || c.user?.username || "Someone"}
            </p>
            <span className="text-xs text-ink-faint font-mono">{formatTimestamp(c.createdAt)}</span>
          </div>
          <p className="text-sm text-ink-muted mt-0.5 whitespace-pre-wrap">{c.text}</p>
        </div>
      </div>
    ))}
  </div>
)}

</div>
    </AppShell>
  );
}