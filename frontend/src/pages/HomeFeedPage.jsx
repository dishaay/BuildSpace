import { useEffect, useState } from "react";
import { TrendingUp, Clock, Flame, PenSquare, Heart, Trash2, Loader2 } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import CommunityCard from "../components/feature/CommunityCard";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import { communities, users } from "../data/dummyData";
import { getPosts, createPost, deletePost, toggleLikePost } from "../services/postService";
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

function FeedPostCard({ post, currentUserId, onDeleted }) {
  const [liked, setLiked] = useState((post.likes || []).some((id) => getId(id) === currentUserId));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [liking, setLiking] = useState(false);
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
    <article className="bg-bg-surface border border-border rounded-xl p-4 flex gap-3 hover:border-ink-faint/50 transition-colors">
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

        <button
          onClick={handleToggleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 mt-3 text-xs font-medium transition-colors disabled:opacity-50 ${
            liked ? "text-accent-coral" : "text-ink-faint hover:text-accent-violet"
          }`}
        >
          <Heart size={15} fill={liked ? "currentColor" : "none"} />
          {likesCount}
        </button>
      </div>
    </article>
  );
}

export default function HomeFeedPage() {
  const [sort, setSort] = useState("top");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [composerText, setComposerText] = useState("");
  const [posting, setPosting] = useState(false);
  const [composerError, setComposerError] = useState("");

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
          getProfile().catch(() => null),
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

  async function handleSubmitPost() {
    if (!composerText.trim() || posting) return;
    setComposerError("");
    setPosting(true);

    try {
      const res = await createPost({ content: composerText.trim() });
      setPosts((prev) => [res.data.post, ...prev]);
      setComposerText("");
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
              <Avatar
                user={{
                  avatar: "ME",
                  avatarColor: "bg-accent-violet",
                }}
                size="sm"
              />
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
              <Button
                size="sm"
                icon={PenSquare}
                onClick={handleSubmitPost}
                disabled={posting || !composerText.trim()}
              >
                {posting ? "Posting..." : "Post"}
              </Button>
            </div>
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