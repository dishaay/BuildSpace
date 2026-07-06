import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import ProjectCard from "../components/feature/ProjectCard";
import Button from "../components/common/Button";
import Tag from "../components/common/Tag";
import { projects } from "../data/dummyData";

const filters = ["all", "looking for collaborators", "react", "node", "ml", "devops"];

export default function ProjectShowcasePage() {
  const [active, setActive] = useState("all");

  const filtered = projects.filter((p) => {
    if (active === "all") return true;
    if (active === "looking for collaborators") return p.lookingForCollaborators;
    return p.tags.includes(active);
  });

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl mb-1">Project showcase</h1>
          <p className="text-ink-muted text-sm">What the community is building right now.</p>
        </div>
        <Button icon={Plus}>Submit project</Button>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <SlidersHorizontal size={14} className="text-ink-faint" />
        {filters.map((f) => (
          <Tag key={f} active={active === f} onClick={() => setActive(f)}>
            {f}
          </Tag>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-ink-faint col-span-full">No projects match that filter yet.</p>
        )}
      </div>
    </AppShell>
  );
}
