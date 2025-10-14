import { useEffect } from 'react';
import { useNotificationEvents } from '@/hooks/useNotificationEvents';

/**
 * Component that listens for notification events throughout the app
 * Place this component once in your app layout
 */
const NotificationEventListener: React.FC = () => {
  useNotificationEvents();
  return null; // This component doesn't render anything
};

export default NotificationEventListener;
