import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../services/userService";

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Other"];

const inputClass =
  "w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors";

const labelClass = "text-xs font-medium text-slate-400 mb-1.5 block";

function Field({ label, hint, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
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
  username: "",
  bio: "",
  skills: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  college: "",
  year: YEAR_OPTIONS[0],
  lookingForTeam: false,
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

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
const res = await getProfile();
const profile = res.data.user;
        if (ignore || !profile) return;

        setForm({
  username: profile.name || profile.username || "",
  bio: profile.bio || "",
  skills: toCommaString(profile.skills),
  githubUrl: profile.github || "",
  linkedinUrl: profile.linkedin || "",
  portfolioUrl: profile.portfolio || "",
  college: profile.location || "",
  year: profile.year || YEAR_OPTIONS[0],
  lookingForTeam: profile.lookingForTeam || false,
});
        setAvatarPreview(profile.profilePicture || profile.avatarUrl || "");
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

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess(false);
    setSaving(true);

    try {
const payload = {
  name: form.username,
  bio: form.bio,
  location: form.college,
  github: form.githubUrl,
  portfolio: form.portfolioUrl,
  skills: toList(form.skills),
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-100 mb-1">Edit profile</h1>
          <p className="text-sm text-slate-400">Keep your details current so teammates can find you.</p>
        </div>

        {loadError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
            {loadError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 flex flex-col gap-5"
        >
          {saveError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3.5 py-2.5">
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-3.5 py-2.5">
              Profile updated successfully.
            </div>
          )}

          {/* Profile picture */}
          <Field label="Profile picture">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-500 text-xs">No photo</span>
                )}
              </div>
              <label className="cursor-pointer text-sm font-medium text-indigo-400 hover:text-indigo-300 border border-slate-700 hover:border-indigo-500/50 rounded-lg px-3.5 py-2 transition-colors">
                Choose photo
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
          </Field>

          {/* Username */}
          <Field label="Username">
            <input
              type="text"
              required
              maxLength={24}
              value={form.username}
              onChange={(e) => updateField("username", e.target.value)}
              placeholder="yourhandle"
              className={inputClass}
            />
          </Field>

          {/* Bio */}
          <Field label="Bio">
            <textarea
              rows={4}
              maxLength={280}
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="A short intro — what you build, what you're into."
              className={`${inputClass} resize-none`}
            />
          </Field>

          {/* Skills */}
          <Field label="Skills" hint="Comma separated, e.g. React, Node.js, MongoDB">
            <input
              type="text"
              value={form.skills}
              onChange={(e) => updateField("skills", e.target.value)}
              placeholder="React, Node.js, MongoDB"
              className={inputClass}
            />
            {form.skills.trim() && (
              <div className="flex flex-wrap gap-2 mt-2.5">
                {toList(form.skills).map((s) => (
                  <span
                    key={s}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </Field>

          {/* Links */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="GitHub URL">
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => updateField("githubUrl", e.target.value)}
                placeholder="https://github.com/you"
                className={inputClass}
              />
            </Field>
            <Field label="LinkedIn URL">
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => updateField("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/you"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Portfolio URL">
            <input
              type="url"
              value={form.portfolioUrl}
              onChange={(e) => updateField("portfolioUrl", e.target.value)}
              placeholder="https://yourportfolio.dev"
              className={inputClass}
            />
          </Field>

          {/* College + Year */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="College">
              <input
                type="text"
                value={form.college}
                onChange={(e) => updateField("college", e.target.value)}
                placeholder="Your college / university"
                className={inputClass}
              />
            </Field>

            <Field label="Year">
              <select
                value={form.year}
                onChange={(e) => updateField("year", e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {YEAR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900">
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Looking for team toggle */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-100">Looking for a team</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Show up as available when others search for teammates.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.lookingForTeam}
              onClick={() => updateField("lookingForTeam", !form.lookingForTeam)}
              className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
                form.lookingForTeam ? "bg-indigo-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  form.lookingForTeam ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}