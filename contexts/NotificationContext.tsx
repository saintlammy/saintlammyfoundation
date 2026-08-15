import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 = persistent
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  success: (title: string, message: string, duration?: number) => string;
  error: (title: string, message: string, duration?: number) => string;
  warning: (title: string, message: string, duration?: number) => string;
  info: (title: string, message: string, duration?: number) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 50
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showNotification = useCallback((
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ): string => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false,
      duration: notification.duration ?? 5000, // Default 5 seconds
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep only max notifications
      return updated.slice(0, maxNotifications);
    });

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [maxNotifications, removeNotification]);

  const success = useCallback((title: string, message: string, duration?: number) => {
    return showNotification({ type: 'success', title, message, duration });
  }, [showNotification]);

  const error = useCallback((title: string, message: string, duration?: number) => {
    return showNotification({ type: 'error', title, message, duration: duration ?? 0 }); // Errors persist by default
  }, [showNotification]);

  const warning = useCallback((title: string, message: string, duration?: number) => {
    return showNotification({ type: 'warning', title, message, duration });
  }, [showNotification]);

  const info = useCallback((title: string, message: string, duration?: number) => {
    return showNotification({ type: 'info', title, message, duration });
  }, [showNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    showNotification,
    success,
    error,
    warning,
    info,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
