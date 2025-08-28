import { useEffect, useState } from "react";

/**
 * PWA utilities for service worker registration and update handling
 */

export interface PWAUpdateEvent {
  type: "update-available" | "update-ready" | "offline-ready";
  registration?: ServiceWorkerRegistration;
}

type PWAEventListener = (event: PWAUpdateEvent) => void;

class PWAManager {
  private listeners: PWAEventListener[] = [];
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    if ("serviceWorker" in navigator) {
      try {
        // The service worker will be automatically registered by vite-plugin-pwa
        // We just need to listen for updates
        this.setupUpdateListener();
      } catch (error) {
        console.error("SW registration failed:", error);
      }
    }
  }

  private setupUpdateListener() {
    // Listen for service worker updates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "SW_UPDATE_AVAILABLE") {
          this.notifyListeners({ type: "update-available" });
        }
      });

      navigator.serviceWorker.ready.then((registration) => {
        this.registration = registration;

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      });
    }
  }

  public onUpdate(listener: PWAEventListener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(event: PWAUpdateEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  public async updateApp() {
    if (this.registration && this.registration.waiting) {
      // Send message to waiting SW to skip waiting
      this.registration.waiting.postMessage({ type: "SKIP_WAITING" });
      // Reload the page to activate the new service worker
      window.location.reload();
    }
  }

  public isInstalled(): boolean {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );
  }

  public async getInstallationStatus() {
    const isInstalled = this.isInstalled();
    const isInstallable = "BeforeInstallPromptEvent" in window;

    return {
      isInstalled,
      isInstallable,
      canInstall: isInstallable && !isInstalled,
    };
  }
}

export const pwaManager = new PWAManager();

// Hook for React components
export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const unsubscribe = pwaManager.onUpdate((event) => {
      if (event.type === "update-available") {
        setUpdateAvailable(true);
      }
    });

    return unsubscribe;
  }, []);

  const updateApp = () => {
    pwaManager.updateApp();
  };

  return { updateAvailable, updateApp };
}
