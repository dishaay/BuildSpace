import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Users } from "lucide-react";
import { getJoinRequests } from "../../services/joinRequestService";
import AppShell from "../../components/layout/AppShell";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
// NOTE: this backend only supports a one-step "join" (POST /:id/join adds
// the user straight to the hackathon's `members` array) — there's no
// pending/accept/reject workflow. So this page just lists who has joined,
// rather than requests to approve. Kept the same filename/route as the
// original JoinRequestsPage so nothing else needs to change.
export default function JoinRequestsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

async function fetchHackathon() {
  setLoading(true);
  setError("");

  try {
    const res = await getJoinRequests(id);

    console.log("MEMBERS:", res.data.requests);

    if (!ignore) {
      setHackathon({
        title: "Members",
        members: res.data.requests,
      });
    }
  } catch (err) {
    console.error(err);

    if (!ignore) {
      setError(
        err.response?.data?.message ||
        "Couldn't load this hackathon's members."
      );
    }
  } finally {
    if (!ignore) {
      setLoading(false);
    }
  }
}
    fetchHackathon();
    return () => {
      ignore = true;
    };
  }, [id]);

  const members = hackathon?.members || [];

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
        <h1 className="font-display font-semibold text-2xl mb-1">
          Members
        </h1>

        <p className="text-ink-muted text-sm">
          {hackathon?.title
            ? `Everyone who has joined "${hackathon.title}".`
            : "Everyone who has joined this hackathon."}
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2.5 text-ink-muted text-sm">
            <Loader2
              size={16}
              className="animate-spin"
            />
            Loading members...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        members.length === 0 && (
          <Card
            padding="lg"
            className="text-center"
          >
            <p className="text-sm text-ink-muted">
              No one has joined this hackathon
              yet.
            </p>
          </Card>
        )}

      {!loading &&
        !error &&
        members.length > 0 && (
          <div className="flex flex-col gap-4">
            {members.map((member) => (
              <Card
                key={member._id}
                padding="md"
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    user={{
                      avatar: (
                        member.username || "M"
                      )
                        .slice(0, 2)
                        .toUpperCase(),
                      avatarColor:
                        "bg-accent-violet",
                    }}
                    size="sm"
                  />

                  <div>
                    <p className="font-medium text-ink">
                      {member.username}
                    </p>

                    {member.name && (
                      <p className="text-xs text-ink-faint">
                        {member.name}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-ink-muted">
                  {member.bio ||
                    "No bio provided."}
                </p>

                <div>
                  <p className="text-xs font-semibold mb-1">
                    Skills
                  </p>

                  <p className="text-xs text-ink-faint">
                    {member.skills?.length
                      ? member.skills.join(
                          ", "
                        )
                      : "No skills added"}
                  </p>
                </div>

                <div className="flex gap-4 text-xs">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-violet"
                    >
                      Github
                    </a>
                  )}

                  {member.portfolio && (
                    <a
                      href={member.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-violet"
                    >
                      Portfolio
                    </a>
                  )}

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-violet"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  </AppShell>
);
}