import { Workbox } from "workbox-window";

export interface SwUpdateInfo {
  isUpdateAvailable: boolean;
  updateSW: () => Promise<void>;
  registration: ServiceWorkerRegistration | null;
}

export interface SwRegistrationOptions {
  onUpdateAvailable?: (info: SwUpdateInfo) => void;
  onUpdateReady?: () => void;
  onOfflineReady?: () => void;
  onError?: (error: Error) => void;
  autoUpdate?: boolean;
}

class ServiceWorkerManager {
  private wb: Workbox | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private updateResolve: (() => void) | null = null;
  private isOnline = navigator.onLine;

  constructor() {
    // Отслеживаем изменения сетевого статуса
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.handleOnlineStatusChange();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.handleOnlineStatusChange();
    });
  }

  private handleOnlineStatusChange() {
    console.log(`App is now ${this.isOnline ? "online" : "offline"}`);
  }

  async registerSW(options: SwRegistrationOptions = {}): Promise<void> {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service Worker is not supported in this browser");
      return;
    }

    const {
      onUpdateAvailable,
      //   onUpdateReady,
      onOfflineReady,
      onError,
      autoUpdate = false,
    } = options;

    try {
      // Используем vite-plugin-pwa для регистрации во всех режимах
      const { registerSW } = await import("virtual:pwa-register");

      const updateSW = registerSW({
        onNeedRefresh: () => {
          console.log("SW need refresh");
          if (autoUpdate) {
            updateSW();
          } else {
            onUpdateAvailable?.({
              isUpdateAvailable: true,
              updateSW,
              registration: this.registration,
            });
          }
        },
        onOfflineReady: () => {
          console.log("SW offline ready");
          onOfflineReady?.();
        },
        onRegistered: (registration) => {
          console.log("SW registered:", registration);
          this.registration = registration ?? null;
        },
        onRegisterError: (error) => {
          console.error("SW registration error:", error);
          onError?.(error);
        },
      });
    } catch (error) {
      console.error("SW registration failed:", error);
      onError?.(error as Error);
    }
  }

  // Метод для ручного обновления SW
  async updateSW(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
    }
  }

  // Метод для получения информации о SW
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  // Метод для отправки сообщения SW
  async sendMessage(message: any): Promise<void> {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage(message);
    }
  }

  // Метод для проверки статуса сети
  isAppOnline(): boolean {
    return this.isOnline;
  }

  // Метод для принудительного обновления кэша
  async refreshCache(): Promise<void> {
    if (this.registration) {
      await this.sendMessage({ type: "REFRESH_CACHE" });
    }
  }
}

// Экземпляр менеджера SW
export const swManager = new ServiceWorkerManager();
