import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, Loader2 } from "lucide-react";
import { createHackathon } from "../../services/hackathonService";
import AppShell from "../../components/layout/AppShell";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Tag from "../../components/common/Tag";

const modeOptions = ["Online", "Offline", "Hybrid"];

function toList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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
};

export default function CreateHackathonPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
        console.log("SUBMIT CLICKED");

    try {
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
      };
      console.log(localStorage.getItem("token"));
      await createHackathon(payload);

      navigate("/hackathons/mine");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while creating this hackathon.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display font-semibold text-2xl mb-1">Post a hackathon</h1>
          <p className="text-ink-muted text-sm">
            Share the details so builders know what they're signing up for.
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-3.5 py-2.5">
                {error}
              </div>
            )}

            <Input
              label="Title"
              required
              maxLength={120}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. BuildFast Global Hackathon"
              disabled={submitting}
            />

            <Input
              as="textarea"
              label="Description"
              required
              rows={5}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="What's the theme? What should participants expect?"
              disabled={submitting}
            />

            <Input
              label="Official link"
              type="url"
              required
              icon={Link2}
              value={form.officialLink}
              onChange={(e) => updateField("officialLink", e.target.value)}
              placeholder="https://hackathon-site.com"
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
              placeholder="React, Python, AI/ML"
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
                hint="Optional — e.g. Bengaluru, or leave blank for remote"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="City, or venue"
                disabled={submitting}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Prize pool"
                hint="Optional"
                value={form.prizePool}
                onChange={(e) => updateField("prizePool", e.target.value)}
                placeholder="$5,000 + swag"
                disabled={submitting}
              />
              <Input
                label="Max team size"
                type="number"
                min={1}
                required
                value={form.maxTeamSize}
                onChange={(e) => updateField("maxTeamSize", e.target.value)}
                placeholder="4"
                disabled={submitting}
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-border-soft">
              <Button type="submit" disabled={submitting} icon={submitting ? Loader2 : undefined}>
                {submitting ? "Posting..." : "Post hackathon"}
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