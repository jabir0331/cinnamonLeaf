import { useIdleLogout } from '../hooks/useIdleLogout';

// Renders nothing - just activates the idle-logout timer app-wide.
const IdleLogoutWatcher: React.FC = () => {
  useIdleLogout();
  return null;
};

export default IdleLogoutWatcher;
