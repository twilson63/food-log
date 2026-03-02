import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>You're offline — data will sync when connected</span>
      </div>
    </div>
  );
}

// Connection status component for settings/about
export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-amber-600 dark:text-amber-400">Offline</span>
        </>
      )}
    </div>
  );
}