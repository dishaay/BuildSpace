import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../services/userService";
import AppShell from "../components/layout/AppShell";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

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
  name: "",
  username: "",
  bio: "",
  skills: "",
  github: "",
  portfolio: "",
  linkedin: "",
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchProfile() {
      setLoading(true);
      setLoadError("");
      try {
        // Confirmed shape: GET /users/profile -> { user }
        const res = await getProfile();
        const profile = res.data.user;
        if (ignore || !profile) return;

        setForm({
          name: profile.name || "",
          username: profile.username || "",
          bio: profile.bio || "",
          skills: toCommaString(profile.skills),
          github: profile.github || "",
          portfolio: profile.portfolio || "",
          linkedin: profile.linkedin || "",
        });
      } catch (err) {
        if (!ignore) {
          setLoadError(err.response?.data?.message || "Couldn't load your profile.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      ignore = true;
    };
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess(false);
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        username: form.username,
        bio: form.bio,
        skills: toList(form.skills),
        github: form.github,
        portfolio: form.portfolio,
        linkedin: form.linkedin,
      };

      await updateProfile(payload);

      setSaveSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Something went wrong while saving your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-ink-muted">Loading your profile...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display font-semibold text-2xl mb-1">Edit profile</h1>
          <p className="text-ink-muted text-sm">Keep your details current so teammates can find you.</p>
        </div>

        {loadError && (
          <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-4 py-3 mb-5">
            {loadError}
          </div>
        )}

        <Card as="form" padding="lg" onSubmit={handleSubmit} className="flex flex-col gap-5">
          {saveError && (
            <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-sm rounded-lg px-3.5 py-2.5">
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="bg-accent-teal/10 border border-accent-teal/30 text-accent-teal text-sm rounded-lg px-3.5 py-2.5">
              Profile updated successfully.
            </div>
          )}

          <Input
            label="Name"
            required
            maxLength={80}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your full name"
            disabled={saving}
          />

          <Input
            label="Username"
            required
            maxLength={24}
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
            placeholder="yourhandle"
            disabled={saving}
          />

          <Input
            as="textarea"
            label="Bio"
            rows={4}
            maxLength={280}
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            placeholder="A short intro — what you build, what you're into."
            disabled={saving}
          />

          <Input
            label="Skills"
            hint="Comma separated, e.g. React, Node.js, MongoDB"
            value={form.skills}
            onChange={(e) => updateField("skills", e.target.value)}
            placeholder="React, Node.js, MongoDB"
            disabled={saving}
          />
          {form.skills.trim() && (
            <div className="flex flex-wrap gap-2 -mt-3">
              {toList(form.skills).map((s) => (
                <span
                  key={s}
                  className="text-xs font-mono px-2.5 py-1 rounded-md bg-bg-hover border border-border text-ink-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="GitHub"
              type="url"
              value={form.github}
              onChange={(e) => updateField("github", e.target.value)}
              placeholder="https://github.com/you"
              disabled={saving}
            />
            <Input
              label="LinkedIn"
              type="url"
              value={form.linkedin}
              onChange={(e) => updateField("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/you"
              disabled={saving}
            />
          </div>

          <Input
            label="Portfolio"
            type="url"
            value={form.portfolio}
            onChange={(e) => updateField("portfolio", e.target.value)}
            placeholder="https://yourportfolio.dev"
            disabled={saving}
          />

          <div className="flex items-center gap-3 pt-2 border-t border-border-soft">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}