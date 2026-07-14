import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ImagePlus, Link2, X, Loader2 } from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import Button from "../../components/common/Button";
import Tag from "../../components/common/Tag";
import GithubMark from "../../components/common/GithubMark";

const statusOptions = ["In Progress", "Completed"];

const inputClass =
  "w-full bg-bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors";

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-muted mb-1.5 block">{label}</label>
      {children}
      {hint && <p className="text-xs text-ink-faint mt-1.5">{hint}</p>}
    </div>
  );
}

const emptyForm = {
  title: "",
  description: "",
  inspiration: "",
  journey: "",
  challenges: "",
  futurePlans: "",
  techStack: "",
  githubLink: "",
  liveLink: "",
  tags: "",
  status: "In Progress",
};
export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchProject() {
      setLoading(true);
      setLoadError("");
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const project = res.data?.data || res.data;
        if (ignore || !project) return;

        setForm({
  title: project.title || "",
  description: project.description || "",
  inspiration: project.inspiration || "",
  journey: project.journey || "",
  challenges: project.challenges || "",
  futurePlans: project.futurePlans || "",
  techStack: (project.techStack || []).join(", "),
  githubLink: project.githubLink || "",
  liveLink: project.liveLink || "",
  tags: (project.tags || []).join(", "),
  status: project.status || "In Progress",
});
        setThumbnailPreview(project.thumbnail || "");
      } catch (err) {
        if (!ignore) {
          setLoadError(
            err.response?.data?.message || "Couldn't load this project. It may not exist."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProject();
    return () => {
      ignore = true;
    };
  }, [id]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleThumbnailChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function removeThumbnail() {
    setThumbnail(null);
    setThumbnailPreview("");
  }

  function toList(value) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
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
  inspiration: form.inspiration,
  journey: form.journey,
  challenges: form.challenges,
  futurePlans: form.futurePlans,
  techStack: toList(form.techStack),
  githubLink: form.githubLink,
  liveLink: form.liveLink,
  tags: toList(form.tags),
  status: form.status,
};

      await axios.put(`/api/projects/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/projects`);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Something went wrong while saving your changes."
      );
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
            Loading project...
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
          <Button variant="secondary" onClick={() => navigate("/projects")}>
            Back to showcase
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display font-semibold text-2xl mb-1">Edit project</h1>
          <p className="text-ink-muted text-sm">Update your project's details below.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-bg-surface border border-border rounded-xl p-5 sm:p-6 flex flex-col gap-5"
        >
          {submitError && (
            <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-3.5 py-2.5">
              {submitError}
            </div>
          )}

          <Field label="Project title">
            <input
              type="text"
              required
              maxLength={60}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. queue-lite"
              className={inputClass}
            />
          </Field>

          <Field label="Description">
            <textarea
              required
              rows={5}
              maxLength={2000}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="What does it do? What problem does it solve? What did you learn building it?"
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label="What inspired this project?">
  <textarea
    rows={3}
    value={form.inspiration}
    onChange={(e) => updateField("inspiration", e.target.value)}
    placeholder="What made you build this project?"
    className={`${inputClass} resize-none`}
  />
</Field>

<Field label="Development Journey">
  <textarea
    rows={4}
    value={form.journey}
    onChange={(e) => updateField("journey", e.target.value)}
    placeholder="Tell the story of how you built it..."
    className={`${inputClass} resize-none`}
  />
</Field>

<Field label="Challenges Faced">
  <textarea
    rows={3}
    value={form.challenges}
    onChange={(e) => updateField("challenges", e.target.value)}
    placeholder="What problems did you overcome?"
    className={`${inputClass} resize-none`}
  />
</Field>

<Field label="Future Improvements">
  <textarea
    rows={3}
    value={form.futurePlans}
    onChange={(e) => updateField("futurePlans", e.target.value)}
    placeholder="What would you add next?"
    className={`${inputClass} resize-none`}
  />
</Field>

          <Field label="Tech stack" hint="Comma separated, e.g. React, Node.js, MongoDB">
            <input
              type="text"
              value={form.techStack}
              onChange={(e) => updateField("techStack", e.target.value)}
              placeholder="React, Node.js, MongoDB"
              className={inputClass}
            />
            {form.techStack.trim() && (
              <div className="flex flex-wrap gap-2 mt-2.5">
                {toList(form.techStack).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            )}
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="GitHub link">
              <div className="relative">
                <Github size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="url"
                  value={form.githubLink}
                  onChange={(e) => updateField("githubLink", e.target.value)}
                  placeholder="https://github.com/you/project"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>

            <Field label="Live link">
              <div className="relative">
                <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="url"
                  value={form.liveLink}
                  onChange={(e) => updateField("liveLink", e.target.value)}
                  placeholder="https://your-project.dev"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>
          </div>
          

          <Field label="Tags" hint="Comma separated, e.g. hackathon, ai, open-source">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="hackathon, ai, open-source"
              className={inputClass}
            />
            {form.tags.trim() && (
              <div className="flex flex-wrap gap-2 mt-2.5">
                {toList(form.tags).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            )}
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-bg-surface">
                  {opt}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Thumbnail">
            {thumbnailPreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-bg/80 text-ink hover:bg-bg-hover"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 w-full h-40 rounded-lg border border-dashed border-border hover:border-accent-violet/40 cursor-pointer transition-colors text-ink-faint">
                <ImagePlus size={22} />
                <span className="text-sm">Click to upload a thumbnail</span>
                <span className="text-xs font-mono">PNG, JPG up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
              </label>
            )}
          </Field>

          <div className="flex items-center gap-3 pt-2 border-t border-border-soft">
            <Button type="submit" disabled={submitting} icon={submitting ? Loader2 : undefined}>
              {submitting ? "Saving..." : "Save changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}