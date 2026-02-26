import { useNotificationStore } from "../store/useNotificationStore.ts";
import type { Notification } from "../store/useNotificationStore.ts";

export default function NotificationList() {
  const notifications = useNotificationStore((s) => s.notifications);
  const remove = useNotificationStore((s) => s.remove);

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((n: Notification) => (
        <div key={n.id} className={`notification ${n.type}`}>
          <span>{n.message}</span>
          <button
            className="close-btn"
            onClick={() => remove(n.id)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
