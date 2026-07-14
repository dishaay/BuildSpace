import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Check, X, Loader2, ArrowLeft } from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Avatar from "../../components/common/Avatar";

const statusStyles = {
  Pending: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  Accepted: "bg-accent-teal/15 text-accent-teal border-accent-teal/30",
  Rejected: "bg-accent-coral/15 text-accent-coral border-accent-coral/30",
};

export default function JoinRequestsPage() {
  const { id } = useParams(); // hackathon id
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [hackathonTitle, setHackathonTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchRequests() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        // Axios placeholder — swap for the real endpoint once it's live.
        const res = await axios.get(`/api/hackathons/${id}/join-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data || res.data || {};
        if (ignore) return;
        setRequests(data.requests || data || []);
        setHackathonTitle(data.hackathonTitle || "");
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Couldn't load join requests.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchRequests();
    return () => {
      ignore = true;
    };
  }, [id]);

  async function updateStatus(requestId, status) {
    setUpdatingId(requestId);
    try {
      const token = localStorage.getItem("token");
      // Axios placeholder — swap for the real endpoint once it's live.
      await axios.patch(
        `/api/join-requests/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests((prev) => prev.map((r) => ((r._id || r.id) === requestId ? { ...r, status } : r)));
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update this request. Try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(`/hackathons/${id}`)}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-5"
        >
          <ArrowLeft size={15} />
          Back to hackathon
        </button>

        <div className="mb-6">
          <h1 className="font-display font-semibold text-2xl mb-1">Join requests</h1>
          <p className="text-ink-muted text-sm">
            {hackathonTitle ? `Requests to join "${hackathonTitle}"` : "Review who wants to team up."}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-2.5 text-ink-muted text-sm">
              <Loader2 size={16} className="animate-spin" />
              Loading requests...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <Card padding="lg" className="text-center">
            <p className="text-sm text-ink-muted">No one has requested to join this hackathon yet.</p>
          </Card>
        )}

        {!loading && requests.length > 0 && (
          <div className="flex flex-col gap-3">
            {requests.map((r) => {
              const reqId = r._id || r.id;
              const applicant = r.user || {};
              const isUpdating = updatingId === reqId;

              return (
                <Card key={reqId} padding="md" className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    to={`/profile/${applicant._id || applicant.id || ""}`}
                    className="flex items-center gap-3 min-w-0 sm:w-56 shrink-0"
                  >
                    <Avatar
                      user={{
                        avatar: (applicant.displayName || applicant.username || "?").slice(0, 2).toUpperCase(),
                        avatarColor: "bg-accent-violet",
                      }}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-ink truncate">
                        {applicant.displayName || applicant.username || "Unknown user"}
                      </p>
                      {applicant.username && (
                        <p className="text-xs text-ink-faint font-mono truncate">@{applicant.username}</p>
                      )}
                    </div>
                  </Link>

                  <p className="text-sm text-ink-muted flex-1 leading-relaxed">
                    {r.message || <span className="text-ink-faint italic">No message included.</span>}
                  </p>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono text-xs px-2.5 py-1 rounded-full border ${
                        statusStyles[r.status] || "bg-bg-hover text-ink-muted border-border"
                      }`}
                    >
                      {r.status || "Pending"}
                    </span>

                    {(!r.status || r.status === "Pending") && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={Check}
                          disabled={isUpdating}
                          onClick={() => updateStatus(reqId, "Accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={X}
                          disabled={isUpdating}
                          onClick={() => updateStatus(reqId, "Rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}