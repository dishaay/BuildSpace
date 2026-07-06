import { useState } from "react";
import { ArrowUp, ArrowDown, MessageCircle, Bookmark, Share2 } from "lucide-react";
import Avatar from "../common/Avatar";
import Tag from "../common/Tag";

export default function PostCard({ post }) {
  const [vote, setVote] = useState(0);
  const [saved, setSaved] = useState(false);
  const displayVotes = post.upvotes + vote;

  return (
    <article className="bg-bg-surface border border-border rounded-xl flex hover:border-ink-faint/50 transition-colors">
      <div className="flex flex-col items-center gap-1 py-4 px-3 shrink-0">
        <button
          onClick={() => setVote(vote === 1 ? 0 : 1)}
          className={`p-1 rounded hover:bg-bg-hover ${vote === 1 ? "text-accent-teal" : "text-ink-faint"}`}
        >
          <ArrowUp size={18} />
        </button>
        <span className="font-mono text-sm font-medium text-ink">{displayVotes}</span>
        <button
          onClick={() => setVote(vote === -1 ? 0 : -1)}
          className={`p-1 rounded hover:bg-bg-hover ${vote === -1 ? "text-accent-coral" : "text-ink-faint"}`}
        >
          <ArrowDown size={18} />
        </button>
      </div>

      <div className="flex-1 py-4 pr-4 min-w-0">
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-2 flex-wrap">
          <span className="font-mono text-accent-violet">#{post.community}</span>
          <span>·</span>
          <Avatar user={post.author} size="xs" />
          <span className="text-ink">{post.author.displayName}</span>
          <span>·</span>
          <span className="font-mono">{post.time}</span>
        </div>

        <h3 className="font-display font-semibold text-ink text-base sm:text-lg leading-snug mb-1.5">
          {post.title}
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          <div className="flex items-center gap-1 text-ink-muted">
            <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-bg-hover hover:text-ink text-xs">
              <MessageCircle size={14} />
              {post.comments}
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`p-1.5 rounded-lg hover:bg-bg-hover ${saved ? "text-accent-amber" : "hover:text-ink"}`}
            >
              <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-bg-hover hover:text-ink">
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
