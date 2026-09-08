const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

// Menu-item images are served by the backend at /uploads/... (not bundled with
// the frontend build), so they need the backend's origin prefixed. Anything
// else (legacy /images/... paths, data: URIs, already-absolute URLs) passes through.
export const getImageUrl = (path?: string): string => {
  if (!path) return '';
  if (path.startsWith('/uploads/')) return `${SERVER_ORIGIN}${path}`;
  return path;
};
