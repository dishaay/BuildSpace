import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Bell, MessageSquare, Menu, X, Terminal, LogOut, User as UserIcon } from "lucide-react";
import Avatar from "../common/Avatar";
import { getProfile } from "../../services/userService";
const navItems = [
  { to: "/feed", label: "Feed" },
  { to: "/communities", label: "Communities" },
  { to: "/hackathons", label: "Hackathons" },
  { to: "/projects", label: "Showcase" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchUser() {
        try {
            const res = await getProfile();
            setUser(res.data.user);
        } catch (err) {
            console.log(err);
        }
    }

    fetchUser();
}, []);

  function handleLogout() {
    // JWT-based auth — logging out just means forgetting the token
    // client-side. If your backend ever adds a refresh-token revocation
    // endpoint, call it here before clearing storage.
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/feed" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent-violet flex items-center justify-center">
            <Terminal size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight hidden sm:block">
            build<span className="text-accent-violet">Space</span>
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

        <input
  type="text"
  placeholder="Search posts, projects, people..."
  onKeyDown={(e) => {
    console.log(e.key);

    if (e.key === "Enter") {
      navigate(`/search?q=${e.target.value}`);
    }
  }}
  className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent-violet/50 outline-none transition-colors"
/>

        <div className="flex items-center gap-1 ml-auto">
          <button className="hidden sm:flex p-2.5 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-hover relative">
            <MessageSquare size={18} />
          </button>
          <button className="hidden sm:flex p-2.5 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-hover relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-coral" />
          </button>
          <div className="relative ml-1" ref={menuRef}>
            <button onClick={() => setMenuOpen((v) => !v)} className="block">
<Avatar user={user} size="sm" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-bg-surface border border-border rounded-lg shadow-lg py-1.5 animate-riseIn">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink hover:bg-bg-hover transition-colors"
                >
                  <UserIcon size={15} />
                  Profile
                </Link>
                <div className="h-px bg-border-soft my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-accent-coral hover:bg-bg-hover transition-colors"
                >
                  <LogOut size={15} />
                  Log out
                </button>
              </div>
            )}
          </div>
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