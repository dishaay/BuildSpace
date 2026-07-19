import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar, Users, Loader2, Trophy } from "lucide-react";
import { getMyHackathons } from "../../services/hackathonService";
import AppShell from "../../components/layout/AppShell";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const statusStyles = {
  Open: "bg-accent-teal/15 text-accent-teal border-accent-teal/30",
  Full: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  Closed: "bg-accent-coral/15 text-accent-coral border-accent-coral/30",
};

function formatDate(value) {
  if (!value) return "TBA";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "TBA"
    : date.toLocaleDateString();
}

export default function MyHackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchMyHackathons = async () => {
      try {

        const res = await getMyHackathons();


        setHackathons(res.data?.hackathons || []);
      } catch (err) {
        console.error("MY HACKATHONS ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Couldn't load your hackathons."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyHackathons();
  }, []);

  return (
    <AppShell>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            My Hackathons
          </h1>

          <p className="text-sm text-gray-400">
            Hackathons you've created.
          </p>
        </div>

        <Link to="/hackathons/new">
          <Button icon={Plus}>Post Hackathon</Button>
        </Link>
      </div>

      {loading && (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={18} />
          Loading...
        </div>
      )}

      {!loading && error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        hackathons.length === 0 && (
          <div>
            No hackathons found.
          </div>
        )}

      {!loading &&
        !error &&
        hackathons.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hackathons.map((h) => (
              <Card
                key={h._id}
                className="p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between">
                  <h2 className="font-semibold">
                    {h.title}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      statusStyles[h.status]
                    }`}
                  >
                    {h.status}
                  </span>
                </div>

                <div className="text-sm text-gray-400">
                  {h.description}
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex gap-2 items-center">
                    <Calendar size={14} />
                    {formatDate(h.startDate)}
                  </div>

                  <div className="flex gap-2 items-center">
                    <Users size={14} />
                    Team Size: {h.maxTeamSize}
                  </div>

                  <div className="flex gap-2 items-center">
                    <Trophy size={14} />
                    {h.prizePool || "No Prize"}
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <Link
                    className="flex-1"
                    to={`/hackathons/${h._id}`}
                  >
                    <Button
                      variant="secondary"
                      className="w-full"
                    >
                      View
                    </Button>
                  </Link>

                  <Link
                    className="flex-1"
                    to={`/hackathons/${h._id}/requests`}
                  >
                    <Button className="w-full">
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