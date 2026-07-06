# devhub — developer community platform (frontend)

Frontend-only UI built with **React 19 + Vite**, **Tailwind CSS**, and **React Router**.
All data is mocked in `src/data/dummyData.js` — no backend/API calls are made.

## Design direction

Dark, terminal/IDE-inspired theme (deep charcoal, violet + teal + coral accents),
with **Space Grotesk** for display type, **Inter** for body, and **JetBrains Mono**
for usernames/tags/timestamps — nodding to commit hashes and code. The recurring
signature element is a GitHub-style **contribution heatmap** (`ContributionGraph`),
reused on the landing hero, login panel, and profile page to tie the "developer
identity" theme together.

## Pages

| Route | Page |
|---|---|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Register |
| `/feed` | Home feed (3-column, Discord/Reddit-inspired) |
| `/profile` | Developer profile (GitHub-inspired) |
| `/communities` | Communities directory |
| `/hackathons` | Hackathon partner finder |
| `/projects` | Project showcase |

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL. Fully responsive from mobile (375px) up to desktop.

## Structure

```
src/
  components/
    common/     Avatar, Button, Tag, ContributionGraph, GithubMark
    layout/     Navbar, AppShell
    feature/    PostCard, CommunityCard, ProjectCard, TeammateCard
  pages/        one file per route, listed above
  data/         dummyData.js — all mock users, posts, communities, projects, hackathons
```

## Next steps (not included here)

This is UI only. Wiring it to a real backend means replacing the imports from
`src/data/dummyData.js` with calls to your API layer (e.g. `services/api.js`),
and adding real auth state instead of the `navigate("/feed")` stub in
`LoginPage.jsx` / `RegisterPage.jsx`.
