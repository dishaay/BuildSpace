const BACKEND_ORIGIN = "https://buildspace-backend-w1v9.onrender.com";
export function getImageUrl(path) {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${BACKEND_ORIGIN}${normalizedPath}`;
}