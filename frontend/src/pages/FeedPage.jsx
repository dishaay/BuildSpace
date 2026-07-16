import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, GitFork, Calendar, Users, Trophy, ArrowRight, Loader2, Heart, Trash2 } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import { getPosts, createPost, deletePost, toggleLikePost } from "../services/postService";
import { getProjects } from "../services/projectService";
import { getHackathons } from "../services/hackathonService";
import { getProfile } from "../services/userService";

const statusStyles = {
  Open: "bg-accent-teal/15 text-accent-teal border-accent-teal/30",
  Full: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  Closed: "bg-accent-coral/15 text-accent-coral border-accent-coral/30",
};

function getId(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value._id || value.id;
}

function formatTimestamp(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function SectionHeader({ title, viewAllHref }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display font-semibold text-lg sm:text-xl text-ink">{title}</h2>
      {viewAllHref && (
        <Link to={viewAllHref} className="flex items-center gap-1 text-sm text-accent-violet hover:underline shrink-0">
          View all
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

function PostComposer({ onPosted }) {
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    setError("");
    setPosting(true);
    try {
      const res = await createPost({ content: text.trim() });
      onPosted(res.data.post);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't publish your post.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <Card padding="md" className="mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && (
          <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-3.5 py-2.5">
            {error}
          </div>
        )}
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share what you're building, learning, or stuck on..."
          disabled={posting}
          className="w-full bg-bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors resize-none disabled:opacity-50"
        />
        <Button type="submit" size="sm" disabled={posting || !text.trim()} className="self-end">
          {posting ? "Posting..." : "Post"}
        </Button>
      </form>
    </Card>
  );
}

function PostItem({ post, currentUserId, onDeleted }) {
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
    <Card padding="md" className="flex gap-3">
      <Avatar
        user={{
          avatar: (post.author?.name || post.author?.username || "?").slice(0, 2).toUpperCase(),
          avatarColor: "bg-accent-violet",
        }}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-ink">{post.author?.name || post.author?.username || "Someone"}</p>
            <span className="text-xs text-ink-faint font-mono">{formatTimestamp(post.createdAt)}</span>
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
        <p className="text-sm text-ink-muted mt-1 whitespace-pre-wrap">{post.content}</p>
        <button
          onClick={handleToggleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 mt-2.5 text-xs transition-colors disabled:opacity-50 ${
            liked ? "text-accent-coral" : "text-ink-faint hover:text-accent-violet"
          }`}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
          {likesCount}
        </button>
      </div>
    </Card>
  );
}

export default function FeedPage() {
  const [currentUserId, setCurrentUserId] = useState(null);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  const [latestProjects, setLatestProjects] = useState([]);
  const [latestHackathons, setLatestHackathons] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function fetchFeed() {
      setPostsLoading(true);
      setPostsError("");
      try {
        const [profileRes, postsRes, projectsRes, hackathonsRes] = await Promise.all([
          getProfile().catch(() => null), // feed is viewable even if this fails for some reason
          getPosts(),
          getProjects(),
          getHackathons(),
        ]);

        if (ignore) return;

        if (profileRes) {
          const profile = profileRes.data.user;
          setCurrentUserId(getId(profile?._id || profile?.id));
        }

        setPosts(postsRes.data.posts || []);

        const allProjects = projectsRes.data.projects || projectsRes.data.data || [];
        setLatestProjects(allProjects.slice(0, 3));

        const allHackathons = hackathonsRes.data.hackathons || [];
        setLatestHackathons(allHackathons.slice(0, 3));
      } catch (err) {
        console.error("FeedPage failed to load:", err);
        if (!ignore) {
          setPostsError(err.response?.data?.message || err.message || "Couldn't load the feed.");
        }
      } finally {
        if (!ignore) setPostsLoading(false);
      }
    }

    fetchFeed();
    return () => {
      ignore = true;
    };
  }, []);

  function handlePosted(newPost) {
    setPosts((prev) => [newPost, ...prev]);
  }

  function handleDeleted(postId) {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  }

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main feed column */}
        <div className="min-w-0">
          <div className="mb-6">
            <h1 className="font-display font-semibold text-2xl mb-1">Feed</h1>
            <p className="text-ink-muted text-sm">What's new across the community.</p>
          </div>

          <PostComposer onPosted={handlePosted} />

          {postsLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-2.5 text-ink-muted text-sm">
                <Loader2 size={16} className="animate-spin" />
                Loading feed...
              </div>
            </div>
          )}

          {!postsLoading && postsError && (
            <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-4 py-3">
              {postsError}
            </div>
          )}

          {!postsLoading && !postsError && posts.length === 0 && (
            <Card padding="lg" className="text-center">
              <p className="text-sm text-ink-muted">No posts yet — be the first to share something.</p>
            </Card>
          )}

          {!postsLoading && !postsError && posts.length > 0 && (
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <PostItem
                  key={post._id}
                  post={post}
                  currentUserId={currentUserId}
                  onDeleted={handleDeleted}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: latest projects + hackathons */}
        <aside className="flex flex-col gap-8">
          <section>
            <SectionHeader title="Latest projects" viewAllHref="/projects" />
            <div className="flex flex-col gap-3">
              {latestProjects.map((p) => (
                <Card key={p._id || p.id} hoverable padding="sm" className="flex flex-col gap-2">
                  <p className="font-mono text-sm text-accent-violet">{p.title}</p>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">{p.description}</p>
                  <div className="flex items-center gap-3 text-ink-faint text-xs font-mono">
                    <span className="flex items-center gap-1">
                      <Star size={12} /> {p.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={12} /> {p.bookmarks?.length || 0}
                    </span>
                  </div>
                </Card>
              ))}
              {latestProjects.length === 0 && (
                <p className="text-sm text-ink-faint">No projects yet.</p>
              )}
            </div>
          </section>

          <section>
            <SectionHeader title="Latest hackathons" viewAllHref="/hackathons/mine" />
            <div className="flex flex-col gap-3">
              {latestHackathons.map((h) => (
                <Card key={h._id || h.id} hoverable padding="sm" className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-ink text-sm leading-snug">{h.title}</p>
                    {h.status && (
                      <span
                        className={`shrink-0 font-mono text-[11px] px-2 py-0.5 rounded-full border ${
                          statusStyles[h.status] || "bg-bg-hover text-ink-muted border-border"
                        }`}
                      >
                        {h.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-faint font-mono">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> Max {h.maxTeamSize}
                    </span>
                    {h.prizePool && (
                      <span className="flex items-center gap-1">
                        <Trophy size={12} /> {h.prizePool}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
              {latestHackathons.length === 0 && (
                <p className="text-sm text-ink-faint">No hackathons yet.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}