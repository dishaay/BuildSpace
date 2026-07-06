// Central dummy data source — swap for real API calls later.

export const currentUser = {
  id: "u1",
  username: "arinmehta",
  displayName: "Arin Mehta",
  avatar: "AM",
  avatarColor: "bg-accent-violet",
  title: "Full-stack dev · React & Node",
  bio: "Building things that break in interesting ways. Open source at night, coffee by day.",
  location: "Mumbai, IN",
  joined: "Mar 2023",
  followers: 842,
  following: 213,
  streak: 47,
  skills: ["React", "Node.js", "MongoDB", "TypeScript", "AWS", "Socket.IO"],
  links: { github: "arinmehta", website: "arinmehta.dev" },
};

export const users = [
  { id: "u2", username: "priyasharma", displayName: "Priya Sharma", avatar: "PS", avatarColor: "bg-accent-teal", title: "Backend engineer · Go", online: true },
  { id: "u3", username: "devon_k", displayName: "Devon Kessler", avatar: "DK", avatarColor: "bg-accent-coral", title: "DevOps · Kubernetes", online: true },
  { id: "u4", username: "linshu", displayName: "Lin Shu", avatar: "LS", avatarColor: "bg-accent-amber", title: "ML engineer", online: false },
  { id: "u5", username: "kofi.b", displayName: "Kofi Boateng", avatar: "KB", avatarColor: "bg-accent-violet", title: "Frontend · Design systems", online: true },
  { id: "u6", username: "renata_p", displayName: "Renata Paz", avatar: "RP", avatarColor: "bg-accent-teal", title: "Mobile · Flutter", online: false },
  { id: "u7", username: "sam.wu", displayName: "Sam Wu", avatar: "SW", avatarColor: "bg-accent-coral", title: "Security researcher", online: true },
];

export const communities = [
  { id: "c1", name: "react-devs", displayName: "React Developers", icon: "⚛️", members: 18400, color: "border-l-accent-violet", description: "Hooks, servers components, state management wars — all welcome.", tags: ["react", "frontend"] },
  { id: "c2", name: "backend-guild", displayName: "Backend Guild", icon: "🛠️", members: 12100, color: "border-l-accent-teal", description: "APIs, databases, queues, and the eternal ORM debate.", tags: ["node", "databases"] },
  { id: "c3", name: "opensource", displayName: "Open Source", icon: "🌱", members: 24900, color: "border-l-accent-coral", description: "Find projects to contribute to, or get help maintaining your own.", tags: ["oss", "github"] },
  { id: "c4", name: "devops-sre", displayName: "DevOps & SRE", icon: "🚀", members: 9800, color: "border-l-accent-amber", description: "CI/CD, containers, incident war stories, and uptime anxiety.", tags: ["devops", "k8s"] },
  { id: "c5", name: "ai-ml", displayName: "AI / ML Builders", icon: "🧠", members: 21300, color: "border-l-accent-violet", description: "Model training, prompt engineering, and shipping ML features.", tags: ["ai", "ml"] },
  { id: "c6", name: "career-advice", displayName: "Career Advice", icon: "📈", members: 15700, color: "border-l-accent-teal", description: "Resumes, interviews, negotiating offers, imposter syndrome support.", tags: ["career"] },
];

export const posts = [
  {
    id: "p1",
    author: users[0],
    community: "backend-guild",
    title: "Why we moved from REST to tRPC and don't regret it (yet)",
    excerpt: "Six months in, our type errors caught at compile time have saved us more incidents than our test suite. Here's the migration path we took...",
    tags: ["typescript", "api-design"],
    upvotes: 284,
    comments: 47,
    time: "3h ago",
  },
  {
    id: "p2",
    author: users[3],
    community: "react-devs",
    title: "Server Components finally clicked for me — here's the mental model",
    excerpt: "I fought this for a year. The moment I stopped thinking 'components' and started thinking 'render boundaries', everything made sense.",
    tags: ["react", "rsc"],
    upvotes: 512,
    comments: 89,
    time: "5h ago",
  },
  {
    id: "p3",
    author: users[2],
    community: "devops-sre",
    title: "Postmortem: how a 4-line YAML change took down prod for 40 minutes",
    excerpt: "No blame, just lessons. Sharing our full incident timeline because more of these should be public.",
    tags: ["incident", "kubernetes"],
    upvotes: 671,
    comments: 132,
    time: "8h ago",
  },
  {
    id: "p4",
    author: users[4],
    community: "opensource",
    title: "Maintaining a 40k-star repo alone: what actually helps",
    excerpt: "Triage templates, a strict labeling system, and saying no more often than I'd like. Ask me anything.",
    tags: ["maintainers", "github"],
    upvotes: 398,
    comments: 61,
    time: "12h ago",
  },
  {
    id: "p5",
    author: users[1],
    community: "ai-ml",
    title: "Fine-tuning on a budget: what actually moved the needle",
    excerpt: "Spent $80 in compute credits testing five approaches. LoRA plus better data curation beat every fancy trick.",
    tags: ["ml", "fine-tuning"],
    upvotes: 445,
    comments: 73,
    time: "1d ago",
  },
];

