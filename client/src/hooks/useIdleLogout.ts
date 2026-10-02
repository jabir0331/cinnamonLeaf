import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutUser } from '../services/auth';
import { clearStoredCart } from '../utils/cartStorage';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const CHECK_INTERVAL_MS = 30 * 1000;
const ACTIVITY_WRITE_THROTTLE_MS = 2 * 1000;
const ACTIVITY_STORAGE_KEY = 'lastActivityAt';
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

// Logs the user out after 30 minutes of no mouse/keyboard/scroll activity,
// so a token left open on an unattended device doesn't stay valid indefinitely.
// The activity timestamp lives in localStorage (not just in-memory) so it is
// shared across tabs - otherwise an idle tab would log out an active one,
// since all tabs share the same stored session.
export const useIdleLogout = () => {
  const navigate = useNavigate();
  const lastWriteRef = useRef(0);
  const loggedOutRef = useRef(false);

  useEffect(() => {
    const markActive = () => {
      const now = Date.now();
      if (now - lastWriteRef.current < ACTIVITY_WRITE_THROTTLE_MS) return;
      lastWriteRef.current = now;
      try {
        localStorage.setItem(ACTIVITY_STORAGE_KEY, String(now));
      } catch {
        // localStorage unavailable (private mode, quota) - idle tracking just won't persist
      }
    };

    ACTIVITY_EVENTS.forEach(event => window.addEventListener(event, markActive));

    const handleStorageChange = (e: StorageEvent) => {
      // Another tab logged out (manually or via its own idle timer) - follow it here too
      if (e.key === 'token' && e.newValue === null) {
        navigate('/login');
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const intervalId = setInterval(async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        loggedOutRef.current = false;
        return;
      }

      const lastActivity = Number(localStorage.getItem(ACTIVITY_STORAGE_KEY)) || Date.now();
      const idleFor = Date.now() - lastActivity;

      if (idleFor >= IDLE_TIMEOUT_MS && !loggedOutRef.current) {
        loggedOutRef.current = true;

        try {
          await logoutUser(token);
        } catch (error) {
          console.error('Auto-logout request failed:', error);
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          clearStoredCart();
          localStorage.removeItem(ACTIVITY_STORAGE_KEY);
          toast.info("You've been logged out due to inactivity.");
          navigate('/login');
        }
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, markActive));
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [navigate]);
};
