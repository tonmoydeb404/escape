import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import clsx from 'clsx';
import { APP_CONFIG } from '../config/app';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true;
    setIsInstalled(isAppInstalled);

    // Don't show installer if already installed
    if (isAppInstalled) return;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      // Save the event for later use
      setDeferredPrompt(e);
      // Show our custom install banner after a delay
      setTimeout(() => {
        setShowInstallBanner(true);
      }, 3000); // Show after 3 seconds
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || 
      !showInstallBanner || 
      !deferredPrompt ||
      sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className={clsx(
        "bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-4 shadow-xl",
        "border border-white/10 backdrop-blur-sm",
        "animate-slide-up"
      )}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 p-2 bg-white/20 rounded-xl">
            <Download size={20} className="text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">
              Install {APP_CONFIG.shortName}
            </h3>
            <p className="text-blue-100 text-xs mt-1 leading-relaxed">
              Get the full app experience with offline access to your ambient sounds
            </p>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleInstallClick}
                className={clsx(
                  "px-3 py-1.5 bg-white text-blue-600 rounded-lg text-xs font-semibold",
                  "hover:bg-blue-50 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-white/50"
                )}
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className={clsx(
                  "px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-medium",
                  "hover:bg-white/30 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-white/50"
                )}
              >
                Not now
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className={clsx(
              "flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-white/50"
            )}
          >
            <X size={16} className="text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook to detect PWA installation status
export function usePWAInstalled() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                            (window.navigator as any).standalone === true;
      setIsInstalled(isAppInstalled);
    };

    checkInstalled();
    
    const handleAppInstalled = () => setIsInstalled(true);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return isInstalled;
}