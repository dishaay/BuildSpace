const BACKEND_ORIGIN = "http://localhost:5000";

export function getImageUrl(path) {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${BACKEND_ORIGIN}${normalizedPath}`;
}