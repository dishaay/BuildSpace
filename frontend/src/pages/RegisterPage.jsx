import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Terminal, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { register } from "../services/authService";
import GithubMark from "../components/common/GithubMark";
import Button from "../components/common/Button";

const perks = [
  "Join communities matched to your stack",
  "Showcase projects with live star/fork counts",
  "Find hackathon teammates by skill, not luck",
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await register(form);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userId", response.data.user._id);

    alert("Registration successful!");

    navigate("/feed");
  } catch (err) {
    console.error(err.response?.data || err);
    alert(err.response?.data?.message || "Registration failed");
  }
};

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left: visual panel */}
      <div className="hidden lg:flex flex-1 relative bg-bg-surface border-r border-border items-center justify-center overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-teal/10 blur-3xl rounded-full" />
        <div className="relative max-w-sm px-8">
          <p className="font-mono text-xs text-accent-violet mb-4">$ BuildSpace init</p>
          <h2 className="font-display font-semibold text-2xl mb-6 leading-snug">
            Set up your developer profile in under a minute.
          </h2>
          <div className="flex flex-col gap-3">
            {perks.map((p) => (
              <div key={p} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-teal/15 border border-accent-teal/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-accent-teal" />
                </span>
                <span className="text-sm text-ink-muted leading-relaxed">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <Link to="/" className="flex items-center gap-2 mb-10 w-fit">
          <div className="w-8 h-8 rounded-lg bg-accent-violet flex items-center justify-center">
            <Terminal size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg">
            Build<span className="text-accent-violet">Space</span>
          </span>
        </Link>

        <div className="max-w-sm w-full mx-auto animate-riseIn">
          <h1 className="font-display font-semibold text-2xl sm:text-3xl mb-2">Create your account</h1>
          <p className="text-ink-muted text-sm mb-8">Free forever for individual developers.</p>

          <button className="w-full flex items-center justify-center gap-2 bg-bg-surface border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-bg-hover transition-colors mb-4">
            <GithubMark size={16} />
            Sign up with GitHub
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-ink-faint font-mono">or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="yourhandle"
                  className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors"
                />
              </div>
            </div>

            <Button type="submit" size="md" icon={ArrowRight} className="flex-row-reverse mt-2">
              Create account
            </Button>
          </form>

          <p className="text-xs text-ink-faint text-center mt-5 leading-relaxed">
            By signing up you agree to our Terms and Privacy Policy.
          </p>

          <p className="text-sm text-ink-muted text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-violet hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
