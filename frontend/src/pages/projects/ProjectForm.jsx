import { useEffect, useState } from "react";
import { ImagePlus, Github, Link2, X, Loader2 } from "lucide-react";
import Button from "../common/Button";
import Tag from "../common/Tag";

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

function toCommaString(value) {
  return Array.isArray(value) ? value.join(", ") : value || "";
}

function toList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const emptyForm = {
  title: "",
  description: "",
  techStack: "",
  githubLink: "",
  liveLink: "",
  tags: "",
  status: "In Progress",
};

/**
 * Reusable project form used by both CreateProject and EditProject.
 *
 * Props:
 * - initialData?: { title, description, techStack, githubLink, liveLink,
 *     tags, status, thumbnail } — techStack/tags accept either an array
 *     or a comma-separated string. Omit for a blank "create" form.
 * - onSubmit: (payload, thumbnailFile) => void — called on submit with
 *     the cleaned payload (techStack/tags as arrays) and the raw
 *     thumbnail File if a new one was picked (otherwise null).
 * - loading?: boolean — disables inputs/buttons and flips the submit
 *     button into a "working" state. Caller owns the actual request.
 * - error?: string — optional inline error banner (e.g. from a failed submit)
 * - submitLabel?: string — text for the submit button (default "Save project")
 * - loadingLabel?: string — text for the submit button while loading
 * - onCancel?: () => void — called when Cancel is clicked
 */
export default function ProjectForm({
  initialData,
  onSubmit,
  loading = false,
  error = "",
  submitLabel = "Save project",
  loadingLabel = "Saving...",
  onCancel,
}) {
  const [form, setForm] = useState(emptyForm);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // Prefill (or reset) whenever initialData changes — covers the case
  // where EditProject fetches the project after this form has mounted.
  useEffect(() => {
    if (!initialData) {
      setForm(emptyForm);
      setThumbnailPreview("");
      return;
    }

    setForm({
      title: initialData.title || "",
      description: initialData.description || "",
      techStack: toCommaString(initialData.techStack),
      githubLink: initialData.githubLink || "",
      liveLink: initialData.liveLink || "",
      tags: toCommaString(initialData.tags),
      status: initialData.status || "In Progress",
    });
    setThumbnailPreview(initialData.thumbnail || "");
    setThumbnailFile(null);
  }, [initialData]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleThumbnailChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function removeThumbnail() {
    setThumbnailFile(null);
    setThumbnailPreview("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      techStack: toList(form.techStack),
      githubLink: form.githubLink,
      liveLink: form.liveLink,
      tags: toList(form.tags),
      status: form.status,
      // Preserve the existing thumbnail URL unless a new file was picked —
      // useful for EditProject where nothing changed about the image.
      thumbnail: thumbnailFile ? "" : thumbnailPreview,
    };

    onSubmit?.(payload, thumbnailFile);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-surface border border-border rounded-xl p-5 sm:p-6 flex flex-col gap-5"
    >
      {error && (
        <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-3.5 py-2.5">
          {error}
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
          disabled={loading}
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
          disabled={loading}
          className={`${inputClass} resize-none`}
        />
      </Field>

      <Field label="Tech stack" hint="Comma separated, e.g. React, Node.js, MongoDB">
        <input
          type="text"
          value={form.techStack}
          onChange={(e) => updateField("techStack", e.target.value)}
          placeholder="React, Node.js, MongoDB"
          disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
            <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
            {!loading && (
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-bg/80 text-ink hover:bg-bg-hover"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center gap-2 w-full h-40 rounded-lg border border-dashed border-border transition-colors text-ink-faint ${
              loading ? "cursor-not-allowed opacity-60" : "hover:border-accent-violet/40 cursor-pointer"
            }`}
          >
            <ImagePlus size={22} />
            <span className="text-sm">Click to upload a thumbnail</span>
            <span className="text-xs font-mono">PNG, JPG up to 5MB</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              disabled={loading}
              className="hidden"
            />
          </label>
        )}
      </Field>

      <div className="flex items-center gap-3 pt-2 border-t border-border-soft">
        <Button type="submit" disabled={loading} icon={loading ? Loader2 : undefined}>
          {loading ? loadingLabel : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}