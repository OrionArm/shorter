import React from "react";
import { swManager, type SwRegistrationOptions } from "./sw-registration";

// Хук для React компонентов
export const useServiceWorker = (options: SwRegistrationOptions = {}) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = React.useState(false);
  const [isOfflineReady, setIsOfflineReady] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [updateSW, setUpdateSW] = React.useState<(() => Promise<void>) | null>(
    null,
  );

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    swManager.registerSW({
      ...options,
      onUpdateAvailable: (info) => {
        setIsUpdateAvailable(true);
        setUpdateSW(() => info.updateSW);
        options.onUpdateAvailable?.(info);
      },
      onOfflineReady: () => {
        setIsOfflineReady(true);
        options.onOfflineReady?.();
      },
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const triggerUpdate = React.useCallback(async () => {
    if (updateSW) {
      await updateSW();
      setIsUpdateAvailable(false);
    }
  }, [updateSW]);

  return {
    isUpdateAvailable,
    isOfflineReady,
    isOnline,
    updateSW: triggerUpdate,
    refreshCache: swManager.refreshCache,
  };
};

// Утилита для регистрации SW без React
export const registerServiceWorker = (options: SwRegistrationOptions = {}) => {
  return swManager.registerSW(options);
};
