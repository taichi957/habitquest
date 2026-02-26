import { create } from "zustand";

export type NotificationType = "info" | "success" | "warning" | "error";

export type Notification = {
  id: string;
  message: string;
  type: NotificationType;
};

type NotificationState = {
  notifications: Notification[];
  add: (message: string, type?: NotificationType, duration?: number) => void;
  remove: (id: string) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  add: (message, type = "info", duration = 3000) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }
  },
  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
