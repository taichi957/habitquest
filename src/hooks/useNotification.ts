import { useNotificationStore } from "../store/useNotificationStore.ts";
import type { NotificationType } from "../store/useNotificationStore.ts";

export function useNotification() {
  const add = useNotificationStore((s) => s.add);
  return (message: string, type: NotificationType = "info", duration?: number) => {
    add(message, type, duration);
  };
}
