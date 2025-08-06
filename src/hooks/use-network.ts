import { useEffect, useState } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network: Back online');
      setIsOnline(true);
      setWasOffline(false);
    };

    const handleOffline = () => {
      console.log('Network: Gone offline');
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}

export function useConnectionRecovery() {
  const { isOnline, wasOffline } = useNetworkStatus();

  useEffect(() => {
    if (isOnline && wasOffline) {
      // Delay to allow for network stabilization
      const recoveryTimeout = setTimeout(() => {
        console.log('Network recovered, refreshing auth session...');
        // Trigger a session refresh by reloading the page
        // This prevents stale auth states after network recovery
        window.location.reload();
      }, 2000);

      return () => clearTimeout(recoveryTimeout);
    }
  }, [isOnline, wasOffline]);

  return { isOnline, wasOffline };
}
