import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import {
    getHackathonById,
    joinHackathon,
    deleteHackathon,
} from "../../services/hackathonService";
import {
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Loader2,
  ArrowLeft,
  Pencil,
  ListChecks,
  Check,
} from "lucide-react";
import { getProfile } from "../../services/userService";
import AppShell from "../../components/layout/AppShell";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Tag from "../../components/common/Tag";


const statusStyles = {
  Open: "bg-accent-teal/15 text-accent-teal border-accent-teal/30",
  Full: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  Closed: "bg-accent-coral/15 text-accent-coral border-accent-coral/30",
};


function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function getId(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value._id || value.id;
}

export default function HackathonDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [hackathonRes, profileRes] = await Promise.all([getHackathonById(id), getProfile()]);

        const hackathonData = hackathonRes.data?.hackathon || hackathonRes.data?.data || hackathonRes.data;
        const profileData = profileRes.data?.user || profileRes.data?.data || profileRes.data;

        if (ignore) return;
        setHackathon(hackathonData);
        setCurrentUserId(getId(profileData?._id || profileData?.id || profileData));
      } catch (err) {
        console.error("HackathonDetailsPage failed to load:", err);
        if (!ignore) {
          setError(err.response?.data?.message || err.message || "Couldn't load this hackathon.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchData();
    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleJoin() {
    setJoinError("");
    setJoining(true);

    try {
      await joinHackathon(id);
      // Reflect the join locally right away rather than re-fetching —
      // add the current user to the members list we already have.
      setHackathon((prev) => ({
        ...prev,
        members: [...(prev.members || []), currentUserId],
      }));
    } catch (err) {
      setJoinError(err.response?.data?.message || "Couldn't join this hackathon.");
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto flex items-center justify-center py-24">
          <div className="flex items-center gap-2.5 text-ink-muted text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading hackathon...
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !hackathon) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">
          <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-4 py-3 mb-4">
            {error || "Hackathon not found."}
          </div>
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </AppShell>
    );
  }

  const {
    title,
    description,
    officialLink,
    registrationDeadline,
    startDate,
    endDate,
    techStack = [],
    mode,
    location,
    prizePool,
    maxTeamSize,
    status,
    createdBy,
    members = [],
  } = hackathon;

  const isOwner = createdBy && currentUserId && getId(createdBy) === currentUserId;
  console.log("currentUserId:", currentUserId);
console.log("createdBy:", getId(createdBy));
console.log("isOwner:", isOwner);
  const isMember = currentUserId && members.some((m) => getId(m) === currentUserId);
  const isFull = maxTeamSize && members.length >= maxTeamSize;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-5"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <Card padding="lg">
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

          {createdBy && (
            <p className="text-sm text-ink-muted mb-5">
              Posted by{" "}
              <span className="text-ink">{createdBy.displayName || createdBy.username || createdBy.name || "a member"}</span>
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {(formatDate(startDate) || formatDate(endDate)) && (
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Calendar size={15} className="text-accent-violet shrink-0" />
                {formatDate(startDate) || "TBA"} – {formatDate(endDate) || "TBA"}
              </div>
            )}
            {formatDate(registrationDeadline) && (
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Calendar size={15} className="text-accent-coral shrink-0" />
                Register by {formatDate(registrationDeadline)}
              </div>
            )}
            {mode && (
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <MapPin size={15} className="text-accent-teal shrink-0" />
                {mode}
                {location ? ` · ${location}` : ""}
              </div>
            )}
            {maxTeamSize && (
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Users size={15} className="text-accent-amber shrink-0" />
                {members.length}/{maxTeamSize} members
              </div>
            )}
            {prizePool && (
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Trophy size={15} className="text-accent-violet shrink-0" />
                {prizePool}
              </div>
            )}
          </div>

          <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap mb-6">{description}</p>

          {techStack.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-mono text-ink-faint uppercase tracking-wider mb-2.5">Tech stack</p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap pt-5 border-t border-border-soft">
            {officialLink && (
              <a href={officialLink} target="_blank" rel="noreferrer">
                <Button variant="secondary" icon={ExternalLink}>
                  Official page
                </Button>
              </a>
            )}

            {isOwner ? (
             <>
    <Link to={`/hackathons/${id}/edit`}>
        <Button variant="secondary" icon={Pencil}>
            Edit
        </Button>
    </Link>

    <Button
        variant="danger"
        onClick={async () => {
            const ok = window.confirm(
                "Delete this hackathon?"
            );

            if (!ok) return;

            await deleteHackathon(id);

window.location.href="/hackathons/mine";        }}
    >
        Delete
    </Button>

    <Link to={`/hackathons/${id}/requests`}>
        <Button icon={ListChecks}>
            View Members
        </Button>
    </Link>
</>
            ) : isMember ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-accent-teal font-medium">
                <Check size={15} />
                You're a member
              </span>
            ) : (
              <Button onClick={handleJoin} disabled={joining || status === "Closed" || isFull}>
                {joining
                  ? "Joining..."
                  : status === "Closed"
                    ? "Registration closed"
                    : isFull
                      ? "Team full"
                      : "Join hackathon"}
              </Button>
            )}
          </div>

          {joinError && <p className="text-xs text-accent-coral mt-3">{joinError}</p>}
        </Card>
      </div>
    </AppShell>
  );
}