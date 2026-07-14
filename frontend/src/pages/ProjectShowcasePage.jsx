import DeleteProjectModal from "./projects/DeleteProjectModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, SlidersHorizontal } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import ProjectCard from "../components/feature/ProjectCard";
import Button from "../components/common/Button";
import Tag from "../components/common/Tag";
import { getProjects } from "../services/projectService";


const filters = [
  "all",
  "In Progress",
  "Completed",
];

export default function ProjectShowcasePage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
const [selectedProject, setSelectedProject] = useState(null);
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await getProjects();

      setProjects(res.data.projects);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects =
    active === "all"
      ? projects
      : projects.filter((p) => p.status === active);

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl mb-1">
            Project Showcase
          </h1>

          <p className="text-ink-muted text-sm">
            Explore what developers are building.
          </p>
        </div>

        <Button
          icon={Plus}
          onClick={() => navigate("/projects/create")}
        >
          Submit Project
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <SlidersHorizontal
          size={15}
          className="text-ink-faint"
        />

        {filters.map((filter) => (
          <Tag
            key={filter}
            active={active === filter}
            onClick={() => setActive(filter)}
          >
            {filter}
          </Tag>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-10 text-ink-muted">
          Loading projects...
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
  key={project._id}
  project={project}
  onDelete={() => {
    setSelectedProject(project);
    setShowDelete(true);
  }}
/>
          ))}

          {filteredProjects.length === 0 && (
            <p className="text-sm text-ink-faint col-span-full text-center">
              No projects found.
            </p>
          )}
        </div>
      )}

      <DeleteProjectModal
  isOpen={showDelete}
  projectId={selectedProject?._id}
  projectTitle={selectedProject?.title}
  onClose={() => {
    setShowDelete(false);
    setSelectedProject(null);
  }}
  onDeleted={(id) => {
    setProjects((prev) => prev.filter((p) => p._id !== id));
  }}
/>
    </AppShell>
  );
}