export const projects = [
  {
    id: "pr1",
    name: "queue-lite",
    tagline: "A tiny embeddable job queue for Node, no Redis required",
    owner: users[0],
    stars: 1240,
    forks: 87,
    language: "TypeScript",
    languageColor: "#3178c6",
    tags: ["node", "queues", "sqlite"],
    lookingForCollaborators: true,
  },
  {
    id: "pr2",
    name: "formkit-ui",
    tagline: "Accessible form primitives for React with zero runtime CSS",
    owner: users[3],
    stars: 892,
    forks: 54,
    language: "React",
    languageColor: "#61dafb",
    tags: ["react", "a11y", "forms"],
    lookingForCollaborators: false,
  },
  {
    id: "pr3",
    name: "cronwatch",
    tagline: "Dead man's switch monitoring for your scheduled jobs",
    owner: users[2],
    stars: 2103,
    forks: 156,
    language: "Go",
    languageColor: "#00ADD8",
    tags: ["devops", "monitoring"],
    lookingForCollaborators: true,
  },
  {
    id: "pr4",
    name: "vect-search",
    tagline: "Lightweight vector search you can run on a Raspberry Pi",
    owner: users[1],
    stars: 3401,
    forks: 298,
    language: "Python",
    languageColor: "#3572A5",
    tags: ["ml", "search", "embeddings"],
    lookingForCollaborators: true,
  },
  {
    id: "pr5",
    name: "sprig",
    tagline: "A design-token compiler that outputs Tailwind, CSS vars, and Figma",
    owner: currentUser,
    stars: 567,
    forks: 41,
    language: "TypeScript",
    languageColor: "#3178c6",
    tags: ["design-systems", "css"],
    lookingForCollaborators: false,
  },
  {
    id: "pr6",
    name: "shiplog",
    tagline: "Turn your git history into a readable changelog automatically",
    owner: users[4],
    stars: 1789,
    forks: 112,
    language: "Rust",
    languageColor: "#dea584",
    tags: ["cli", "git"],
    lookingForCollaborators: true,
  },
];

export const hackathons = [
  {
    id: "h1",
    name: "BuildFast Global Hackathon",
    date: "Aug 14–16, 2026",
    mode: "Remote",
    theme: "Developer tooling",
    participants: 3400,
    daysLeft: 12,
  },
  {
    id: "h2",
    name: "GreenTech Sprint",
    date: "Sep 4–6, 2026",
    mode: "Hybrid · Bengaluru",
    theme: "Climate & sustainability",
    participants: 1200,
    daysLeft: 33,
  },
  {
    id: "h3",
    name: "HealthHack Asia",
    date: "Sep 20–21, 2026",
    mode: "Remote",
    theme: "HealthTech",
    participants: 2100,
    daysLeft: 49,
  },
];

export const teammateCandidates = [
  { id: "t1", user: users[0], hackathon: "h1", role: "Looking for: Frontend dev", skills: ["React", "Figma"], pitch: "Building an AI code-review bot. Have the backend covered, need someone who can make it not look like a hackathon project by hour 30." },
  { id: "t2", user: users[1], hackathon: "h1", role: "Looking for: DevOps", skills: ["Docker", "CI/CD"], pitch: "Solo backend dev, decent at deploying things badly under pressure. Want someone who actually enjoys infra." },
  { id: "t3", user: users[2], hackathon: "h1", role: "Looking for: Designer", skills: ["Figma", "UI/UX"], pitch: "Two devs, zero taste. We have a working prototype for a docs-search tool and it looks like 2009. Save us." },
  { id: "t4", user: users[3], hackathon: "h2", role: "Looking for: Data/ML", skills: ["Python", "Pandas"], pitch: "Carbon-tracking dashboard for small businesses. Need someone who can turn messy CSVs into actual insight." },
  { id: "t5", user: users[4], hackathon: "h2", role: "Looking for: Backend", skills: ["Node.js", "Postgres"], pitch: "Idea validated, UI mocked, need an API and a database that won't fall over during judging." },
  { id: "t6", user: users[5], hackathon: "h3", role: "Looking for: Mobile dev", skills: ["React Native", "Flutter"], pitch: "Medication-reminder app for elderly users. Need a mobile dev who cares about accessibility as much as we do." },
];

// GitHub-style contribution grid — 7 rows x 30ish weeks of intensity values 0–4
export function generateContributionGrid(seed = 1) {
  const weeks = 30;
  const days = 7;
  const grid = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < days; d++) {
      const r = rand();
      let level = 0;
      if (r > 0.85) level = 4;
      else if (r > 0.68) level = 3;
      else if (r > 0.5) level = 2;
      else if (r > 0.3) level = 1;
      col.push(level);
    }
    grid.push(col);
  }
  return grid;
}
