import { useState, useEffect } from 'react';
import { Download, X, Share, Plus } from 'lucide-react';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState('other'); // 'ios', 'android', 'other'
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if already installed or dismissed
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) return;

    // Detect platform
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) setPlatform('ios');
    else if (isAndroid) setPlatform('android');
    else setPlatform('other');

    // Check if already a PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show for iOS after a delay
    if (isIOS) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 5000); // Show after 5 seconds
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    // Show for desktop after delay
    const timer = setTimeout(() => {
      setShow(true);
    }, 10000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_install_dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-4 top-4 z-50 pointer-events-auto">
      <div className="card p-4 shadow-xl border-2 border-primary-200 dark:border-primary-800 max-w-sm mx-auto animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white">Install SnapCal</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {platform === 'ios' ? (
                <>Tap <Share className="w-3 h-3 inline" /> then "Add to Home Screen" <Plus className="w-3 h-3 inline" /></>
              ) : platform === 'android' ? (
                'Install as an app for quick access'
              ) : (
                'Install as an app for offline access'
              )}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        {platform !== 'ios' && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 btn-primary py-2 text-sm"
            >
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="btn-secondary py-2 px-3 text-sm"
            >
              Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}