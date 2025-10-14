import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification, markAsRead } = useNotifications();

  // Only show toast notifications (last 5 unread)
  const toastNotifications = notifications
    .filter(n => !n.read)
    .slice(0, 5);

  return (
    <div
      aria-live="assertive"
      className="fixed top-4 right-4 z-50 flex flex-col space-y-4 pointer-events-none"
    >
      {toastNotifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
          onMarkRead={() => markAsRead(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
