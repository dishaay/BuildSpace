import { useEffect, useRef, useState } from "react";
import {
  TrendingUp,
  Clock,
  Flame,
  PenSquare,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  Trash2,
  Loader2,
  ImagePlus,
  X,
} from "lucide-react";
import AppShell from "../components/layout/AppShell";
import CommunityCard from "../components/feature/CommunityCard";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import { communities, users } from "../data/dummyData";
import {
  getPosts,
  createPost,
  deletePost,
  toggleLikePost,
  toggleBookmarkPost,
  getPostComments,
  createPostComment,
} from "../services/postService";
import { getProfile } from "../services/userService";

const sortOptions = [
  { key: "top", label: "Top", icon: TrendingUp },
  { key: "new", label: "New", icon: Clock },
  { key: "hot", label: "Hot", icon: Flame },
];

function getId(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value._id || value.id;
}

function formatTimestamp(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${Math.max(diffMins, 0)}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function CommentThread({ postId, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchComments() {
      setLoading(true);
      try {
        const res = await getPostComments(postId);
        if (!ignore) setComments(res.data.comments || []);
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchComments();
    return () => {
      ignore = true;
    };
  }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    setError("");
    setPosting(true);
    try {
      const res = await createPostComment(postId, { text: text.trim() });
      setComments((prev) => [res.data.comment, ...prev]);
      setText("");
      onCommentAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't post your comment.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-border-soft flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          disabled={posting}
          className="flex-1 text-sm bg-bg-hover rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint outline-none focus:ring-1 focus:ring-accent-violet/50 transition-colors disabled:opacity-50"
        />
        <Button type="submit" size="sm" disabled={posting || !text.trim()}>
          {posting ? "..." : "Reply"}
        </Button>
      </form>

      {error && <p className="text-xs text-accent-coral">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Loader2 size={12} className="animate-spin" />
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-ink-faint">No comments yet.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-2.5">
              <Avatar
                user={{
                  avatar: (c.user?.name || c.user?.username || "?").slice(0, 2).toUpperCase(),
                  avatarColor: "bg-accent-teal",
                }}
                size="xs"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-ink">
                    {c.user?.name || c.user?.username || "Someone"}
                  </span>
                  <span className="text-[11px] text-ink-faint font-mono">{formatTimestamp(c.createdAt)}</span>
                </div>
                <p className="text-xs text-ink-muted mt-0.5 whitespace-pre-wrap">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedPostCard({ post, currentUserId, onDeleted }) {
  const [liked, setLiked] = useState((post.likes || []).some((id) => getId(id) === currentUserId));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [liking, setLiking] = useState(false);

  const [bookmarked, setBookmarked] = useState(
    (post.bookmarks || []).some((id) => getId(id) === currentUserId)
  );
  const [bookmarksCount, setBookmarksCount] = useState(post.bookmarks?.length || 0);
  const [bookmarking, setBookmarking] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [shareLabel, setShareLabel] = useState("Share");
  const [deleting, setDeleting] = useState(false);

  const isOwner = getId(post.author) === currentUserId;

  async function handleToggleLike() {
    if (liking) return;
    setLiking(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((prev) => prev + (wasLiked ? -1 : 1));

    try {
      const res = await toggleLikePost(post._id);
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

  async function handleToggleBookmark() {
    if (bookmarking) return;
    setBookmarking(true);
    const wasBookmarked = bookmarked;
    setBookmarked(!wasBookmarked);
    setBookmarksCount((prev) => prev + (wasBookmarked ? -1 : 1));

    try {
      const res = await toggleBookmarkPost(post._id);
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

  async function handleShare() {
    const url = `${window.location.origin}/feed#post-${post._id}`;

    if (navigator.share) {
      try {
        await navigator.share({ text: post.content, url });
      } catch {
        // user cancelled the native share sheet — not an error
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareLabel("Copied!");
      setTimeout(() => setShareLabel("Share"), 1500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    try {
      await deletePost(post._id);
      onDeleted(post._id);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setDeleting(false);
    }
  }

  return (
    <article id={`post-${post._id}`} className="bg-bg-surface border border-border rounded-xl p-4 hover:border-ink-faint/50 transition-colors">
      <div className="flex gap-3">
        <Avatar
          user={{
            avatar: (post.author?.name || post.author?.username || "?").slice(0, 2).toUpperCase(),
            avatarColor: "bg-accent-violet",
          }}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap text-xs text-ink-muted">
              <span className="text-ink font-medium text-sm">
                {post.author?.name || post.author?.username || "Someone"}
              </span>
              <span>·</span>
              <span className="font-mono">{formatTimestamp(post.createdAt)}</span>
            </div>
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-ink-faint hover:text-accent-coral transition-colors disabled:opacity-50 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <p className="text-sm text-ink-muted leading-relaxed mt-2 whitespace-pre-wrap">{post.content}</p>

          {post.images?.length > 0 && (
            <div className={`grid gap-2 mt-3 ${post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {post.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Post image ${i + 1}`}
                  className="rounded-lg border border-border object-cover w-full max-h-72"
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleToggleLike}
              disabled={liking}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                liked ? "text-accent-coral" : "text-ink-faint hover:text-accent-violet"
              }`}
            >
              <Heart size={15} fill={liked ? "currentColor" : "none"} />
              {likesCount}
            </button>

            <button
              onClick={() => setShowComments((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-ink-faint hover:text-accent-violet transition-colors"
            >
              <MessageCircle size={15} />
              {commentsCount}
            </button>

            <button
              onClick={handleToggleBookmark}
              disabled={bookmarking}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                bookmarked ? "text-accent-amber" : "text-ink-faint hover:text-accent-violet"
              }`}
            >
              <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
              {bookmarksCount}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-medium text-ink-faint hover:text-accent-violet transition-colors ml-auto"
            >
              <Share2 size={15} />
              {shareLabel}
            </button>
          </div>

          {showComments && (
            <CommentThread postId={post._id} onCommentAdded={() => setCommentsCount((prev) => prev + 1)} />
          )}
        </div>
      </div>
    </article>
  );
}

export default function HomeFeedPage() {
  const [sort, setSort] = useState("top");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [composerText, setComposerText] = useState("");
  const [composerImages, setComposerImages] = useState([]); // File objects
  const [composerPreviews, setComposerPreviews] = useState([]); // object URLs
  const [posting, setPosting] = useState(false);
  const [composerError, setComposerError] = useState("");
  const fileInputRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchFeed() {
      setLoading(true);
      setError("");
      try {
        const [profileRes, postsRes] = await Promise.all([
          getProfile().catch((err) => {
            console.error("Couldn't fetch profile for feed personalization:", err);
            return null;
          }),
          getPosts(),
        ]);

        if (ignore) return;

        if (profileRes) {
          const profile = profileRes.data.user;
          setCurrentUserId(getId(profile?._id || profile?.id));
        }

        setPosts(postsRes.data.posts || []);
      } catch (err) {
        console.error("HomeFeedPage failed to load:", err);
        if (!ignore) {
          setError(err.response?.data?.message || err.message || "Couldn't load the feed.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchFeed();
    return () => {
      ignore = true;
    };
  }, []);

  // Jump to a specific post when arriving via a #post-:id link (e.g. from
  // the profile page's Posts tab) — runs once posts are actually rendered,
  // since the target element doesn't exist until then.
  useEffect(() => {
    if (loading || !window.location.hash.startsWith("#post-")) return;

    const el = document.getElementById(window.location.hash.slice(1));
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-accent-violet/60");
    const timeout = setTimeout(() => {
      el.classList.remove("ring-2", "ring-accent-violet/60");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [loading, posts]);

  function handleImagePick(e) {
    const files = Array.from(e.target.files || []).slice(0, 4 - composerImages.length);
    if (files.length === 0) return;

    setComposerImages((prev) => [...prev, ...files]);
    setComposerPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = ""; // allow picking the same file again later
  }

  function removeImage(index) {
    setComposerImages((prev) => prev.filter((_, i) => i !== index));
    setComposerPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmitPost() {
    if (!composerText.trim() || posting) return;
    setComposerError("");
    setPosting(true);

    try {
      const res = await createPost({ content: composerText.trim(), imageFiles: composerImages });
      setPosts((prev) => [res.data.post, ...prev]);
      setComposerText("");
      setComposerImages([]);
      setComposerPreviews([]);
    } catch (err) {
      setComposerError(err.response?.data?.message || "Couldn't publish your post.");
    } finally {
      setPosting(false);
    }
  }

  function handleDeleted(postId) {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  }

  const sortedPosts = [...posts].sort((a, b) => {
    if (sort === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    // "top" and "hot" both rank by like count for now — there's no separate
    // "hot" signal (recency-weighted score, comment activity, etc.) on the
    // backend yet, so they're the same sort until that exists.
    return (b.likes?.length || 0) - (a.likes?.length || 0);
  });

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[220px_1fr_280px] gap-6 items-start">
        {/* Left rail — still static/dummy: no communities backend exists yet */}
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
          <div className="bg-bg-surface border border-border rounded-xl p-3 flex flex-col gap-2 mb-4">
            {composerError && (
              <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-3.5 py-2.5">
                {composerError}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Avatar user={{ avatar: "ME", avatarColor: "bg-accent-violet" }} size="sm" />
              <input
                type="text"
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmitPost();
                }}
                placeholder="Start a discussion..."
                disabled={posting}
                className="flex-1 text-sm bg-bg-hover rounded-lg px-4 py-2.5 text-ink placeholder:text-ink-faint outline-none focus:ring-1 focus:ring-accent-violet/50 transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={posting || composerImages.length >= 4}
                className="p-2.5 rounded-lg text-ink-muted hover:text-accent-violet hover:bg-bg-hover transition-colors disabled:opacity-50 shrink-0"
                title="Add images"
              >
                <ImagePlus size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagePick}
                className="hidden"
              />
              <Button
                size="sm"
                icon={PenSquare}
                onClick={handleSubmitPost}
                disabled={posting || !composerText.trim()}
              >
                {posting ? "Posting..." : "Post"}
              </Button>
            </div>

            {composerPreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap pl-11">
                {composerPreviews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-bg/80 text-ink hover:bg-bg-hover"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-2.5 text-ink-muted text-sm">
                <Loader2 size={16} className="animate-spin" />
                Loading feed...
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {!loading && !error && sortedPosts.length === 0 && (
            <div className="bg-bg-surface border border-border rounded-xl p-8 text-center">
              <p className="text-sm text-ink-muted">No posts yet — start the first discussion.</p>
            </div>
          )}

          {!loading && !error && sortedPosts.length > 0 && (
            <div className="flex flex-col gap-3">
              {sortedPosts.map((post) => (
                <FeedPostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUserId}
                  onDeleted={handleDeleted}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar — still static/dummy: no "who's online" or trending-tags backend exists yet */}
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