export interface AuthRedirectState {
  from?: string;
  resumeCheckout?: boolean;
}

// Where to send a user after logging in or signing up. Admins always go to
// the dashboard; everyone else returns to the page that sent them to login
// (e.g. /menu from the checkout prompt), falling back to the homepage.
export const getPostLoginPath = (state: AuthRedirectState | null | undefined, role?: string): string => {
  if (role === 'admin') return '/admin/dashboard';

  const from = state?.from;
  // Only allow in-app absolute paths - never "//host" or full URLs
  if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')) {
    return from;
  }
  return '/';
};
