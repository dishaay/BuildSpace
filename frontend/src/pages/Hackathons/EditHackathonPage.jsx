import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Link2, Loader2 } from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Tag from "../../components/common/Tag";

const modeOptions = ["Online", "Offline", "Hybrid"];
const statusOptions = ["Open", "Full", "Closed"];

function toList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

const emptyForm = {
  title: "",
  description: "",
  officialLink: "",
  registrationDeadline: "",
  startDate: "",
  endDate: "",
  techStack: "",
  mode: "Online",
  location: "",
  prizePool: "",
  maxTeamSize: "",
  status: "Open",
};

export default function EditHackathonPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchHackathon() {
      setLoading(true);
      setLoadError("");
      try {
        const token = localStorage.getItem("accessToken");
        // Axios placeholder — swap for the real endpoint once it's live.
        const res = await axios.get(`/api/hackathons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const h = res.data?.data || res.data;
        if (ignore || !h) return;

        setForm({
          title: h.title || "",
          description: h.description || "",
          officialLink: h.officialLink || "",
          registrationDeadline: toDateInputValue(h.registrationDeadline),
          startDate: toDateInputValue(h.startDate),
          endDate: toDateInputValue(h.endDate),
          techStack: Array.isArray(h.techStack) ? h.techStack.join(", ") : h.techStack || "",
          mode: h.mode || "Online",
          location: h.location || "",
          prizePool: h.prizePool || "",
          maxTeamSize: h.maxTeamSize ?? "",
          status: h.status || "Open",
        });
      } catch (err) {
        if (!ignore) {
          setLoadError(err.response?.data?.message || "Couldn't load this hackathon.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchHackathon();
    return () => {
      ignore = true;
    };
  }, [id]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");

      const payload = {
        title: form.title,
        description: form.description,
        officialLink: form.officialLink,
        registrationDeadline: form.registrationDeadline || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        techStack: toList(form.techStack),
        mode: form.mode,
        location: form.location,
        prizePool: form.prizePool,
        maxTeamSize: Number(form.maxTeamSize),
        status: form.status,
      };

      // Axios placeholder — swap for the real endpoint once it's live.
      await axios.put(`/api/hackathons/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/hackathons/${id}`);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Something went wrong while saving changes.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto flex items-center justify-center py-24">
          <div className="flex items-center gap-2.5 text-ink-muted text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading hackathon...
          </div>
        </div>
      </AppShell>
    );
  }

  if (loadError) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto">
          <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-4 py-3 mb-4">
            {loadError}
          </div>
          <Button variant="secondary" onClick={() => navigate("/hackathons/mine")}>
            Back to my hackathons
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display font-semibold text-2xl mb-1">Edit hackathon</h1>
          <p className="text-ink-muted text-sm">Update the details below.</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {submitError && (
              <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-3.5 py-2.5">
                {submitError}
              </div>
            )}

            <Input
              label="Title"
              required
              maxLength={120}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              disabled={submitting}
            />

            <Input
              as="textarea"
              label="Description"
              required
              rows={5}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              disabled={submitting}
            />

            <Input
              label="Official link"
              type="url"
              required
              icon={Link2}
              value={form.officialLink}
              onChange={(e) => updateField("officialLink", e.target.value)}
              disabled={submitting}
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Registration deadline"
                type="date"
                value={form.registrationDeadline}
                onChange={(e) => updateField("registrationDeadline", e.target.value)}
                disabled={submitting}
              />
              <Input
                label="Start date"
                type="date"
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                disabled={submitting}
              />
              <Input
                label="End date"
                type="date"
                value={form.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                disabled={submitting}
              />
            </div>

            <Input
              label="Tech stack"
              hint="Comma separated, e.g. React, Python, AI/ML"
              value={form.techStack}
              onChange={(e) => updateField("techStack", e.target.value)}
              disabled={submitting}
            />
            {form.techStack.trim() && (
              <div className="flex flex-wrap gap-2 -mt-3">
                {toList(form.techStack).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Input as="select" label="Mode" value={form.mode} onChange={(e) => updateField("mode", e.target.value)} disabled={submitting}>
                {modeOptions.map((m) => (
                  <option key={m} value={m} className="bg-bg-surface">
                    {m}
                  </option>
                ))}
              </Input>

              <Input
                label="Location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Prize pool"
                value={form.prizePool}
                onChange={(e) => updateField("prizePool", e.target.value)}
                disabled={submitting}
              />
              <Input
                label="Max team size"
                type="number"
                min={1}
                required
                value={form.maxTeamSize}
                onChange={(e) => updateField("maxTeamSize", e.target.value)}
                disabled={submitting}
              />
              <Input
                as="select"
                label="Status"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                disabled={submitting}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s} className="bg-bg-surface">
                    {s}
                  </option>
                ))}
              </Input>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-border-soft">
              <Button type="submit" disabled={submitting} icon={submitting ? Loader2 : undefined}>
                {submitting ? "Saving..." : "Save changes"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}