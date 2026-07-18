import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Terminal, Mail, Lock, ArrowRight } from "lucide-react";
import GithubMark from "../components/common/GithubMark";
import Button from "../components/common/Button";
import ContributionGraph from "../components/common/ContributionGraph";
import { login } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await login(form);

   localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));

    navigate("/feed");
  } catch (err) {
    console.error(err.response?.data || err);
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left: form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <Link to="/" className="flex items-center gap-2 mb-10 w-fit">
          <div className="w-8 h-8 rounded-lg bg-accent-violet flex items-center justify-center">
            <Terminal size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg">
            dev<span className="text-accent-violet">hub</span>
          </span>
        </Link>

        <div className="max-w-sm w-full mx-auto animate-riseIn">
          <h1 className="font-display font-semibold text-2xl sm:text-3xl mb-2">Welcome back</h1>
          <p className="text-ink-muted text-sm mb-8">Log in to pick up where your last thread left off.</p>

          <button className="w-full flex items-center justify-center gap-2 bg-bg-surface border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-bg-hover transition-colors mb-4">
            <GithubMark size={16} />
            Continue with GitHub
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-ink-faint font-mono">or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-ink-muted">Password</label>
                <Link
    to="/forgot-password"
    className="text-xs text-accent-violet hover:underline"
>
    Forgot?
</Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors"
                />
              </div>
            </div>

            <Button type="submit" size="md" icon={ArrowRight} className="flex-row-reverse mt-2">
              Log in
            </Button>
          </form>

          <p className="text-sm text-ink-muted text-center mt-6">
            New here?{" "}
            <Link to="/register" className="text-accent-violet hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right: visual panel */}
      <div className="hidden lg:flex flex-1 relative bg-bg-surface border-l border-border items-center justify-center overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent-violet/10 blur-3xl rounded-full" />
        <div className="relative max-w-sm px-8">
          <p className="font-mono text-xs text-accent-teal mb-3">// currently trending</p>
          <h2 className="font-display font-semibold text-2xl mb-4 leading-snug">
            "Server Components finally clicked for me"
          </h2>
          <p className="text-sm text-ink-muted mb-6 leading-relaxed">
            512 upvotes and counting in #react-devs. Log in to join the discussion.
          </p>
          <ContributionGraph seed={3} size="md" />
        </div>
      </div>
    </div>
  );
}
