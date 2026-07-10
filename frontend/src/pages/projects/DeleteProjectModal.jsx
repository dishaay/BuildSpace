import { useState } from "react";
import axios from "axios";
import { AlertTriangle, Loader2 } from "lucide-react";
import Button from "./Button";

/**
 * Reusable confirmation modal for deleting a project.
 *
 * Props:
 * - isOpen: boolean — controls visibility
 * - projectId: string — id passed to DELETE /api/projects/:id
 * - projectTitle: string — shown in the confirmation copy
 * - onClose: () => void — called on cancel / backdrop click / after error dismiss
 * - onDeleted: (projectId: string) => void — called after a successful delete
 *
 * Usage:
 * <DeleteProjectModal
 *   isOpen={showModal}
 *   projectId={project.id}
 *   projectTitle={project.title}
 *   onClose={() => setShowModal(false)}
 *   onDeleted={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
 * />
 */
export default function DeleteProjectModal({ isOpen, projectId, projectTitle, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onDeleted?.(projectId);
      onClose?.();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete this project. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget && !deleting) {
      onClose?.();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-riseIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-project-title"
    >
      <div className="w-full max-w-sm bg-bg-surface border border-border rounded-xl p-6 shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <span className="shrink-0 w-9 h-9 rounded-lg bg-accent-coral/15 border border-accent-coral/30 flex items-center justify-center">
            <AlertTriangle size={18} className="text-accent-coral" />
          </span>
          <div className="min-w-0">
            <h2 id="delete-project-title" className="font-display font-semibold text-ink text-base">
              Delete project?
            </h2>
            <p className="text-sm text-ink-muted mt-1 leading-relaxed">
              This will permanently delete{" "}
              <span className="text-ink font-medium">
                {projectTitle ? `"${projectTitle}"` : "this project"}
              </span>
              . This action can't be undone.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-accent-coral/10 border border-accent-coral/30 text-accent-coral text-xs rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            icon={deleting ? Loader2 : undefined}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}