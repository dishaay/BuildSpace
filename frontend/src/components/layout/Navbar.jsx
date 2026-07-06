import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, Bell, MessageSquare, Menu, X, Terminal } from "lucide-react";
import Avatar from "../common/Avatar";
import { currentUser } from "../../data/dummyData";

const navItems = [
  { to: "/feed", label: "Feed" },
  { to: "/communities", label: "Communities" },
  { to: "/hackathons", label: "Hackathons" },
  { to: "/projects", label: "Showcase" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/feed" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent-violet flex items-center justify-center">
            <Terminal size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight hidden sm:block">
            Build<span className="text-accent-violet">Space</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-ink bg-bg-hover" : "text-ink-muted hover:text-ink hover:bg-bg-hover"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1 max-w-md ml-2 hidden lg:block">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Search posts, projects, people..."
              className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button className="hidden sm:flex p-2.5 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-hover relative">
            <MessageSquare size={18} />
          </button>
          <button className="hidden sm:flex p-2.5 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-hover relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-coral" />
          </button>
          <Link to="/profile" className="ml-1">
            <Avatar user={currentUser} size="sm" />
          </Link>
          <button
            className="md:hidden p-2.5 rounded-lg text-ink-muted hover:text-ink"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-1 animate-riseIn">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? "text-ink bg-bg-hover" : "text-ink-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
