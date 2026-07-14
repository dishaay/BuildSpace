import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Button from "../../components/common/Button";
import { deleteProject } from "../../services/projectService";

export default function DeleteProjectModal({
  isOpen,
  projectId,
  projectTitle,
  onClose,
  onDeleted,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      await deleteProject(projectId);

      onDeleted(projectId);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't delete this project. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget && !deleting) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-bg-surface border border-border rounded-xl p-6">
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Delete Project?
            </h2>

            <p className="text-sm text-ink-muted mt-1">
              Are you sure you want to delete{" "}
              <span className="font-medium">
                "{projectTitle}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
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