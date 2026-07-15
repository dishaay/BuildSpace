import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar, Users, Loader2, Trophy } from "lucide-react";
import { getHackathons } from "../../services/hackathonService";
import { getProfile } from "../../services/userService";
import AppShell from "../../components/layout/AppShell";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

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

export default function MyHackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchMyHackathons() {
      setLoading(true);
      setError("");
      try {
        const profileRes = await getProfile();
        const profile = profileRes.data?.user || profileRes.data?.data || profileRes.data;
        const currentUserId = getId(profile?._id || profile?.id || profile);

        const hackathonsRes = await getMyHackathons();

        if (!ignore) {
          setHackathons(allHackathons.filter((h) => getId(h.createdBy) === currentUserId));
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Couldn't load your hackathons.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchMyHackathons();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl mb-1">My hackathons</h1>
          <p className="text-ink-muted text-sm">Hackathons you've posted, and their join requests.</p>
        </div>
        <Link to="/hackathons/new">
          <Button icon={Plus}>Post hackathon</Button>
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2.5 text-ink-muted text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading your hackathons...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && hackathons.length === 0 && (
        <Card padding="lg" className="text-center">
          <p className="text-sm text-ink-muted mb-4">
            You haven't posted any hackathons yet.
          </p>
          <Link to="/hackathons/new">
            <Button icon={Plus} className="mx-auto">
              Post your first hackathon
            </Button>
          </Link>
        </Card>
      )}

      {!loading && !error && hackathons.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hackathons.map((h) => (
            <Card key={h._id || h.id} hoverable padding="md" className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold text-ink leading-snug">{h.title}</h3>
                {h.status && (
                  <span
                    className={`shrink-0 font-mono text-[11px] px-2 py-1 rounded-full border ${
                      statusStyles[h.status] || "bg-bg-hover text-ink-muted border-border"
                    }`}
                  >
                    {h.status}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 text-xs text-ink-faint font-mono">
                {(formatDate(h.startDate) || formatDate(h.endDate)) && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {formatDate(h.startDate) || "TBA"} – {formatDate(h.endDate) || "TBA"}
                  </span>
                )}
                {h.maxTeamSize && (
                  <span className="flex items-center gap-1.5">
                    <Users size={12} />
                    Max team size {h.maxTeamSize}
                  </span>
                )}
                {h.prizePool && (
                  <span className="flex items-center gap-1.5">
                    <Trophy size={12} />
                    {h.prizePool}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 mt-auto border-t border-border-soft">
                <Link to={`/hackathons/${h._id || h.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    View
                  </Button>
                </Link>
                <Link to={`/hackathons/${h._id || h.id}/requests`} className="flex-1">
                  <Button size="sm" className="w-full">
                    Requests
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}